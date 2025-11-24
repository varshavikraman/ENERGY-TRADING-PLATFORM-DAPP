import { describe, it } from "node:test";
import { network } from "hardhat";
import assert from "node:assert/strict";
import { parseEther } from "viem";

describe("EnergyMarketplace Tests", async function () {
    const { viem, networkHelpers } = await network.connect();

        async function deployAll() {
        const [owner, producer, buyer] = await viem.getWalletClients();

        const token = await viem.deployContract("MockEnergyToken");
        const registry = await viem.deployContract("MockProducerRegistry");

        const market = await viem.deployContract("EnergyMarketplace", [
            token.address,
            registry.address
        ]);

        // approve producer
        await registry.write.setApproved([producer.account.address, true]);

        // producer gets some energy tokens
        await token.write.mint([producer.account.address, 1000n]);

        return {owner, producer, buyer, BigInt, token, registry, market};
    }

    type MarketDetails = [string, bigint, bigint, boolean];

    it("should allow approved producer to list energy", async () => {
        const { market, producer } = await networkHelpers.loadFixture(deployAll);

        await market.write.listEnergy([100n, 2n], { account: producer.account });

        const listing = await market.read.listings([0n]) as MarketDetails;

        assert.equal(listing[0].toLowerCase(), producer.account.address.toLowerCase());
        assert.equal(listing[1], 100n);
        assert.equal(listing[2], 2n);
        assert.equal(listing[3], true);
    });


    it("should NOT allow unapproved user to list energy", async () => {
        const { market, owner } = await networkHelpers.loadFixture(deployAll);

        await assert.rejects(
        market.write.listEnergy(
                [100n, 1n], 
                { account: owner.account }
            ),
        );
    });

    it("should allow buyer to purchase energy", async () => {
    const { market, token, producer, buyer } = await networkHelpers.loadFixture(deployAll);

    // Producer lists energy: amount = 50, price = 2 wei per unit
    await market.write.listEnergy([50n, 2n], {
        account: producer.account,
    });

    // Buyer purchases 20 units → cost = 20 * 2 = 40 wei
    await market.write.buyEnergy([0n, 20n], {
        account: buyer.account,
        value: 40n, // exact match: amount * price
    });

    const listing = await market.read.listings([0n]);
    const buyerBal = await token.read.balance([buyer.account.address]);

    assert.equal(listing[1], 30n);  // remaining amount = 50 - 20
    assert.equal(buyerBal, 20n);    // tokens received
});

it("should mark listing inactive when amount reaches zero", async () => {
    const { market, producer, buyer } = await networkHelpers.loadFixture(deployAll);

    // Producer lists 10 units at price = 1 wei per unit
    await market.write.listEnergy([10n, 1n], {
        account: producer.account,
    });

    // Buyer purchases all 10 units → cost = 10 * 1 = 10 wei
    await market.write.buyEnergy([0n, 10n], {
        account: buyer.account,
        value: 10n, // matches total cost
    });

    const listing = await market.read.listings([0n]);

    assert.equal(listing[1], 0n);      // amount left
    assert.equal(listing[3], false);   // listing inactive
});


  it("should reject incorrect ETH payments", async () => {
    const { market, producer, buyer } = await networkHelpers.loadFixture(deployAll);

    await market.write.listEnergy([20n, 2n], { account: producer.account });

    // cost = 20 * 2 = 40 ETH, but buyer sends 1 ETH
    await assert.rejects(
      market.write.buyEnergy([0n, 20n], {
        account: buyer.account,
        value: parseEther("1"),
      })
    );
  });

});
