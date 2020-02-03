import axios from "axios";
import SERVER_URL from "../serverUrl";
const GET_CROSSWORD = "GET_CROSSWORD";

const getCrossword = crossword => {
  return { type: GET_CROSSWORD, crossword };
};

export const setCrossword = id => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/crossword/${id}`);
      dispatch(getCrossword(data));
    } catch (err) {
      console.log(err);
    }
  };
};

const crosswordReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CROSSWORD:
      return action.crossword;
    default:
      return state;
  }
};

export default crosswordReducer;
