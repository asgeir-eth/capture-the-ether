import { ethers } from "hardhat";

const myAddress = "0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4";
const contractAddress = "0xA1bAAb40FeDBa7C21898eaF811FD37293E2cF93a";

const abi = [
  "function guess(uint8 n) public payable",
  "function isComplete() public view returns (bool)",
];

const checkIsComplete = async () => {
  const provider = ethers.provider;

  const contract = new ethers.Contract(contractAddress, abi, provider);

  return await contract.isComplete();
};

const doGuess = async (guess: number, ethValue: number) => {
  const signer = await ethers.getSigner(myAddress);
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const value = ethers.utils.parseEther(ethValue.toString());

  const tx = await contract.guess(guess.toString(), { value });

  return tx;
};

async function main() {
  const isCompleteStart = await checkIsComplete();
  console.log(`isCompleteStart: ${isCompleteStart}`);

  const tx = await doGuess(42, 1);
  await tx.wait();

  const isCompleteEnd = await checkIsComplete();
  console.log(`isCompleteEnd: ${isCompleteEnd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
