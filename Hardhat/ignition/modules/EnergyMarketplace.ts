import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ProducerRegistryModule from "./ProducerRegistry.js";
import EnergyTokenModule from "./EnergyToken.js";

export default buildModule("EnergyMarketplaceModule", (m) => {
  const { registry } = m.useModule(ProducerRegistryModule);
  const { token } = m.useModule(EnergyTokenModule);

  // Deploy marketplace with registry + token addresses
  const marketplace = m.contract("EnergyMarketplace", [
    registry,
    token
  ]);

  return { marketplace };
});

