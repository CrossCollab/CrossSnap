import axios from "axios";
const SERVER_URL = "http://" + "172.17.21.173:8080";
const GET_CROSSWORD = "GET_CROSSWORD";

const getCrossword = crossword => {
  return { type: GET_CROSSWORD, crossword };
};

export const setCrossword = id => {
  return async dispatch => {
    try {
      console.log("in redux before axios");
      const { data } = await axios.get(`${SERVER_URL}/api/crossword/${id}`);
      console.log("redux", data);
      dispatch(getCrossword(data));
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
};

const crosswordReducer = (state = {}, action) => {
  console.log("action", action);
  switch (action.type) {
    case GET_CROSSWORD:
      return action.crossword;
    default:
      return state;
  }
};

export default crosswordReducer;
