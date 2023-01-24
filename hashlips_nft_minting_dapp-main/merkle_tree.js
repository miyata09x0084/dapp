const { ethers } = require("ethers");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require('keccak256');

let allowlistAddresses = [
    ["0x448bc68105f067AF52A4AC0d1e2Dd5d3F77a1271",3],
    ["0x1f595fBCB116EF3C19CBF2530dF14a5C0A15cbAF",2],
];

const leafNodes = allowlistAddresses.map(addr => ethers.utils.solidityKeccak256(['address', 'uint256'], [addr[0], addr[1]]));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
console.log("leafNode ; \n", leafNodes);
console.log(merkleTree);

const rootHash = merkleTree.getRoot();
console.log("Allowlist Merkle Tree\n", merkleTree.toString());
console.log("Root Hash", "0x" + rootHash.toString("hex"));

const claiminingAddress = ethers.utils.solidityKeccak256(['address', 'uint256'], [allowlistAddresses[0][0], allowlistAddresses[0][1]]);
console.log(claiminingAddress)

const hexProof = merkleTree.getHexProof(claiminingAddress);
console.log("hexProof ; \n", hexProof)
console.log(merkleTree.verify(hexProof, claiminingAddress, rootHash))

