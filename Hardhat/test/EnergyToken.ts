import { describe, it } from "node:test";
import { network } from "hardhat";
import assert from "node:assert/strict";

describe("EnergyToken Tests", async function () {
    const { viem, networkHelpers } = await network.connect();

    async function deployToken() {
        const [admin, producer, nonProducer] = await viem.getWalletClients();

        // Deploy MockProducerRegistry for testing
        const registry = await viem.deployContract("MockProducerRegistry");

        // Approve the producer
        await registry.write.setApproved([producer.account.address, true]);

        // Deploy EnergyToken with registry
        const token = await viem.deployContract("EnergyToken", [registry.address]);

        return { admin, producer, nonProducer, token, registry };
    }

    it("should allow approved producer to mint tokens", async () => {
        const { token, producer } = await networkHelpers.loadFixture(deployToken);

        await token.write.mintEnergy([100n], { account: producer.account });

        const balance = await token.read.balanceOf([producer.account.address]);
        assert.equal(balance, 100n);
    });

    it("should NOT allow non-approved user to mint tokens", async () => {
        const { token, nonProducer } = await networkHelpers.loadFixture(deployToken);

        await assert.rejects(
            token.write.mintEnergy([50n], { account: nonProducer.account })
        );
    });

    it("should allow approved producer to transfer tokens", async () => {
        const { token, producer, nonProducer } = await networkHelpers.loadFixture(deployToken);

        // Mint tokens first
        await token.write.mintEnergy([200n], { account: producer.account });

        // Transfer 50 tokens to nonProducer
        await token.write.transfer([nonProducer.account.address, 50n], { account: producer.account });

        const producerBal = await token.read.balanceOf([producer.account.address]);
        const nonProducerBal = await token.read.balanceOf([nonProducer.account.address]);

        assert.equal(producerBal, 150n);
        assert.equal(nonProducerBal, 50n);
    });
});
