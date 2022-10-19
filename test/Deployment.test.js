const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const address0 = '0x0000000000000000000000000000000000000000';

describe('Deployment', function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ExpensiveJpeg = await ethers.getContractFactory('ExpensiveJpeg');
    const nft = await ExpensiveJpeg.deploy();
    const OverrideNft = await ethers.getContractFactory('OverrideNft');
    const otherNft = await OverrideNft.deploy();

    await nft.connect(otherAccount).quickMint();

    const Factory = await ethers.getContractFactory('Contract');
    const FactoryV2 = await ethers.getContractFactory('ContractV2');
    const FactoryV3 = await ethers.getContractFactory('ContractV3');

    return {
      Factory,
      FactoryV2,
      FactoryV3,
      nft,
      otherNft,
      owner,
      otherAccount,
    };
  }

  describe('Deployment', function () {
    it('should deploy properly', async function () {
      const { Factory, FactoryV2, FactoryV3, nft } = await loadFixture(deploy);

      let contract, contractV2, contractV3;

      async function deployMultiple() {
        contract = await Factory.deploy();
        contractV2 = await FactoryV2.deploy();
        contractV3 = await FactoryV3.deploy(nft.address, 1);

        contractV2 = await FactoryV2.deploy();
        contractV3 = await FactoryV3.deploy(nft.address, 1);
        contract = await Factory.deploy();

        contractV3 = await FactoryV3.deploy(nft.address, 1);
        contractV2 = await FactoryV2.deploy();
        contract = await Factory.deploy();

        contract = await Factory.deploy();
        contractV3 = await FactoryV3.deploy(nft.address, 1);
        contractV2 = await FactoryV2.deploy();

        contractV2 = await FactoryV2.deploy();
        contract = await Factory.deploy();
        contractV3 = await FactoryV3.deploy(nft.address, 1);

        contractV3 = await FactoryV3.deploy(nft.address, 1);
        contract = await Factory.deploy();
        contractV2 = await FactoryV2.deploy();
      }

      await deployMultiple();
    });

    it('should transfer ownership', async function () {
      const {
        Factory,
        FactoryV2,
        FactoryV3,
        nft,
        otherNft,
        owner,
        otherAccount,
      } = await loadFixture(deploy);

      const contract = await Factory.deploy();
      const contractV2 = await FactoryV2.deploy();
      const contractV3 = await FactoryV3.deploy(nft.address, 1);

      await contract.connect(owner).transferOwnership(otherAccount.address);
      await contractV2.connect(owner).transferOwnership(otherAccount.address);
      await contractV2.connect(otherAccount).acceptOwnership();
      await contractV3.connect(owner).transferOwnership(otherNft.address, 1);

      await contract.connect(otherAccount).transferOwnership(owner.address);
      await contractV2.connect(otherAccount).transferOwnership(owner.address);
      await contractV2.connect(owner).acceptOwnership();
      await contractV3.connect(owner).transferOwnership(nft.address, 1);

      await contract.connect(owner).transferOwnership(otherAccount.address);
      await contractV2.connect(owner).transferOwnership(otherAccount.address);
      await contractV2.connect(otherAccount).acceptOwnership();
      await contractV3.connect(owner).transferOwnership(otherNft.address, 1);
    });

    it('should transfer ownership (alt)', async function () {
      const {
        Factory,
        FactoryV2,
        FactoryV3,
        nft,
        otherNft,
        owner,
        otherAccount,
      } = await loadFixture(deploy);

      const contract = await Factory.deploy();
      const contractV2 = await FactoryV2.deploy();
      const contractV3 = await FactoryV3.deploy(nft.address, 1);

      await contract.connect(owner).transferOwnership(otherAccount.address);
      await contractV2.connect(owner).transferOwnership(otherAccount.address);
      await contractV2.connect(otherAccount).acceptOwnership();
      await nft
        .connect(owner)
        .transferFrom(owner.address, otherAccount.address, 1);

      await contract.connect(otherAccount).transferOwnership(owner.address);
      await contractV2.connect(otherAccount).transferOwnership(owner.address);
      await contractV2.connect(owner).acceptOwnership();
      await nft
        .connect(otherAccount)
        .transferFrom(otherAccount.address, owner.address, 1);

      await contract.connect(owner).transferOwnership(otherAccount.address);
      await contractV2.connect(owner).transferOwnership(otherAccount.address);
      await contractV2.connect(otherAccount).acceptOwnership();
      await nft
        .connect(owner)
        .transferFrom(owner.address, otherAccount.address, 1);
    });
  });
});
