import React from "react";

import { GrLocation, GrUserWorker } from "react-icons/gr";
import { BsPerson } from "react-icons/bs";
import { TiContacts } from "react-icons/ti";
import { MdOutlineMailOutline } from "react-icons/md";

export default function UserDetails() {
  const userData ={
    name : "",
    location : "",
    profession : "",
    emailAddress : "",
    contactNo : "",
  }
  return (
    <div>
      <div className="px-12 py-16 my-8 text-black bg-white rounded shadow-lg w-96">
        <h1 className="mb-8 text-2xl font-bold text-center uppercase">
          Organization Details 
        </h1>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {/* Wallet Address */} Organization
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter Organization Name Here"
            
          />
        </div>

        <div className="flex items-center justify-center py-3 font-semibold text-white uppercase bg-blue-600 rounded-full cursor-pointer hover:bg-blue-900 px-9 focus:outline-none focus:shadow-outline" >
          Get Details
        </div>
        <div>
          {userData.name !== "" ? (
            <div className="py-4 -mb-8">
              <div className="flex flex-col items-start mb-4 ml-1 font-medium text-gray-900 text-md">
                <div className="flex items-start">
                  {" "}
                  <BsPerson className="mt-1 mr-1" />
                  Name :
                </div>

                <div className="flex items-center w-full px-8 py-1 mt-2 ml-2 text-gray-500 bg-gray-200 rounded-full">
                  {userData.name.toUpperCase()}
                </div>
              </div>
              <div className="flex flex-col items-start mb-4 font-medium text-gray-900 text-md">
                <div className="flex items-start">
                  <GrLocation className="mt-1 mr-1" /> Location :
                </div>
                <div className="flex items-center w-full px-8 py-1 mt-2 ml-2 text-gray-500 bg-gray-200 rounded-full">
                  {" "}
                  {userData.location.toUpperCase()}
                </div>
              </div>
              <div className="flex flex-col items-start mb-4 font-medium text-gray-900 text-md">
                <div className="flex items-start">
                  <GrUserWorker className="mt-1 mr-1" /> Profession :
                </div>
                <div className="flex items-center w-full px-8 py-1 mt-2 ml-2 text-gray-500 bg-gray-200 rounded-full">
                  {" "}
                  {userData.profession.toUpperCase()}
                </div>
              </div>
              <div className="flex flex-col items-start mb-4 font-medium text-gray-900 text-md">
                <div className="flex items-start">
                  <MdOutlineMailOutline className="mt-1 mr-1" /> Email Address :
                </div>
                <div className="flex items-center w-full px-8 py-1 mt-2 ml-2 text-gray-500 bg-gray-200 rounded-full">
                  {" "}
                  {userData.emailAddress}
                </div>
              </div>
              <div className="flex flex-col items-start mb-4 font-medium text-gray-900 text-md">
                <div className="flex items-start">
                  <TiContacts className="mt-1 mr-1" /> Contact No. :
                </div>
                <div className="flex items-center w-full px-8 py-1 mt-2 ml-2 text-gray-500 bg-gray-200 rounded-full">
                  {" "}
                  {userData.contactNo}
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
