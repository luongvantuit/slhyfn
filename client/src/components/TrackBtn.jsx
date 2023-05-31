import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose, MdOutlineTrackChanges } from "react-icons/md";

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import '@mui/material'
import { toast } from "react-hot-toast";
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
  },
};


const ProductIngredientElement = ({ dependency, onClick }) => {
  const [product, setProduct] = React.useState()

  const load = async (_dependency) => {
    if (_dependency) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/products/${_dependency}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',

      })
      if (response.ok) {
        const json = await response.json()
        setProduct(json.product)
      } else {
        const json = await response.json()
        toast.error(`Error ${json.details?.map(v => v?.message)?.join(', ')}`)
      }
    }
  }

  React.useEffect(() => {
    load(dependency)
  }, [dependency])

  return <div>
    <button type="button" className="flex flex-row items-center justify-start " onClick={onClick}>
      <p className="text-black">{product?.id}</p>
      <p className="text-blue-500">{`(${product?.name})`}</p>
    </button>
  </div>
}



export default function TrackBtn() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [productId, setProductId] = React.useState('')
  const [product, setProduct] = React.useState()
  return (
    <>
      <Modal isOpen={modalIsOpen} style={customStyles}>
        <form className="flex flex-col items-center justify-center w-full px-12 text-black bg-white border-2 border-gray-200 rounded shadow-md py-14 " onSubmit={async (e) => {
          e.preventDefault()
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/products/${productId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET',

          })
          if (response.ok) {
            const json = await response.json()
            setProduct(json.product)
          } else {
            const json = await response.json()
            toast.error(`Error ${json.details?.map(v => v?.message)?.join(', ')}`)
          }
        }}  >
          <div className="flex flex-col items-start w-full">
            <MdClose
              onClick={() => {
                setModalIsOpen(!modalIsOpen)
                setProduct({})
              }}
              className="absolute cursor-pointer top-4 right-6"
              size={24}
            />

            <h1 className="mb-8 text-3xl font-bold text-center uppercase ">
              Get product details
            </h1>
            <div className="w-full mb-4">
              <label className="block mb-2 text-lg font-semibold text-gray-900">
                Product ID
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                placeholder="Enter ID product..."
                onChange={(e) => {
                  setProductId(e.target.value)
                }}
              />
            </div>
            {
              product?.dependencies?.length !== 0 && product ? <div className="flex flex-col justify-start mb-2">
                <p className="text-lg font-semibold">
                  Product Ingredient
                </p>
                {
                  product?.dependencies?.map((dependency, idx) => {
                    return <ProductIngredientElement key={idx} dependency={dependency} onClick={async () => {
                      console.log("Test");
                      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/products/${dependency}`, {
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        method: 'GET',

                      })
                      if (response.ok) {
                        const json = await response.json()
                        setProduct(json.product)
                      } else {
                        const json = await response.json()
                        toast.error(`Error ${json.details?.map(v => v?.message)?.join(', ')}`)
                      }
                    }} />
                  })
                }
              </div> : <React.Fragment></React.Fragment>
            }
            {
              product && product?.histories?.length === 0 ? <div>
                <p>
                  Not Found Information Of Product
                </p>
              </div> : <React.Fragment>

              </React.Fragment>
            }
            {
              product?.histories?.length > 0 ?
                <Box sx={{ maxHeight: 400, width: 780 }}>
                  <DataGrid
                    rows={(product?.histories?.map((history, idx) => {
                      return {
                        id: idx,
                        ...history,
                        createdAt: new Date(history.createdAt).toUTCString()
                      }
                    }))}
                    columns={[
                      { field: 'id', headerName: 'STT', width: 90 },
                      { field: 'mspId', headerName: 'Organization', width: 120 },
                      {
                        field: 'note',
                        headerName: 'Note',
                        width: 250,
                      },
                      {
                        field: 'createdAt',
                        headerName: 'Created At',
                        width: 250,
                      },

                    ]}
                  // onCellDoubleClick={(params) => {
                  //   if (params?.id !== undefined && data[params?.id][0]) {
                  //     window.navigator.clipboard.writeText(data[params?.id][0]?.toString())
                  //     toast.success('Copied to clipboard! Address');
                  //   }
                  // }}

                  />
                </Box> : <React.Fragment></React.Fragment>
            }

            <button
              className="flex items-center justify-center w-full py-3 mt-4 font-semibold text-white uppercase bg-blue-600 rounded-full cursor-pointer hover:bg-blue-900 px-9 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Find
              <MdOutlineTrackChanges className="ml-1" />
            </button>
          </div>
        </form>
      </Modal>
      <div
        className="flex items-center justify-between py-3 font-semibold text-white uppercase bg-blue-600 rounded-full cursor-pointer hover:bg-blue-900 px-9 focus:outline-none focus:shadow-outline"
        onClick={() => setModalIsOpen(!modalIsOpen)}
      >
        Find Product
        <MdOutlineTrackChanges className="ml-1" />
      </div>
    </>
  );
}
