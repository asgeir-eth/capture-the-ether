import { ethers } from "hardhat";

const myAddress = "0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4";
const contractAddress = "0x5Cf9F658092bc391b463CCB2aca9aaD85e5f7c70";

const abi = [
  "function guess(uint8 n) public payable",
  "function isComplete() public view returns (bool)",
];

const checkIsComplete = async () => {
  const provider = ethers.provider;

  const contract = new ethers.Contract(contractAddress, abi, provider);

  return await contract.isComplete();
};

const doGuess = async () => {
  const signer = await ethers.getSigner(myAddress);

  // checking out how to do a "raw" transaction for this
  const functionSelector = "0x4ba4c16b"; // guess function

  // how to get the function signature
  // const contract = new ethers.Contract(contractAddress, abi, signer);
  // const selector = contract.interface.getSighash("guess");
  const rawParameter =
    "00000000000000000000000000000000000000000000000000000000000000aa";

  return signer.sendTransaction({
    to: contractAddress,
    value: ethers.utils.parseEther("1"),
    data: `${functionSelector}${rawParameter}`,
  });
};

async function main() {
  // const tx = ethers.se

  const isCompleteStart = await checkIsComplete();
  console.log(`isCompleteStart: ${isCompleteStart}`);

  const tx = await doGuess();
  await tx.wait();

  const isCompleteEnd = await checkIsComplete();
  console.log(`isCompleteEnd: ${isCompleteEnd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
