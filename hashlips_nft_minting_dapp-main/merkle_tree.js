import { ethers } from"ethers";
import { MerkleTree } from"merkletreejs";
import keccak256 from'keccak256';
import { allowlistAddresses } from "./src/allowlist.js";

const leafNodes = allowlistAddresses.map(addr => ethers.utils.solidityKeccak256(['address', 'uint256'], [addr[0], addr[1]]));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
console.log("leafNode ; \n", leafNodes);
console.log(merkleTree);

const rootHash = merkleTree.getRoot();
console.log("Allowlist Merkle Tree\n", merkleTree.toString());
console.log("Root Hash ; \n", "0x" + rootHash.toString("hex"));

const claiminingAddress = ethers.utils.solidityKeccak256(['address', 'uint256'], [allowlistAddresses[0][0], allowlistAddresses[0][1]]);
console.log("claiminingAddress ; ", claiminingAddress)

const hexProof = merkleTree.getHexProof(claiminingAddress);
console.log("hexProof ; \n", hexProof)
console.log(merkleTree.verify(hexProof, claiminingAddress, rootHash))

