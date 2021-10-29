import { ethers } from "hardhat";

const myAddress = "0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4";
const nickname = "Asgeir";
const captureTheEtherAddress = "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee";

const captureTheEtherAbi = [
  "function setNickname(bytes32 nickname)",
  "function nicknameOf(address arg1) public view returns (bytes32)",
];

const getNickname = async (address: string) => {
  const provider = ethers.provider;
  const contract = new ethers.Contract(
    captureTheEtherAddress,
    captureTheEtherAbi,
    provider
  );

  const nameBytes = await contract.nicknameOf(address);
  const name = ethers.utils.parseBytes32String(nameBytes);

  return name;
};

const setNickname = async (name: string) => {
  const signer = await ethers.getSigner(myAddress);
  const contract = new ethers.Contract(
    captureTheEtherAddress,
    captureTheEtherAbi,
    signer
  );

  const tx = await contract.setNickname(
    ethers.utils.formatBytes32String(nickname)
  );

  return tx;
};

async function main() {
  const oldName = await getNickname(myAddress);
  console.log(`oldName: ${oldName}`);

  const tx = await setNickname(nickname);
  await tx.wait();

  const newName = await getNickname(myAddress);
  console.log(`newName: ${newName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
