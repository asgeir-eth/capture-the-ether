import { ethers } from "hardhat";
import { myAddress, contractAddress, abi } from "./step1";

const doSettle = async () => {
  const signer = await ethers.getSigner(myAddress);
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const tx = await contract.settle();

  return tx;
};

async function main() {
  const tx = await doSettle();
  const receipt = await tx.wait();
  console.log(receipt);
  console.log("done!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
