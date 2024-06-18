import axios from "axios";

export const SET_AUTH_STATUS = "SET_AUTH_STATUS";

export const setAuthStatus = (isLoggedIn) => ({
  type: SET_AUTH_STATUS,
  payload: isLoggedIn,
});

export const checkAuth = () => async (dispatch) => {
  try {
    await axios.get("http://localhost:5001/api/clients");
    dispatch(setAuthStatus(true));
  } catch (error) {
    dispatch(setAuthStatus(false));
  }
};
