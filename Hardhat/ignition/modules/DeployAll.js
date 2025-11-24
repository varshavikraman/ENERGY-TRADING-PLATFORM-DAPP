import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeployAllModule", (m) => {
  
  // Deploy registry
  const registry = m.contract("ProducerRegistry");

  // Deploy token with registry address
  const token = m.contract("EnergyToken", [registry]);

  // Deploy marketplace with registry + token
  const marketplace = m.contract("EnergyMarketplace", [
    registry,
    token
  ]);

  return {
    registry,
    token,
    marketplace
  };
});
