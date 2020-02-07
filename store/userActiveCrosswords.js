import axios from "axios";
import SERVER_URL from "../serverUrl";

////////////////////////////////////////////////////
// This reducer/thunk retrieves a user's active crosswords
////////////////////////////////////////////////////

// Action types
const GET_USER_ACTIVE_CROSSWORDS = "GET_USER_ACTIVE_CROSSWORDS";

// Action creators
const getUserActiveCrosswords = crosswords => {
  return {
    type: GET_USER_ACTIVE_CROSSWORDS,
    crosswords: crosswords
  };
};

// Thunks
export const fetchUserActiveCrosswords = userid => {
  return async dispatch => {
    try {
      // const { data } = await axios.get(`${SERVER_URL}/api/crossword/${id}`);
      let response = await axios.get(
        `${SERVER_URL}/api/user/${userid}/activecrosswords`
      );
      dispatch(getUserActiveCrosswords(response.data));
    } catch (err) {
      console.log(err);
    }
  };
};

// Reducer
const userActiveCrosswordsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_ACTIVE_CROSSWORDS:
      return action.crosswords;
    default:
      return state;
  }
};

export default userActiveCrosswordsReducer;
