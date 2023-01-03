import React, { useState, useContext, useEffect } from "react";
import { IContext, IUser } from "../../interfaces";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getAuthState,
  logup,
  loadjwtUser,
  gotit,
} from "../../redux/AuthReducer";

import config from "../../config";
import { ThunkDispatch } from "@reduxjs/toolkit";

const Logup = () => {
  const authContext = useSelector(getAuthState);
  const dispatch = useDispatch<ThunkDispatch<IContext, any, any>>();
  const router = useRouter();
  const [FormData, SetFormData] = useState<IUser>({
    username: "",
    password: "",
    email: "",
  });

  const logupMethod = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(logup(FormData));
  };

  useEffect(() => {
    if (authContext.loggedin) {
      setCookie("protectedNext", JSON.stringify(authContext.user), {
        path: "/",
        domain: config.domain,
        maxAge: 3600, // Expires after 1hr
        sameSite: true,
      });
      router.push("/Dashboard");
    } else if (authContext.message === "BadLogup") {
      alert("Such username is already in use please choose another username.");
      dispatch(gotit());
    }
  }, [authContext]);

  useEffect(() => {
    if (authContext.loggedin) {
      const methodAsync = async () => {
        try {
          await dispatch(loadjwtUser(FormData));
        } catch (error) {}
      };
      methodAsync();
      router.push("/Dashboard");
    } else if (authContext.message === "BadLogup") {
      alert("Such username is already in use please choose another username.");
    }
  }, [authContext]);

  return (
    <div>
      <h1>Logup</h1>
      <form onSubmit={logupMethod}>
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
        <input
          type="text"
          value={FormData.email}
          onChange={(e) => SetFormData({ ...FormData, email: e.target.value })}
          placeholder="Email"
        />
        <button> Get into </button>
      </form>
    </div>
  );
};

export default Logup;
