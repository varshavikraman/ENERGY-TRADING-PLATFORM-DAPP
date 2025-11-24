import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ProducerRegistryModule", (m) => {
  // Deploy ProducerRegistry contract
  const registry = m.contract("ProducerRegistry");

  return { registry };
});
