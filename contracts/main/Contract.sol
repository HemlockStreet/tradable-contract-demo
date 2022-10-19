// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./abstracts/Ownable2Step.sol";
import "./abstracts/Asset.sol";

contract Contract is Ownable {}

contract ContractV2 is Ownable2Step {}

contract ContractV3 is Asset {
    constructor(address token, uint id) Asset(token, id) {}
}
