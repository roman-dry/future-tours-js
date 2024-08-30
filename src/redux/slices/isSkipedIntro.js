import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";

const initialState = {
  intro: getLocalStorage("intro")||false,
};

export const introSlice = createSlice({
  name: "intro",
  initialState,
  reducers: {
    setIntro(state, action) {
      state.intro = action.payload;
      setLocalStorage("intro", action.payload);
    },
    removeIntro(state) {
      localStorage.removeItem("intro");
      state.intro = initialState;
    },
  },
});

export const { setIntro, removeIntro } = introSlice.actions;
export default introSlice.reducer;