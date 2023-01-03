import React, { ReactNode, useContext, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { getAuthState, verifyjwtUser } from "../redux/AuthReducer";
import { logout } from "../redux/AuthReducer";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { IContext } from "../interfaces";
import { useRouter } from "next/router";
import { deleteCookie, getCookie} from "cookies-next";
import config from "../config";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => {
  const authContext = useSelector(getAuthState);
  const dispatch = useDispatch<ThunkDispatch<IContext, any, any>>();
  const router = useRouter();

  useEffect(() => {
      let jwt : string 
      try {
         jwt = getCookie("protectedNext").toString() 
      } catch (error) {
         jwt = "---"
      }
      const methodAsync = async () => {
        try {
          await dispatch(verifyjwtUser(jwt)) 
        } catch (error) {}
      }
      methodAsync()
  }, [])

  const logoutMethod = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (!authContext.loggedin) {
      router.push("/Auth/Login")
    };
    if(authContext.message === "BadRefresh"){
      deleteCookie("protectedNext", { path: "/", domain: config.domain });
    }
  }, [authContext]);

  return (
    <div>
      <Head>
        <title>{authContext.loggedin ? "Dashboard" : "Authentication"}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href={authContext.loggedin ? "/Dashboard" : "/"}>Home</Link>
          {authContext.loggedin ? (
            <>
              <Link href="/Dashboard/profile">Profile</Link>
              <button onClick={logoutMethod}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/Auth/Login">Log In</Link>
              <Link href="/Auth/Logup">LogUp</Link>
            </>
          )}
        </nav>
      </header>
      {children}
      <footer>
        <hr />
        <span>I'm here to stay (Footer)</span>
      </footer>
    </div>
  );
};

export default Layout;
