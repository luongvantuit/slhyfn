import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    padding: "0 0 0 0",
    zIndex: "100",
  },
};

export default function ProductCard({
  id,
  name,
  type,
  productTypeIngredientNames,
  issuerOrgID,
  state,
  currentBlockerOrgld,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);


  const handleCancel = () => {
    // cancelProduct(tokenID);
    setModalIsOpen(!modalIsOpen);

  };


  return (
    <>
      <Modal isOpen={modalIsOpen} style={customStyles}>
        <div className="flex flex-col items-center w-full px-12 bg-white border-2 border-gray-200 rounded shadow-md py-14 text-blac ">
          <div className="flex flex-col items-start w-full mb-2">
            <MdClose
              onClick={() => setModalIsOpen(!modalIsOpen)}
              className="absolute cursor-pointer top-4 right-6"
              size={35}
            />

            <h1 className="mb-8 text-3xl font-bold text-center uppercase ">
              product details
            </h1>

            <div className="block mb-6 font-medium text-gray-900 text-md">
              Product Name : {name}
            </div>
            <div className="block mb-6 font-medium text-gray-900 text-md">
              Product Id : {id}
            </div>
            <div className="block mb-6 font-medium text-gray-900 text-md">
              Product Type : {type}
            </div>

            <div className="block mb-6 font-medium text-gray-900 text-md">
              Issuer Orgld : {issuerOrgID}
            </div>
            <div className="block mb-6 font-medium text-gray-900 text-md">
              State : {state}
            </div>
            <div className="block mb-6 font-medium text-gray-900 text-md">
              Current Orgld : {currentBlockerOrgld}
            </div>
          </div>

          <div className="w-full ">

            <div className="flex items-center justify-between w-2/6 md:w-full">
              <button
                className="flex items-center justify-center px-8 py-2 font-semibold text-white uppercase bg-red-500 rounded-full cursor-pointer hover:bg-red-900 focus:outline-none focus:shadow-outline"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="flex items-center justify-center px-8 py-2 font-semibold text-white uppercase bg-blue-600 rounded-full cursor-pointer hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                onClick={null}
              >
                Buy
              </button>
            </div>
          </div>

        </div>
      </Modal >
      <div className="z-10 px-6 py-8 bg-white rounded-lg shadow-md drop-shadow-lg border-[1px] border-gray-200">

        <div
          onClick={() => setModalIsOpen(!modalIsOpen)}
        >
          <div className="block mb-3 font-medium text-gray-900 text-md">
            Product Name : {name}
          </div>
          <div className="block mb-3 font-medium text-gray-900 text-md">
            Product Id : {id.substr(0, 2) + "..."}
          </div>
          <div className="block mb-3 font-medium text-gray-900 text-md">
            Product Type : {type}
          </div>

          <div className="block mb-3 font-medium text-gray-900 text-md">
            Issuer Orgld : {issuerOrgID}
          </div>
          <div className="block mb-3 font-medium text-gray-900 text-md">
            State : {state}
          </div>
          <div className="block mb-3 font-medium text-gray-900 text-md">
            Current Orgld : {currentBlockerOrgld}
          </div>
          <div className="flex items-start font-medium text-gray-900 text-md">

          </div>
        </div>
      </div>
    </>
  );
}