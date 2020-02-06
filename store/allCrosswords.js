import axios from "axios";
import SERVER_URL from "../serverUrl";

// Action types
const GET_ALL_CROSSWORDS = "GET_ALL_CROSSWORDS";

// Action creators
const getAllCrosswords = crosswords => {
  return {
    type: GET_ALL_CROSSWORDS,
    crosswords: crosswords
  };
};

// Thunks
export const fetchCrosswords = () => {
  return async dispatch => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/crossword`);
      dispatch(getAllCrosswords(response.data));
    } catch (err) {
      console.log(err);
    }
  };
};

// Reducer
const allCrosswordsReducer = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_CROSSWORDS:
      return action.crosswords;
    default:
      return state;
  }
};

export default allCrosswordsReducer;
