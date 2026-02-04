import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Neural Privacy Smart Contracts", function () {
    describe("IdentityRegistry", function () {
        it("Should register and manage users", async function () {
            const [owner, user1, researcher] = await ethers.getSigners();
            const registry = await ethers.deployContract("IdentityRegistry");

            const publicKeyHash = ethers.keccak256(ethers.toUtf8Bytes("test-key"));
            const vaultCID = "QmTestVault";
            const keyCID = "QmTestKey";

            // Register user
            await expect(
                registry.connect(user1).registerUser(publicKeyHash, vaultCID, keyCID)
            ).to.emit(registry, "UserRegistered");

            // Verify profile
            const profile = await registry.getUserProfile(user1.address);
            expect(profile.active).to.be.true;
            expect(profile.dataVaultCID).to.equal(vaultCID);
        });

        it("Should grant and revoke access", async function () {
            const [owner, user1, researcher] = await ethers.getSigners();
            const registry = await ethers.deployContract("IdentityRegistry");

            const publicKeyHash = ethers.keccak256(ethers.toUtf8Bytes("test-key"));

            // Register both users
            await registry.connect(user1).registerUser(publicKeyHash, "QmVault1", "QmKey1");
            await registry.connect(researcher).registerUser(publicKeyHash, "QmVault2", "QmKey2");

            // Grant access
            await expect(
                registry.connect(user1).grantAccess(
                    researcher.address,
                    "EEG",
                    86400,
                    ethers.parseEther("1.0"),
                    "Research"
                )
            ).to.emit(registry, "AccessGranted");

            // Verify access
            let isValid = await registry.isAccessValid(user1.address, researcher.address, "EEG");
            expect(isValid).to.be.true;

            // Revoke access
            await registry.connect(user1).revokeAccess(researcher.address, "EEG");
            isValid = await registry.isAccessValid(user1.address, researcher.address, "EEG");
            expect(isValid).to.be.false;
        });
    });

    describe("PaymentDistributor", function () {
        it("Should create and escrow payments", async function () {
            const [owner, dataOwner, researcher] = await ethers.getSigners();
            const distributor = await ethers.deployContract("PaymentDistributor");

            const amount = ethers.parseEther("1.0");

            // Create agreement
            await expect(
                distributor.connect(researcher).createPaymentAgreement(dataOwner.address, amount, 0)
            ).to.emit(distributor, "AgreementCreated");

            // Escrow payment
            await expect(
                distributor.connect(researcher).escrowPayment(dataOwner.address, 1, { value: amount })
            ).to.emit(distributor, "PaymentEscrowed");

            // Verify escrow
            const agreement = await distributor.getPaymentAgreement(dataOwner.address, researcher.address, 1);
            expect(agreement.escrowed).to.be.true;
            expect(agreement.amount).to.equal(amount);
        });

        it("Should release payments", async function () {
            const [owner, dataOwner, researcher] = await ethers.getSigners();
            const distributor = await ethers.deployContract("PaymentDistributor");

            const amount = ethers.parseEther("1.0");

            // Create and escrow
            await distributor.connect(researcher).createPaymentAgreement(dataOwner.address, amount, 0);
            await distributor.connect(researcher).escrowPayment(dataOwner.address, 1, { value: amount });

            // Release payment
            await expect(
                distributor.connect(dataOwner).releasePayment(researcher.address, 1)
            ).to.emit(distributor, "PaymentReleased");

            // Verify release
            const agreement = await distributor.getPaymentAgreement(dataOwner.address, researcher.address, 1);
            expect(agreement.released).to.be.true;
            expect(agreement.paid).to.be.true;
        });

        it("Should manage platform fees", async function () {
            const [owner] = await ethers.getSigners();
            const distributor = await ethers.deployContract("PaymentDistributor");

            const newFee = 500; // 5%

            await expect(
                distributor.connect(owner).updatePlatformFee(newFee)
            ).to.emit(distributor, "FeeUpdated");

            expect(await distributor.platformFeePercent()).to.equal(newFee);
        });
    });

    describe("ConsentManager", function () {
        it("Should set consent preferences", async function () {
            const [owner, user1] = await ethers.getSigners();
            const consent = await ethers.deployContract("ConsentManager");

            await expect(
                consent.connect(user1).setConsentPreference(
                    "EEG",
                    2, // AGGREGATED
                    ["Research", "Medical"],
                    86400,
                    ethers.parseEther("0.5"),
                    false
                )
            ).to.emit(consent, "ConsentPreferenceSet");

            const pref = await consent.getConsentPreference(user1.address, "EEG");
            expect(pref.consentLevel).to.equal(2);
        });

        it("Should request and approve consent", async function () {
            const [owner, dataOwner, researcher] = await ethers.getSigners();
            const consent = await ethers.deployContract("ConsentManager");

            // Set preference
            await consent.connect(dataOwner).setConsentPreference(
                "EEG",
                2,
                ["Research"],
                86400,
                ethers.parseEther("0.5"),
                false
            );

            // Request consent
            await expect(
                consent.connect(researcher).requestConsent(dataOwner.address, "EEG", 2, "Brain research")
            ).to.emit(consent, "ConsentRequested");

            // Approve consent
            await expect(
                consent.connect(dataOwner).approveConsentRequest(researcher.address, 1)
            ).to.emit(consent, "ConsentApproved");

            const isApproved = await consent.isConsentApproved(dataOwner.address, researcher.address, 1);
            expect(isApproved).to.be.true;
        });
    });
});
