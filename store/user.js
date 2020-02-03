import axios from "axios";
// import history from "../history";

// Action types
const GET_USER = "GET_USER";
const REMOVE_USER = "REMOVE_USER";
const UPDATE_USER = "UPDATE_USER";

// Initial state
let defaultUser = {};

// Action creators
const getUser = user => ({ type: GET_USER, user });
const removeUser = () => ({ type: REMOVE_USER });

// Thunk creators
export const me = () => async dispatch => {
  try {
    const res = await axios.get("/auth/me");
    const sid = await axios.get("/auth/sid");
    if (!res.data) defaultUser = { sid: sid.data };
    dispatch(getUser(res.data || defaultUser));
    dispatch(fetchCart(res.data.id || sid.data));
  } catch (err) {
    console.error(err);
  }
};

export const auth = (email, password, method) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/auth/${method}`, { email, password });
  } catch (authError) {
    return dispatch(getUser({ error: authError }));
  }

  try {
    dispatch(getUser(res.data));
    // history.push("/");
  } catch (err) {
    console.log(err);
  }
};

export const logout = () => async dispatch => {
  try {
    await axios.post("/auth/logout");
    dispatch(removeUser());
    // history.push("/");
  } catch (err) {
    console.error(err);
  }
};

// Reducer
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    case UPDATE_USER:
      return action.user;
    default:
      return state;
  }
}
