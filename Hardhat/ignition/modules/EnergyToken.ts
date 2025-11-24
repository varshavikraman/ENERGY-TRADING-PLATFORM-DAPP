import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ProducerRegistryModule from "./ProducerRegistry.js";

export default buildModule("EnergyTokenModule", (m) => {
    // Import the ProducerRegistry module
  // Load previously deployed ProducerRegistry
  const { registry } = m.useModule(ProducerRegistryModule);

  // Deploy EnergyToken with registry address
  const token = m.contract("EnergyToken", [registry]);

  return { token };
});

