import axios from "axios";
import SERVER_URL from "../serverUrl";

const ADD_USER = "ADD_USER";

const addUser = user => {
  return {
    type: ADD_USER,
    user
  };
};

export const createUser = user => {
  return async dispatch => {
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/user/signup`, user);
      dispatch(addUser(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export default function(state = {}, action) {
  switch (action.type) {
    case ADD_USER:
      return action.user;
    default:
      return state;
  }
}
