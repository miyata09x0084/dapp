// SPDX-License-Identifier: MIT
// Copyright (c) 2023 Ryo Miyata

/*

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

pragma solidity >=0.7.0 <0.9.0;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract kangeki_contract is ERC721A, Ownable {

    string baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0 ether;
    uint256 public maxSupply = 40;
    uint256 public maxMintAmountPerTransaction = 2;
    uint256 public publicSaleMaxMintAmountPerAddress = 3;
    bool public paused = true;
    bool public onlyAllowlisted = true;
    bytes32 public merkleRoot;
    mapping(address => uint256) public allowlistUserAmount;
    mapping(address => uint256) public userMintedAmount;
    

    constructor() ERC721A('Kangeki', 'KG') {
        setBaseURI('ipfs://QmWC1Ai5JBf1CbvHF3SXVp1vxecPdfF7RkKz1oG4rVrR3u/');
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
        
    }

    // mint with merkle tree algorithm
    function mint(uint256 _mintAmount, uint256 _alMaxMintAmount, bytes32[] calldata _merkleProof) public payable {
        require(!paused, "the contract is paused");
        uint256 supply = totalSupply();
        require(_mintAmount > 0, "need to mint at least 1 NFT");
        require(_mintAmount <= maxMintAmountPerTransaction, "max mint amount per session exceeded");
        require(supply + _mintAmount <= maxSupply, "max NFT limit exceeded");
        require(msg.value >= cost * _mintAmount, "insufficient funds");

        uint256 maxMintAmountPerAddress;
        // merkle tree
        if(onlyAllowlisted == true) {
            bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _alMaxMintAmount));
            require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "user is not allowlisted");
            maxMintAmountPerAddress = _alMaxMintAmount;
        } else {
            // public sale
            maxMintAmountPerAddress =  publicSaleMaxMintAmountPerAddress;
        }

        require(userMintedAmount[msg.sender] + _mintAmount <= maxMintAmountPerAddress, "max NFT per address exceeded");
        userMintedAmount[msg.sender] += _mintAmount;

        _safeMint(msg.sender, _mintAmount);
    }

    function airdropMint(address[] calldata _airdropAddresses , uint256[] memory _UserMintAmount) public onlyOwner{
        uint256 supply = totalSupply();
        uint256 _mintAmount = 0;
        for (uint256 i = 0; i < _UserMintAmount.length; i++) {
            _mintAmount += _UserMintAmount[i];
        }
        require(_mintAmount > 0, "need to mint at least 1 NFT");
        require(supply + _mintAmount <= maxSupply, "max NFT limit exceeded");

        for (uint256 i = 0; i < _UserMintAmount.length; i++) {
            _safeMint(_airdropAddresses[i], _UserMintAmount[i] );
        }
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function setAllowlist(address[] memory addresses, uint256[] memory saleSupplies) public onlyOwner {
        require(addresses.length == saleSupplies.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            allowlistUserAmount[addresses[i]] = saleSupplies[i];
        }
    }


    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        return string(abi.encodePacked(ERC721A.tokenURI(tokenId), baseExtension));
    }

    //only owner  
    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setOnlyAllowlisted(bool _state) public onlyOwner {
        onlyAllowlisted = _state;
    }    

    function setmaxMintAmountPerTransaction(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmountPerTransaction = _newmaxMintAmount;
    }
  
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }
 
    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }    

    //
    //sbt section
    //

    bool public isSBT = false;

    function setIsSBT(bool _state) public onlyOwner {
        isSBT = _state;
    }

    function _beforeTokenTransfers( address from, address to, uint256 startTokenId, uint256 quantity) internal virtual override{
        require( isSBT == false || from == address(0) || to == address(0x000000000000000000000000000000000000dEaD), "transfer is prohibited");
        super._beforeTokenTransfers(from, to, startTokenId, quantity);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override {
        require( isSBT == false , "setApprovalForAll is prohibited");
        super.setApprovalForAll(operator, approved);
    }

    function approve(address to, uint256 tokenId) public payable virtual override {
        require( isSBT == false , "approve is prohibited");
        super.approve(to, tokenId);
    }
}