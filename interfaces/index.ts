// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import React, { ReactNode } from "react";

export type IUser = {
  username: string;
  password: string;
  email?: string;
  token?: string;
};

export interface IContext {
  loggedin: boolean;
  user: IUser | null;
  message: string;
  users: IUser[]

  status : "loading" | "idle",
  error : string | null
}

export interface IProps {
  children?: ReactNode;
}
