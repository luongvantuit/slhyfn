import React, { useContext } from "react";
import UserDetails from "./UserDetails";
import { Oval } from "react-loader-spinner";

import Header from "../components/Header";

export default function ConsumerInterFace() {
  
  return (
    <div className="h-full">
      <Header />
      <div>
        {
            <div className="container flex items-center justify-center w-full py-8 mx-auto">
              <UserDetails />
            </div>
         }
      </div>
    </div>
  );
}