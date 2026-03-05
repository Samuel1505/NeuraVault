// Export all contract addresses and ABIs
export * from './IdentityRegistry';
export * from './ConsentManager';
export * from './PaymentDistributor';

// Re-export contract addresses for convenience
export {
    IDENTITY_REGISTRY_ADDRESS,
    getIdentityRegistryContract,
} from './IdentityRegistry';

export {
    CONSENT_MANAGER_ADDRESS,
    getConsentManagerContract,
} from './ConsentManager';

export {
    PAYMENT_DISTRIBUTOR_ADDRESS,
    getPaymentDistributorContract,
} from './PaymentDistributor';
