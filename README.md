# NFT Ownership Demo

> Turn smart contracts into tradable NFTs

## About

Main Script:
It's unsurprising that things like this come up since everything from vodka bottles to land itself have been turned into NFTs. If you're new here, I'm Cat. Today on Eat the Blocks, I'm going to show you how to turn your smart contract into an NFT.

Before we dive in let's cover the basics of contract ownership with, what is probably the most popular smart contract in OpenZeppelin's library, the 'Ownable' abstract. Afterwards, we'll talk about their improvements in the new 'Ownable2Step' abstraction. Then from there, we'll dive into my very own custom abstraction, "Asset.sol".

But first, a message from our sponsor:

```txt
For premium web3 content, our mentorship program, and access to our private Discord server, sign up today at eattheblocks.com. We have an excellent selection of free and paid courses exclusively available through our main website. Push the bounds of what you think is possible and become the best developer you can be.
```

The "Ownable.sol" abstract can be applied to your base contract to automatically register the contract's deployer as its "_owner" upon creation and it saves this variable in a way that is publicly available with this "owner()" method. This "_owner" is just the saved address of a wallet and it must be rewritten every time you want to "transferOwnership()" or redesignate access to the contract's methods that are guarded by this "onlyOwner" modifier or "_checkOwner()" method. "Ownable2Step.sol" is a new abstraction by OpenZeppelin that builds on this by adding a second step to the transfer of ownership privileges by designating a "_pendingOwner" and requiring the "pendingOwner()" to "acceptOwnership()" before officially handing over the privileges. In both, you have the ability to "renounceOwnership()" which means throwing these privileges away; typically done to instill trust in a token's community.

These abstractions are great in their own right and generally useful without modification, but if you have a contract that actually serves as an asset that should be sold or traded there's no way to put these privileges into escrow for trustless transactions. My solution is to turn these privileges into an NFT, which will be referred to as the "Access Token", that your smart contract will interface with in order to define ownership. Owning the expensive jpeg means owning the contract.

Let's assume you are a contractor that just deployed on behalf of a client, but you don't know enough about eachother to hold one another accountable. If you've assigned ownership to possessing the NFT, all you have to do is put the token into escrow and wait for your client to fulfill their promise. This way, neither the client nor the contractor can be scammed and everyone walks away happy.

The key differences between the "Asset.sol" and "Ownable.sol" are primarily internal which means that it should be nearly indistinguishable except for the "OwnershipTransferred" event along with a couple of methods; of which none are called by other contracts. I did this because I wanted it to act as a "drag and drop" replacement for "Ownable.sol". The only key difference is that the constructor takes two arguments (the Access Token's address and ID) because, when you "transferOwnership()", it's actually redesignating the token itself.

We are only interested in being able to call a single function on the NFT contract, which is "ownerOf()" so I went ahead and included this one line interface at the top instead of importing literally everything. Now when you fetch the owner, it goes to the NFT contract to ask who the owner of the saved token ID is and this results in two ways to exchange ownership. You can either redesignate the Access Token to an NFT that somebody else posesses OR you can trade the currently designated access token.

If you're interested in trying this contract out or poking around in the unit tests, see the git repository in the video's description.

## Gas Report

```txt
·------------------------------------|---------------------------|-------------|-----------------------------·
|        Solc version: 0.8.17        ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·····································|···························|·············|······························
|  Methods                           ·              108 gwei/gas               ·       1295.98 usd/eth       │
···············|·····················|·············|·············|·············|···············|··············
|  Contract    ·  Method             ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
···············|·····················|·············|·············|·············|···············|··············
|  Contract    ·  transferOwnership  ·          -  ·          -  ·      28552  ·            7  ·       4.00  │
···············|·····················|·············|·············|·············|···············|··············
|  ContractV2  ·  acceptOwnership    ·          -  ·          -  ·      28245  ·            7  ·       3.95  │
···············|·····················|·············|·············|·············|···············|··············
|  ContractV2  ·  transferOwnership  ·          -  ·          -  ·      47778  ·            7  ·       6.69  │
···············|·····················|·············|·············|·············|···············|··············
|  ContractV3  ·  transferOwnership  ·      42525  ·      45313  ·      43454  ·            6  ·       6.08  │
···············|·····················|·············|·············|·············|···············|··············
|  ERC721      ·  transferFrom       ·      40324  ·      62224  ·      45799  ·            4  ·       6.41  │
···············|·····················|·············|·············|·············|···············|··············
|  Lock        ·  withdraw           ·          -  ·          -  ·      33872  ·            7  ·       4.74  │
···············|·····················|·············|·············|·············|···············|··············
|  LockV2      ·  withdraw           ·          -  ·          -  ·      33895  ·            7  ·       4.74  │
···············|·····················|·············|·············|·············|···············|··············
|  LockV3      ·  withdraw           ·          -  ·          -  ·      42945  ·            7  ·       6.01  │
···············|·····················|·············|·············|·············|···············|··············
|  Deployments                       ·                                         ·  % of limit   ·             │
·····································|·············|·············|·············|···············|··············
|  Contract                          ·          -  ·          -  ·     196840  ·        0.7 %  ·      27.55  │
·····································|·············|·············|·············|···············|··············
|  ContractV2                        ·          -  ·          -  ·     242048  ·        0.8 %  ·      33.88  │
·····································|·············|·············|·············|···············|··············
|  ContractV3                        ·     267246  ·     267258  ·     267254  ·        0.9 %  ·      37.41  │
·····································|·············|·············|·············|···············|··············
|  Lock                              ·          -  ·          -  ·     278468  ·        0.9 %  ·      38.98  │
·····································|·············|·············|·············|···············|··············
|  LockV2                            ·          -  ·          -  ·     327144  ·        1.1 %  ·      45.79  │
·····································|·············|·············|·············|···············|··············
|  LockV3                            ·          -  ·          -  ·     349521  ·        1.2 %  ·      48.92  │
·------------------------------------|-------------|-------------|-------------|---------------|-------------·
```