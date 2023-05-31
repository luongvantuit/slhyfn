import React, { useContext, useState } from "react";
import {
  Link
} from "react-router-dom";

import { toast } from "react-hot-toast";

export default function SignInPage() {

  const [user, setUser] = useState({
    username: "",
    passwork: "",
  });

  const signInUser = async(username,passwork) => {}
  const handleSignIn = async () => {
    if (user.name && user.location && user.profession) {
      signInUser(
        user.username,
        user.passwork
      );
    } else {
      toast.error("Error");
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center h-screen w-1/3">
      <div className="bg-white px-12 py-14 rounded-lg shadow-lg border-gray-200 border-2 text-blac w-full flex flex-col items-center">
        <h1 className="uppercase mb-8 text-3xl text-center font-bold ">
          Sign In
        </h1>
        <div className="mb-4 w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter your username..."
            onChange={(e) =>
              setUser((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Passwork
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter your passwork..."
            onChange={(e) =>
              setUser((prev) => ({ ...prev, location: e.target.value }))
            }
          />
        </div>
        <div className="mb-4 w-full flex mt-6 item-center justify-center">
          <Link to={"/"}
            className="bg-blue-600 mr-20 hover:bg-blue-900 rounded-full text-white  py-3 px-9 focus:outline-none focus:shadow-outline uppercase flex items-center justify-between cursor-pointer font-semibold"
          >
            Back
          </Link>
          <button
            className="bg-blue-600 hover:bg-blue-900 rounded-full text-white  py-3 px-9 focus:outline-none focus:shadow-outline uppercase flex items-center justify-between cursor-pointer font-semibold"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}