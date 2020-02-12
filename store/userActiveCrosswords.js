import axios from "axios";
import SERVER_URL from "../serverUrl";

////////////////////////////////////////////////////
// This reducer/thunk retrieves a user's active crosswords
////////////////////////////////////////////////////

// Action types
const GET_USER_ACTIVE_CROSSWORDS = "GET_USER_ACTIVE_CROSSWORDS";
const ADD_NEW_GAME = "ADD_NEW_GAME";

// Action creators
const getUserActiveCrosswords = crosswords => {
  return {
    type: GET_USER_ACTIVE_CROSSWORDS,
    crosswords: crosswords
  };
};

const addNewGame = game => {
  return {
    type: ADD_NEW_GAME,
    game: game
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

export const joinGame = info => {
  return async dispatch => {
    try {
      const { userId, gameInstanceId } = info;
      let response = await axios.post(`${SERVER_URL}/api/user/joingame`, {
        userId: userId,
        gameInstanceId: gameInstanceId
      });
      dispatch(addNewGame(response.data));
    } catch (err) {
      console.log(err);
    }
  };
};

// Reducer
const userActiveCrosswordsReducer = (state = [], action) => {
  switch (action.type) {
    case GET_USER_ACTIVE_CROSSWORDS:
      return action.crosswords;
    case ADD_NEW_GAME:
      return [...state, action.game];
    default:
      return state;
  }
};

export default userActiveCrosswordsReducer;
