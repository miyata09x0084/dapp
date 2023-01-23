// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      const blockchain = store.getState().blockchain
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let paused = await store
        .getState()
        .blockchain.smartContract.methods.paused()
        .call();
      let onlyAllowlisted = await store
        .getState()
        .blockchain.smartContract.methods.onlyAllowlisted()
        .call();
      let allowlistUserAmount = await store
        .getState()
        .blockchain.smartContract.methods.allowlistUserAmount(blockchain.account)
        .call();
      let allowlistMintedAmount = await store
        .getState()
        .blockchain.smartContract.methods.allowlistMintedAmount(blockchain.account)
        .call();
      // let cost = await store
      //   .getState()
      //   .blockchain.smartContract.methods.cost()
      //   .call();

      dispatch(
        fetchDataSuccess({
          totalSupply,
          paused,
          onlyAllowlisted,
          allowlistUserAmount,
          allowlistMintedAmount,
          // cost,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
