const { MerkleTree } = require("merkletreejs");
const keccak256 = require('keccak256');

let allowlistAddresses = [
    "0x448bc68105f067AF52A4AC0d1e2Dd5d3F77a1271",
    "0x1f595fBCB116EF3C19CBF2530dF14a5C0A15cbAF",
];

const leafNodes = allowlistAddresses.map(address => keccak256(address));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
// console.log(leafNodes);
// console.log(merkleTree);

const rootHash = merkleTree.getRoot();
// console.log("Allowlist Merkle Tree\n", merkleTree.toString());
// console.log("Root Hash", rootHash);

const claiminingAddress = leafNodes[2];
const hexProof = merkleTree.getHexProof(claiminingAddress);

console.log(hexProof, claiminingAddress, rootHash)//ここから始める

console.log(merkleTree.verify(hexProof, claiminingAddress, rootHash))