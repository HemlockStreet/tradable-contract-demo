// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract Mock721Base is ERC721 {
    uint private _tokenIds;

    function quickMint() public returns (uint) {
        _tokenIds++;
        _mint(msg.sender, _tokenIds);
        return _tokenIds;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmQvYD4LqDdB8gMaVh7vzGfBmApv1kdfGmToQ2B3t2QsU1";
    }

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        quickMint();
    }
}

contract OverrideNft is Mock721Base {
    constructor() Mock721Base("Override Token", "SKEL") {}
}

contract ExpensiveJpeg is Mock721Base {
    constructor() Mock721Base("Expensive JPEG", "$JPG") {}
}
