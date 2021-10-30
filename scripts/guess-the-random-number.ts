import { ethers } from "hardhat";

const myAddress = "0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4";
const contractAddress = "0x99bcD9e6cC033Ac2B6D549A063c9f9A64fe4a4B6";
const contractCreationBlock = 11327863;

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
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const block = await ethers.provider.getBlock(contractCreationBlock);
  const parentBlockHash = block.parentHash;
  const blockTime = block.timestamp;

  const hash = ethers.utils.solidityKeccak256(
    ["bytes32", "uint256"],
    [parentBlockHash, blockTime]
  );
  console.log(hash);

  const lastByteInHex = hash.slice(-2);
  console.log(lastByteInHex);

  const lastByteInDecimal = parseInt(lastByteInHex, 16);
  console.log(lastByteInDecimal);

  const answer = lastByteInDecimal;
  const tx = await contract.guess(answer, {
    value: ethers.utils.parseEther("1"),
  });

  return tx;
};

async function main() {
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
