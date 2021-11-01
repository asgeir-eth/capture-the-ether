import { ethers } from "hardhat";

export const myAddress = "0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4";
export const contractAddress = "0x5a4Be1CdD76D300d7C30B53909A5BD44BAdF1E33";

export const abi = [
  "function lockInGuess(bytes32 hash) external payable",
  "function settle() external",
];

const doGuess = async (ethValue: number) => {
  const signer = await ethers.getSigner(myAddress);
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const value = ethers.utils.parseEther(ethValue.toString());
  const rawGuess = ethers.utils.formatBytes32String("");
  console.log(`rawGuess: ${rawGuess}`);
  const tx = await contract.lockInGuess(rawGuess, { value });

  return tx;
};

async function main() {
  const tx = await doGuess(1);
  const receipt = await tx.wait();
  console.log(receipt);
  console.log("Now wait for 256 blocks. Then do step 2.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
