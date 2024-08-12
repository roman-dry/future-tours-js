import { store } from "../redux/store";
import { removeToken } from "../redux/slices/tokenSlice";
import { jwtDecode } from "jwt-decode";

export const checkTokenExpiration = () => {
    const state = store.getState();
    const token = state.token?.item?.access_token;

    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            store.dispatch(removeToken());
        }
    }
};