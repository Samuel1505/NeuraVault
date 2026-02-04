import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("PaymentDistributor", function () {
    describe("Payment Agreement Creation", function () {
        it("Should create a payment agreement", async function () {
            const [owner, dataOwner, researcher] = await ethers.getSigners();
            const paymentDistributor = await ethers.deployContract("PaymentDistributor");

            const amount = ethers.parseEther("1.0");

            await expect(
                paymentDistributor.connect(researcher).createPaymentAgreement(
                    dataOwner.address,
                    amount,
                    0
                )
            )
                .to.emit(paymentDistributor, "AgreementCreated")
                .withArgs(dataOwner.address, researcher.address, 1, amount);

            const agreement = await paymentDistributor.getPaymentAgreement(
                dataOwner.address,
                researcher.address,
                1
            );
            expect(agreement.amount).to.equal(amount);
            expect(agreement.escrowed).to.be.false;
        });

        it("Should fail with invalid parameters", async function () {
            const [owner, dataOwner, researcher] = await ethers.getSigners();
            const paymentDistributor = await ethers.deployContract("PaymentDistributor");

            await expect(
                paymentDistributor.connect(researcher).createPaymentAgreement(
                    dataOwner.address,
                    0,
                    0
                )
            ).to.be.revertedWith("Amount must be positive");
        });
    });

    describe("Payment Escrow", function () {
        it("Should escrow payment", async function () {
            const [owner, dataOwner, researcher] = await ethers.getSigners();
            const paymentDistributor = await ethers.deployContract("PaymentDistributor");

            const amount = ethers.parseEther("1.0");

            await paymentDistributor.connect(researcher).createPaymentAgreement(
                dataOwner.address,
                amount,
                0
            );

            await expect(
                paymentDistributor.connect(researcher).escrowPayment(
                    dataOwner.address,
                    1,
                    { value: amount }
                )
            )
                .to.emit(paymentDistributor, "PaymentEscrowed")
                .withArgs(dataOwner.address, researcher.address, 1, amount);

            const agreement = await paymentDistributor.getPaymentAgreement(
                dataOwner.address,
                researcher.address,
                1
            );
            expect(agreement.escrowed).to.be.true;
        });

        it("Should fail with incorrect amount", async function () {
            const [owner, dataOwner, researcher] = await ethers.getSigners();
            const paymentDistributor = await ethers.deployContract("PaymentDistributor");

            const amount = ethers.parseEther("1.0");

            await paymentDistributor.connect(researcher).createPaymentAgreement(
                dataOwner.address,
                amount,
                0
            );

            await expect(
                paymentDistributor.connect(researcher).escrowPayment(
                    dataOwner.address,
                    1,
                    { value: ethers.parseEther("0.5") }
                )
            ).to.be.revertedWith("Incorrect payment amount");
        });
    });

    describe("Payment Release", function () {
        it("Should release payment to data owner", async function () {
            const [owner, dataOwner, researcher] = await ethers.getSigners();
            const paymentDistributor = await ethers.deployContract("PaymentDistributor");

            const amount = ethers.parseEther("1.0");

            await paymentDistributor.connect(researcher).createPaymentAgreement(
                dataOwner.address,
                amount,
                0
            );

            await paymentDistributor.connect(researcher).escrowPayment(
                dataOwner.address,
                1,
                { value: amount }
            );

            await expect(
                paymentDistributor.connect(dataOwner).releasePayment(
                    researcher.address,
                    1
                )
            ).to.emit(paymentDistributor, "PaymentReleased");

            const agreement = await paymentDistributor.getPaymentAgreement(
                dataOwner.address,
                researcher.address,
                1
            );
            expect(agreement.released).to.be.true;
            expect(agreement.paid).to.be.true;
        });
    });

    describe("Platform Fee Management", function () {
        it("Should update platform fee (owner only)", async function () {
            const [owner] = await ethers.getSigners();
            const paymentDistributor = await ethers.deployContract("PaymentDistributor");

            const newFee = 500; // 5%

            await expect(
                paymentDistributor.connect(owner).updatePlatformFee(newFee)
            ).to.emit(paymentDistributor, "FeeUpdated").withArgs(newFee);

            expect(await paymentDistributor.platformFeePercent()).to.equal(newFee);
        });

        it("Should fail to set fee above maximum", async function () {
            const [owner] = await ethers.getSigners();
            const paymentDistributor = await ethers.deployContract("PaymentDistributor");

            await expect(
                paymentDistributor.connect(owner).updatePlatformFee(1001)
            ).to.be.revertedWith("Fee too high");
        });
    });
});
