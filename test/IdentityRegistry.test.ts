import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("IdentityRegistry", function () {
    const publicKeyHash = ethers.keccak256(ethers.toUtf8Bytes("test-public-key"));
    const vaultCID = "QmTest123VaultCID";
    const keyCID = "QmTest456KeyCID";

    describe("User Registration", function () {
        it("Should register a new user successfully", async function () {
            const [owner, user1] = await ethers.getSigners();
            const identityRegistry = await ethers.deployContract("IdentityRegistry");

            await expect(
                identityRegistry.connect(user1).registerUser(publicKeyHash, vaultCID, keyCID)
            ).to.emit(identityRegistry, "UserRegistered");

            const profile = await identityRegistry.getUserProfile(user1.address);
            expect(profile.publicKeyHash).to.equal(publicKeyHash);
            expect(profile.dataVaultCID).to.equal(vaultCID);
            expect(profile.encryptionKeyCID).to.equal(keyCID);
            expect(profile.active).to.be.true;
        });

        it("Should fail if user already registered", async function () {
            const [owner, user1] = await ethers.getSigners();
            const identityRegistry = await ethers.deployContract("IdentityRegistry");

            await identityRegistry.connect(user1).registerUser(publicKeyHash, vaultCID, keyCID);

            await expect(
                identityRegistry.connect(user1).registerUser(publicKeyHash, vaultCID, keyCID)
            ).to.be.revertedWith("User already registered");
        });

        it("Should fail with invalid parameters", async function () {
            const [owner, user1] = await ethers.getSigners();
            const identityRegistry = await ethers.deployContract("IdentityRegistry");

            await expect(
                identityRegistry.connect(user1).registerUser(ethers.ZeroHash, vaultCID, keyCID)
            ).to.be.revertedWith("Invalid public key hash");

            await expect(
                identityRegistry.connect(user1).registerUser(publicKeyHash, "", keyCID)
            ).to.be.revertedWith("Invalid vault CID");
        });
    });

    describe("Access Grants", function () {
        it("Should grant access to researcher", async function () {
            const [owner, user1, researcher] = await ethers.getSigners();
            const identityRegistry = await ethers.deployContract("IdentityRegistry");

            await identityRegistry.connect(user1).registerUser(publicKeyHash, vaultCID, keyCID);
            await identityRegistry.connect(researcher).registerUser(publicKeyHash, "QmResearcherVault", "QmResearcherKey");

            const dataCategory = "EEG";
            const duration = 86400;
            const compensation = ethers.parseEther("1.0");
            const purpose = "Brain activity research";

            await expect(
                identityRegistry.connect(user1).grantAccess(
                    researcher.address,
                    dataCategory,
                    duration,
                    compensation,
                    purpose
                )
            ).to.emit(identityRegistry, "AccessGranted");

            const isValid = await identityRegistry.isAccessValid(
                user1.address,
                researcher.address,
                dataCategory
            );
            expect(isValid).to.be.true;
        });

        it("Should revoke access", async function () {
            const [owner, user1, researcher] = await ethers.getSigners();
            const identityRegistry = await ethers.deployContract("IdentityRegistry");

            await identityRegistry.connect(user1).registerUser(publicKeyHash, vaultCID, keyCID);
            await identityRegistry.connect(researcher).registerUser(publicKeyHash, "QmResearcherVault", "QmResearcherKey");

            const dataCategory = "EEG";
            await identityRegistry.connect(user1).grantAccess(
                researcher.address,
                dataCategory,
                86400,
                ethers.parseEther("1.0"),
                "Research"
            );

            await expect(
                identityRegistry.connect(user1).revokeAccess(researcher.address, dataCategory)
            ).to.emit(identityRegistry, "AccessRevoked");

            const isValid = await identityRegistry.isAccessValid(
                user1.address,
                researcher.address,
                dataCategory
            );
            expect(isValid).to.be.false;
        });
    });
});
