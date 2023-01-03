import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setCookie, deleteCookie } from "cookies-next";
import config from "../config";
import { IContext, IUser } from "../interfaces";
import { RootState } from "./store";

const initialState: IContext = {
  loggedin: false,
  user: null,
  message: "",
  users: [{ username: "bryan", password: "bryan", email: "b" }],
  error: null,
  status: "idle",
};

export const loadjwtUser = createAsyncThunk("user/jwt", async (user: IUser) => {
  try {
    const data = await fetch("http://localhost:3000/api/auth", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        type: "load",
        value: { user },
      }),
    }).then((res) => res.json());
    return data.data;
  } catch (error) {
    return null;
  }
});

export const verifyjwtUser = createAsyncThunk(
  "jwt/verify",
  async (jwt: string) => {
    try {
      const data = await fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type: "verify",
          value: jwt,
        }),
      }).then((res) => res.json());
      console.log(data)
      return data.data.data.user;
    } catch (error) {
      return null;
    }
  }
);

export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    logup: (state, action: { payload: IUser }) => {
      if (state.users.find((lt) => lt.username === action.payload.username)) {
        state.loggedin = false;
        state.message = "BadLogup";
        state.user = null;
      } else {
        state.loggedin = true;
        state.message = "OK";
        state.user = action.payload;
        state.users.push(action.payload);
      }
    },
    login: (state, action: { payload: IUser }) => {
      const user = state.users.find(
        (lt) => lt.username === action.payload.username
      );
      state.loggedin = user ? true : false;
      state.message = user ? "OK" : "BadLogin";
      state.user = user ? user : null;
    },
    logout: (state) => {
      deleteCookie("protectedNext", { path: "/", domain: config.domain });
      state.loggedin = false;
      state.message = null;
      state.user = null;
    },
    gotit: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadjwtUser.pending, (state) => {
      state.status = "loading";
      return state;
    }),
      builder.addCase(loadjwtUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.user.token = action.payload;
        setCookie("protectedNext", action.payload, {
          path: "/",
          domain: config.domain,
          maxAge: 3600, // Expires after 1hr
          sameSite: true,
        });
        return state;
      }),
      builder.addCase(loadjwtUser.rejected, (state) => {
        state.status = "idle";
        return state;
      }),
      /////////////
      /*** */
      /////////////
      builder.addCase(verifyjwtUser.pending, (state) => {
        state.status = "loading";
        return state;
      }),
      builder.addCase(verifyjwtUser.fulfilled, (state, action) => {
        console.log(action.payload)
        state.status = "idle";
        state.loggedin = action.payload !== null ? true : false;
        state.message = action.payload !== null ? "OK" : "BadRefresh"
        state.user = action.payload !== null ? action.payload : null
        return state;
      }),
      builder.addCase(verifyjwtUser.rejected, (state) => {
        state.status = "idle";
        return state;
      });
  },
});

export const getAuthState = (state: RootState) => state.auth;
export const selectStatus = (state: RootState) => state.auth.status;

export const { login, logup, logout, gotit } = authSlice.actions;
export default authSlice.reducer;
