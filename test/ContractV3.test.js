const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const address0 = '0x0000000000000000000000000000000000000000';

describe('AContractV3', function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ExpensiveJpeg = await ethers.getContractFactory('ExpensiveJpeg');
    const nft = await ExpensiveJpeg.deploy();

    const OverrideNft = await ethers.getContractFactory('OverrideNft');
    const otherNft = await OverrideNft.deploy();

    const Template = await ethers.getContractFactory('ContractV3');
    const contract = await Template.deploy(nft.address, 1);

    return { contract, nft, otherNft, owner, otherAccount };
  }

  describe('Deployment', function () {
    it('Should Recognize the Rightful Owner', async function () {
      const { contract, owner } = await loadFixture(deploy);

      expect(await contract.owner()).to.equal(owner.address);
    });

    it('Should fail deployment if the address does not point to an nft', async function () {
      const Template = await ethers.getContractFactory('ContractV3');
      await expect(Template.deploy(address0, 0)).to.be.reverted;
    });

    it('Should recognize new owners', async function () {
      const { contract, nft, otherNft, owner, otherAccount } =
        await loadFixture(deploy);

      await expect(contract.connect(owner).transferOwnership(address0, 1)).to.be
        .reverted;

      await contract.connect(owner).transferOwnership(otherNft.address, 1);
      expect(await contract.owner()).to.equal(owner.address);

      await nft.connect(otherAccount).quickMint();

      await expect(contract.connect(owner).transferOwnership(nft.address, 2))
        .to.emit(contract, 'OwnershipTransferred')
        .withArgs(otherAccount.address, nft.address, 2);
      expect(await contract.owner()).to.equal(otherAccount.address);

      await nft
        .connect(otherAccount)
        .transferFrom(otherAccount.address, owner.address, 2);
      expect(await contract.owner()).to.equal(owner.address);
    });
  });
});
