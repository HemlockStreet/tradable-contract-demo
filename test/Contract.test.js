const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const address0 = '0x0000000000000000000000000000000000000000';

describe('Contract', function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Template = await ethers.getContractFactory('Contract');
    const contract = await Template.deploy();

    return { contract, owner, otherAccount };
  }

  describe('Deployment', function () {
    it('Should Recognize the Rightful Owner', async function () {
      const { contract, owner } = await loadFixture(deploy);

      expect(await contract.owner()).to.equal(owner.address);
    });

    it('Should recognize new owners', async function () {
      const { contract, owner, otherAccount } = await loadFixture(deploy);

      await contract.connect(owner).transferOwnership(otherAccount.address);
      expect(await contract.owner()).to.equal(otherAccount.address);
    });
  });
});
