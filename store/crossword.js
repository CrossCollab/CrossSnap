import axios from "axios";
import SERVER_URL from "../serverUrl";

// Action types
const GET_CROSSWORD = "GET_CROSSWORD";

// Action creators
const getCrossword = crossword => {
  return { type: GET_CROSSWORD, crossword };
};

// Thunks
export const setCrossword = id => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/crossword/${id}`);
      dispatch(getCrossword(data));
    } catch (err) {
      // console.log(err);
    }
  };
};

// Reducer
const crosswordReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CROSSWORD:
      return action.crossword;
    default:
      return state;
  }
};

export default crosswordReducer;
