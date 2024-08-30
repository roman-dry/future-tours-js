import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./slices/tokenSlice";
import userReducer from "./slices/userSlice";
import introReducer from "./slices/isSkipedIntro"

export const store = configureStore({
    reducer: {tokenReducer, userReducer, introReducer},
  })