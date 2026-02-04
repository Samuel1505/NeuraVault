import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NeuralPrivacyModule = buildModule("NeuralPrivacyModule", (m) => {
  // Deploy IdentityRegistry
  const identityRegistry = m.contract("IdentityRegistry");

  // Deploy ConsentManager
  const consentManager = m.contract("ConsentManager");

  // Deploy PaymentDistributor
  const paymentDistributor = m.contract("PaymentDistributor");

  return { identityRegistry, consentManager, paymentDistributor };
});

export default NeuralPrivacyModule;
