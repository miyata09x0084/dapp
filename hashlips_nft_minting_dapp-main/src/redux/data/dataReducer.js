const initialState = {
  loading: false,
  totalSupply: 0,
  cost: 0,
  error: false,
  errorMsg: "",
  paused: true,
  userMintedAmount: 0,
  onlyAllowlisted: true,
  maxMintAmountPerTransaction: 1,
  publicSaleMaxMintAmountPerAddress: 1,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "", 
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        // cost: action.payload.cost,
        paused: action.payload.paused,
        onlyAllowlisted: action.payload.onlyAllowlisted,
        userMintedAmount: action.payload.userMintedAmount,
        maxMintAmountPerTransaction: action.payload.maxMintAmountPerTransaction,
        publicSaleMaxMintAmountPerAddress: action.payload.publicSaleMaxMintAmountPerAddress,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
