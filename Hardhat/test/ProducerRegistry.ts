import { describe, it } from "node:test";
import { network } from "hardhat";
import { getCreateAddress } from "viem";
import assert from "node:assert/strict";

describe("ProducerRegistry Tests", async function () {
  const { viem, networkHelpers } = await network.connect();

  async function deployContract() {
    const [admin, producer1, producer2] = await viem.getWalletClients();
    const registry = await viem.deployContract("ProducerRegistry");
    return { registry, admin, producer1, producer2 };
  }

  type ProducerDetails = [string, string, bigint, string, number];
  
  it("should be deployed by admin", async function () {
    const { admin, registry } = await networkHelpers.loadFixture(deployContract);

    const createdAddress = getCreateAddress({
      from: admin.account.address,
      nonce: 0n,
    });

    assert.equal(registry.address, createdAddress.toLowerCase());
  });

  it("should allow a producer to request approval", async () => {
    const { registry, producer1 } = await networkHelpers.loadFixture(deployContract);

    await registry.write.requestProducerApproval(
      ["Anu", "Kerala", 100n, "0xaadhaarHash"],
      { account: producer1.account }
    );

    const details = await registry.read.getProducerDetails([producer1.account.address]) as ProducerDetails;

    assert.equal(details[0], "Anu");
    assert.equal(details[1], "Kerala");
    assert.equal(details[2], 100n);
    assert.equal(details[3], "0xaadhaarHash");
    assert.equal(BigInt(details[4]), 1n); // Status.Pending
  });

  it("should allow admin to approve producer", async () => {
    const { registry, producer1, admin } = await networkHelpers.loadFixture(deployContract);

    await registry.write.requestProducerApproval(
      ["Anu", "Kerala", 100n, "0xaadhaarHash"],
      { account: producer1.account }
    );

    await registry.write.approveProducer(
      [producer1.account.address],
      { account: admin.account }
    );

    const isApproved = await registry.read.isApprovedProducer([producer1.account.address]);
    assert.equal(isApproved, true);
  });

  it("should allow admin to reject producer", async () => {
    const { registry, producer2, admin } = await networkHelpers.loadFixture(deployContract);

    await registry.write.requestProducerApproval(
      ["Bob", "Chennai", 150n, "0xhash"],
      { account: producer2.account }
    );

    await registry.write.rejectProducer(
      [producer2.account.address],
      { account: admin.account }
    );

    const details = await registry.read.getProducerDetails([producer2.account.address])as ProducerDetails;
    assert.equal(BigInt(details[4]), 3n); // Status.Rejected
  });

  it("should track pending producers", async () => {
    const { registry, producer1, producer2 } = await networkHelpers.loadFixture(deployContract);

    await registry.write.requestProducerApproval(
      ["A", "X", 50n, "0xaa"],
      { account: producer1.account }
    );

    await registry.write.requestProducerApproval(
      ["B", "Y", 75n, "0xbb"],
      { account: producer2.account }
    );

    const result = await registry.read.getPendingProducers() as string[];

    const lower = result.map(a => a.toLowerCase());

    assert.ok(lower.includes(producer1.account.address.toLowerCase()));
    assert.ok(lower.includes(producer2.account.address.toLowerCase()));

  });

  it("should remove producer from pending list after approval", async () => {
    const { registry, producer1, producer2, admin } =
      await networkHelpers.loadFixture(deployContract);

    await registry.write.requestProducerApproval(
      ["A", "X", 50n, "0xaa"],
      { account: producer1.account }
    );

    await registry.write.requestProducerApproval(
      ["B", "Y", 75n, "0xbb"],
      { account: producer2.account }
    );

    // Approve producer1
    await registry.write.approveProducer(
      [producer1.account.address],
      { account: admin.account }
    );

    // Check pending list
    const result = await registry.read.getPendingProducers() as string[];

    const lower = result.map(a => a.toLowerCase());

    assert.ok(!lower.includes(producer1.account.address.toLowerCase()));
    assert.ok(lower.includes(producer2.account.address.toLowerCase()));

  });

  it("should revert if capacity = 0", async () => {
    const { registry, producer1 } = await networkHelpers.loadFixture(deployContract);

    await assert.rejects(
      registry.write.requestProducerApproval(
        ["A", "X", 0n, "0xaa"],
        { account: producer1.account }
      ),
    );
  });

  it("should revert if aadhaar hash empty", async () => {
    const { registry, producer1 } = await networkHelpers.loadFixture(deployContract);

    await assert.rejects(
      registry.write.requestProducerApproval(
        ["A", "X", 10n, ""],
        { account: producer1.account }
      ),
    );
  });

  it("should revert when non-admin tries to approve", async () => {
    const { registry, producer1, producer2 } = await networkHelpers.loadFixture(deployContract);

    await registry.write.requestProducerApproval(
      ["Bob", "TN", 100n, "0xhash"],
      { account: producer2.account }
    );

    await assert.rejects(
      registry.write.approveProducer(
        [producer2.account.address],
        { account: producer1.account }
      ),
    );
  });

});
