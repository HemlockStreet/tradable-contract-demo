// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//

import "./Ownable.sol";

abstract contract Ownable2Step is Ownable {
    event OwnershipTransferStarted(
        address indexed previousOwner,
        address indexed newOwner
    );

    //
    address private _pendingOwner;

    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    function acceptOwnership() external {
        address sender = _msgSender();
        require(
            pendingOwner() == sender,
            "Ownable2Step: caller is not the new owner"
        );
        _transferOwnership(sender);
    }

    function transferOwnership(address newOwner)
        public
        virtual
        override
        onlyOwner
    {
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner(), newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual override {
        delete _pendingOwner;
        super._transferOwnership(newOwner);
    }
}
