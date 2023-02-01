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
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  background-color: var(--button);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
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
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
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

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
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
  text-decoration: none;
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
    addressId = onlyFirst.indexOf(allowlistAddresses[0][0]);
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
        setFeedback("Sorry, something went wrong please try again later.");
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
    if (data.onlyAllowlisted == true) {
      if (allowlistUserAmountData !== 0) {
        if (allowlistUserAmountData > data.userMintedAmount) {
          newMintAmount = allowlistUserAmountData - data.userMintedAmount;
        } else {
          newMintAmount = 1;
        }
    }
    } else {
      if (newMintAmount > 3) {
        newMintAmount = 3;
      }
    }
    setMintAmount(newMintAmount);
  };

  const getMerkleUserAmountData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      onlyFirst = allowlistAddresses.map(pick => pick[0].toLowerCase());
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

  console.log("allowlistUserAmountData;", allowlistUserAmountData)
  console.log("userMintedAmount;", data.userMintedAmount)

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
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
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.SYMBOL} 1枚につき{CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                  別途ガス代がかかります.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
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
                          ? ( data.onlyAllowlisted == true
                            ? (allowlistUserAmountData == 0
                              ? "接続したウォレットはアローリストに登録されていません。"
                              : (0 < allowlistUserAmountData - data.userMintedAmount
                                ? (feedback + "あと" + (allowlistUserAmountData - data.userMintedAmount) + "枚ミントできます。")
                                : "ミントの上限枚数に達しました" ) )
                            : feedback )
                          : "現在ミントは停止中です。")}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        //1: disable
                        //0: able
                        disabled = {claimingNft
                                   ? 1
                                   : (data.paused == false
                                    ? ( data.onlyAllowlisted == true
                                      ? (allowlistUserAmountData == 0
                                        ? 1
                                        : (allowlistUserAmountData !== data.userMintedAmount
                                        : (0 < allowlistUserAmountData - data.userMintedAmount
                                          ? 0
                                          : 1 ) )
                                      : 0 )
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
                          ? ( data.onlyAllowlisted == true
                            ? (allowlistUserAmountData == 0
                              ? "STOP"
                              : (allowlistUserAmountData !== data.userMintedAmount
                              : (0 < allowlistUserAmountData - data.userMintedAmount
                                ? "MINT"
                                : "STOP" ) )
                            : "MINT" )
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
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
            正しいネットワークに接続されているか({CONFIG.NETWORK.NAME})、正しいアドレスに接続されているかをご確認ください。一度購入すると、この操作を元に戻すことはできません。
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
            ガス代が低すぎると失敗することがあります。ガス代を高めに設定することをお勧めします。
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
