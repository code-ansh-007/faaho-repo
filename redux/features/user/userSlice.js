import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  uid: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.uid = action.payload.uid;
    },
    removeUser: (state) => {
      state.isLoggedIn = false;
      state.uid = "";
    },
  },
});

export default userSlice.reducer;
export const { setUser, removeUser } = userSlice.actions;
