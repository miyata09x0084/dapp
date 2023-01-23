const initialState = {
  loading: false,
  totalSupply: 0,
  cost: 0,
  error: false,
  errorMsg: "",
  paused: true,
  onlyAllowlisted: true,
  allowlistUserAmount: 1,
  allowlistMintedAmount: 0,
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
        allowlistUserAmount: action.payload.allowlistUserAmount,
        allowlistMintedAmount: action.payload.allowlistMintedAmount,
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
