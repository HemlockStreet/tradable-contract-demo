const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('LockV3', function () {
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    const [owner, otherAccount] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory('ExpensiveJpeg');
    const nft = await NFT.deploy();

    const NFT2 = await ethers.getContractFactory('OverrideNft');
    const nft2 = await NFT2.deploy();

    const Lock = await ethers.getContractFactory('LockV3');
    const lock = await Lock.deploy(unlockTime, nft.address, 1, {
      value: lockedAmount,
    });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe('Deployment', function () {
    it('Should set the right unlockTime', async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it('Should set the right owner', async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it('Should receive and store the funds to lock', async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await ethers.provider.getBalance(lock.address)).to.equal(
        lockedAmount
      );
    });

    it('Should fail if the unlockTime is not in the future', async function () {
      const latestTime = await time.latest();
      const NFT = await ethers.getContractFactory('ExpensiveJpeg');
      const nft = await NFT.deploy();
      const Lock = await ethers.getContractFactory('LockV3');
      await expect(
        Lock.deploy(latestTime, nft.address, 1, { value: 1 })
      ).to.be.revertedWith('Unlock time should be in the future');
    });
  });

  describe('Withdrawals', function () {
    describe('Validations', function () {
      it('Should revert with the right error if called too soon', async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it('Should revert with the right error if called from another account', async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        );
        await time.increaseTo(unlockTime);
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          '!owner'
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { lock, unlockTime } = await loadFixture(
          deployOneYearLockFixture
        );
        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe('Events', function () {
      it('Should emit an event on withdrawals', async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw())
          .to.emit(lock, 'Withdrawal')
          .withArgs(lockedAmount, anyValue);
      });
    });

    describe('Transfers', function () {
      it('Should transfer the funds to the owner', async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});
