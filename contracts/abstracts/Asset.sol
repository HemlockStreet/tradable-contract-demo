// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INFT {
    function ownerOf(uint) external view returns (address);
}

abstract contract Asset {
    event OwnershipTransferred(
        address indexed newOwner,
        address indexed token,
        uint indexed id
    );

    address private _token;
    uint private _id;

    constructor(address token, uint id) {
        transferOwnership(token, id);
    }

    function owner() public view virtual returns (address) {
        return INFT(_token).ownerOf(_id);
    }

    function _checkOwner() internal view virtual {
        require(_token == address(0) || msg.sender == owner(), "!owner");
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function transferOwnership(address token, uint id)
        public
        virtual
        onlyOwner
    {
        _token = token;
        _id = id;
        emit OwnershipTransferred(INFT(token).ownerOf(id), token, id);
    }
}
