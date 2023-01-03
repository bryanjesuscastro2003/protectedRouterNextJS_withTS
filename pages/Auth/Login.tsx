import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IContext, IUser } from "../../interfaces";
import { useSelector, useDispatch } from "react-redux";
import {
  getAuthState,
  loadjwtUser,
  login,
  selectStatus,
} from "../../redux/AuthReducer";
import { ThunkDispatch } from "@reduxjs/toolkit";

const Login = () => {
  const router = useRouter();
  const [FormData, SetFormData] = useState<IUser>({
    username: "",
    password: "",
  });
  const authContext = useSelector(getAuthState);
  const dispatch = useDispatch<ThunkDispatch<IContext, any, any>>();
  const status = useSelector(selectStatus);

  const loginMethod = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(login(FormData));
  };

  useEffect(() => {
    if (authContext.loggedin) {
      const methodAsync = async () => {
        try {
          await dispatch(loadjwtUser(FormData));
        } catch (error) {}
      };
      methodAsync();
      router.push("/Dashboard");
    } else if (authContext.message === "BadLogin") {
      alert("Username or password incorrect");
      SetFormData({
        username: "",
        password: "",
      });
    }
  }, [authContext]);

  return (
    <div>
      <h1>Log in </h1>
      <form onSubmit={loginMethod}>
        <input
          type="text"
          value={FormData.username}
          onChange={(e) =>
            SetFormData({ ...FormData, username: e.target.value })
          }
          placeholder="Username"
        />
        <input
          type="password"
          value={FormData.password}
          onChange={(e) =>
            SetFormData({ ...FormData, password: e.target.value })
          }
          placeholder="Password"
        />
        <button> Get into </button>
        {status === "loading" ? "Loading" : "Loaded"}
      </form>
    </div>
  );
};

export default Login;
