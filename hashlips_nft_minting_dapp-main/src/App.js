import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { allowlistAddresses } from "./allowlist";

const { ethers } = require("ethers");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require('keccak256');

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: var(--button);
  padding: 20px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 160px;
  cursor: pointer;
  box-shadow: 0px 2px 2px 1px #0F0F0F;
  -webkit-box-shadow: 0px 2px 2px 1px #0F0F0F;
  -moz-box-shadow: 0px 2px 2px 1px #0F0F0F;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  font-family: "Press Start 2P";
`;

export const StyledSquareButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 2px 1px #0F0F0F;
  -webkit-box-shadow: 0px 2px 2px 1px #0F0F0F;
  -moz-box-shadow: 0px 2px 2px 1px #0F0F0F;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: space-between;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  // text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`購入ボタンを押してミントしてください。`);
  const [mintAmount, setMintAmount] = useState(1);
  const [allowlistUserAmountData, setAllowlistUserAmountData] = useState(0);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });
  let leafNodes;
  let merkleTree;
  let onlyFirst;
  let addressId = -1;
  let claiminingAddress;
  let hexProof;

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    let allowlistMaxMintAmount;

    leafNodes = allowlistAddresses.map(addr => ethers.utils.solidityKeccak256(['address', 'uint256'], [addr[0], addr[1]]));
    merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    onlyFirst = allowlistAddresses.map(pick => pick[0]);
    addressId = onlyFirst.indexOf(blockchain.account);
    console.log("allowlistAddresses", allowlistAddresses)
    console.log("account", blockchain.account)
    console.log("onlyFirst", onlyFirst)
    console.log("addressId", addressId)
    if (addressId == -1) {
      allowlistMaxMintAmount = 0;
      claiminingAddress = ethers.utils.solidityKeccak256(['address', 'uint256'], [allowlistAddresses[0][0], allowlistAddresses[0][1]]);
      hexProof = merkleTree.getHexProof(claiminingAddress);
    } else {
      allowlistMaxMintAmount = allowlistAddresses[addressId][1];
      claiminingAddress = ethers.utils.solidityKeccak256(['address', 'uint256'], [allowlistAddresses[addressId][0], allowlistAddresses[addressId][1]]);
      hexProof = merkleTree.getHexProof(claiminingAddress);
      console.log("allowlistMaxMintAmount", allowlistMaxMintAmount)
      console.log("claiminingAddress", claiminingAddress)
      console.log("hexProof", hexProof)
    }

    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`${CONFIG.NFT_NAME}をミントしています。しばらくお待ちください。`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount, allowlistMaxMintAmount, hexProof)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("申し訳ありませんが、何か問題が発生しました。もう一度お試しください。");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `${CONFIG.NFT_NAME} がミントできました。Opensea.ioで確認してみましょう。`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    let maxMintAmountView;
    if (data.onlyAllowlisted == true) {
      maxMintAmountView = Math.min(allowlistUserAmountData - data.userMintedAmount, data.maxMintAmountPerTransaction);
    } else {
      maxMintAmountView = Math.min(data.publicSaleMaxMintAmountPerAddress - data.userMintedAmount, data.maxMintAmountPerTransaction)
    }

    if (maxMintAmountView < newMintAmount ) {
      newMintAmount = maxMintAmountView;
    }
    if (newMintAmount == 0) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const getMerkleUserAmountData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      onlyFirst = allowlistAddresses.map(pick => pick[0]);
      addressId = onlyFirst.indexOf(blockchain.account);
      if (addressId == -1) {
        setAllowlistUserAmountData(0);
      } else  {
        setAllowlistUserAmountData(allowlistAddresses[addressId][1]);
      }
    }
  }

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  useEffect(() => {
    getMerkleUserAmountData();
  }, [data.loading]);

  console.log("data", data);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{
          padding: 24,
          backgroundColor: "#000000"
        }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/" : null}
      >
        <s.Header>
          <s.LeftSideSection>
            <a href="/"><s.Icon image={CONFIG.SHOW_BACKGROUND ? "/config/images/facebook_32x32.png" : null}></s.Icon></a>
            <a href="/"><s.Icon image={CONFIG.SHOW_BACKGROUND ? "/config/images/twitter_32x32.png" : null}></s.Icon></a>
            <a href="/"><s.Icon image={CONFIG.SHOW_BACKGROUND ? "/config/images/email_32x32.png" : null}></s.Icon></a>
          </s.LeftSideSection>
          <s.RightSideSection>
            <s.Introduce>Home</s.Introduce>
            <s.Introduce>Sample</s.Introduce>
          </s.RightSideSection>
        </s.Header>
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              padding: 24,
              borderRadius: 24,
            }}
          >
            <s.StyledLogo
              >
              OnChainNFT
            </s.StyledLogo>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              Available: {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                Contract Address: {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {/* {CONFIG.SYMBOL} 1枚につき{CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}. */}
                </s.TextTitle>
                <s.SpacerXSmall />
                {/* <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  別途ガス代がかかります.
                </s.TextDescription> */}
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        fontSize: 17,
                      }}
                    >
                      {CONFIG.NETWORK.NAME} ネットワークに接続してください。
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {data.loading == true
                        ? "読み込み中です。しばらくお待ちください。"
                        : (data.paused == false
                          // Only allowlisted
                          ? ( data.onlyAllowlisted == true
                            ? (allowlistUserAmountData == 0
                              ? "接続したウォレットはアローリストに登録されていません。"
                              : (0 < allowlistUserAmountData - data.userMintedAmount
                                ? (feedback + "あと" + (allowlistUserAmountData - data.userMintedAmount) + "枚ミントできます。")
                                : "ミントの上限枚数に達しました" ) )
                            // Public sale
                            : ( 0 < data.publicSaleMaxMintAmountPerAddress - data.userMintedAmount
                              ? (feedback + "あと" + (data.publicSaleMaxMintAmountPerAddress - data.userMintedAmount) + "枚ミントできます。")
                              : "ミントの上限枚数に達しました" ) )
                          // Paused
                          : "現在ミントは停止中です。")}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledSquareButton
                        style={{
                          lineHeight: 0.4,
                        }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledSquareButton>
                      <s.MintNumber
                        style={{
                          textAlign: "center",
                          color: "var(--accent)",
                          width:  "100px",
                          backgroundColor: "#ffffff",
                          border: "none",
                          boxShadow: "0px 2px 2px 1px #0F0F0F",
                        }}
                      >
                        {mintAmount}
                      </s.MintNumber>
                      <StyledSquareButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledSquareButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        //1: disable
                        //0: able
                        disabled = {claimingNft
                                   ? 1
                                   : (data.paused == false
                                    // Only allowlisted
                                    ? ( data.onlyAllowlisted == true
                                      ? (allowlistUserAmountData == 0
                                        ? 1
                                        : (0 < allowlistUserAmountData - data.userMintedAmount
                                          ? 0
                                          : 1 ) )
                                      // Public sale
                                      : ( 0 < data.publicSaleMaxMintAmountPerAddress - data.userMintedAmount
                                        ? 0
                                        : 1 ) )
                                    : 1)}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft
                        ? "読み込み中"
                        : (data.paused == false
                          // Only allowlisted
                          ? ( data.onlyAllowlisted == true
                            ? (allowlistUserAmountData == 0
                              ? "STOP"
                              : (0 < allowlistUserAmountData - data.userMintedAmount
                                ? "MINT"
                                : "STOP" ) )
                            // Public sale
                            : ( 0 < data.publicSaleMaxMintAmountPerAddress - data.userMintedAmount
                              ? "MINT"
                              : "STOP" ) )
                          : "STOP")}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
          </s.Container>
        </ResponsiveWrapper>
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              maxWidth: "576px",
            }}
          >
            正しいネットワークに接続されているか({CONFIG.NETWORK.NAME})、正しいアドレスに接続されているかをご確認ください。一度購入すると、操作を元に戻すことはできません。
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              maxWidth: "576px",
            }}
          >
            ガス代が低すぎると失敗することがあります。ガス代を高めに設定することをお勧めします。
          </s.TextDescription>
        </s.Container>
        <s.SpacerSmall />
        <s.Container>
            <s.SourceArea
              style={{
                maxWidth: "576px",
            }}
            >
              <s.TextDescription
                style={{
                  color: "var(--accent)",
                  fontWeight: "bold",
                }}
              >
                Resources
              </s.TextDescription>
              <s.SpacerSmall/>
              <s.TextDescription
                style={{
                  color: "var(--accent)",
                }}
              >
                Etherscan: <a href="https://goerli.etherscan.io/address/0xba77f43fe7d80fad40a4d814bed177d8004ae89b" target="_blank">ERC721A</a><br/>
                GitHub: <a href="https://github.com/miyata09x0084/first-merkle" target="_blank">WebUI & Contract</a>
              </s.TextDescription>
            </s.SourceArea>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
