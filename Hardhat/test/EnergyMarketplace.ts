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
            registry.address,   // registry FIRST
            token.address       // token SECOND
        ]);

        // approve producer
        await registry.write.setApproved([producer.account.address, true]);

        // producer gets some energy tokens
        await token.write.mint([producer.account.address, 1000n]);

        await token.write.approve([market.address, 1000n], {
            account: producer.account
        });

        return {owner, producer, buyer, BigInt, token, registry, market};
    }

    type MarketDetails = [string, bigint, bigint, boolean];

    it("should allow approved producer to list energy", async () => {
        const { producer, market } = await networkHelpers.loadFixture(deployAll);

        await market.write.listEnergy([100n, 2n], { account: producer.account });

        const listing = await market.read.listings([0n]) as MarketDetails;

        assert.equal(listing[0].toLowerCase(), producer.account.address.toLowerCase());
        assert.equal(listing[1], 100n);
        assert.equal(listing[2], 2n);
        assert.equal(listing[3], true);
    });


    it("should NOT allow unapproved user to list energy", async () => {
        const { buyer, market } = await networkHelpers.loadFixture(deployAll);

        await assert.rejects(
        market.write.listEnergy(
                [100n, 1n], 
                { account: buyer.account }
            ),
        );
    });

    it("should allow buyer to purchase energy", async () => {
    const { market, token, producer, buyer } = await networkHelpers.loadFixture(deployAll);

    // Producer lists energy: amount = 50, price = 2 wei per unit
    await market.write.listEnergy([50n, 2n], {
            account: producer.account
        });

    // Buyer purchases 20 units → cost = 20 * 2 = 40 wei
    await market.write.buyEnergy([0n, 10n], {
            value: 20n, // 10 units × price 2
            account: buyer.account
        });
    
    const listing = await market.read.listings([0n]);
    assert.equal(listing[1], 40n);

    const buyerBalance = await token.read.balanceOf([buyer.account.address]);
    assert.equal(buyerBalance, 10n);  // tokens received
});

it("should mark listing inactive when amount reaches zero", async () => {
    const { market, producer, buyer } = await networkHelpers.loadFixture(deployAll);

    // Producer lists 10 units at price = 1 wei per unit
    await market.write.listEnergy([10n, 1n], {
        account: producer.account,
    });

    // Buyer purchases all 10 units → cost = 10 * 1 = 10 wei
    await market.write.buyEnergy([0n, 10n], {
        value: 10n,
        account: buyer.account
    });

    const listing = await market.read.listings([0n]);

    assert.equal(listing[1], 0n);      // amount left
    assert.equal(listing[3], false);   // listing inactive
});


  it("should reject incorrect ETH payments", async () => {
    const { market, producer, buyer } = await networkHelpers.loadFixture(deployAll);

    await market.write.listEnergy([20n, 2n], { 
        account: producer.account 
    });

    // cost = 20 * 2 = 40 ETH, but buyer sends 1 ETH
    await assert.rejects(
      market.write.buyEnergy([0n, 5n], {
        value: 1n, // WRONG (should be 10)
        account: buyer.account
      })
    );
  });

});
