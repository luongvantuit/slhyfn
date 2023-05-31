import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose, MdContentCopy } from "react-icons/md";

import { toast } from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { DashboardContext } from "../contexts/useDashboardContext";
import { Box } from "@mui/material";

const modelStyles = {
  content: {
    zIndex: "100",
  },
};

export default function ProductCard({
  id,
  name,
  type,
  dependencies,
  issuerOrgId,
  state,
  createdAt,
  histories
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [note, setNote] = React.useState()
  const [date, setDate] = React.useState()
  const [isProgressing, setProgressing] = React.useState(false)
  const dashboardContext = React.useContext(DashboardContext)


  const [productDependencies, setProductDependencies] = React.useState([])

  const load = async (_dependencies) => {
    const result = []
    for (let index = 0; index < _dependencies.length; index++) {
      const dependency = _dependencies[index];
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/products/${dependency}`, {
        method: 'GET',
      })
      if (response.ok) {
        const pJSON = await response.json()
        result.push(pJSON.product)
      }
    }
    setProductDependencies(result)
  }

  React.useEffect(() => {
    load(dependencies)
  }, [dependencies])

  return (
    <React.Fragment>
      <Modal isOpen={modalIsOpen} style={modelStyles} className={"w-full flex flex-col justify-center items-center h-full bg-transparent"}>
        <div className="relative flex flex-col items-center  justify-center p-8 text-black bg-transparent bg-white border-[0.5px] border-gray-400 rounded shadow-md">
          <MdClose
            onClick={() => setModalIsOpen(false)}
            className="absolute cursor-pointer top-4 right-4"
            size={35}
          />
          <div className="flex flex-col items-start justify-center mx-3 ">

            <h1 className="mb-3 text-xl font-bold text-center uppercase ">
              product details
            </h1>
            <button className="flex flex-row items-center w-full px-4 py-1 mb-2 text-gray-500 bg-gray-200 rounded-full" onClick={async () => {
              await navigator.clipboard.writeText(id)
              toast('Copy to clipboard!')
            }}>
              <MdContentCopy className="mr-2" />
              <p className="truncate">{id}</p>
            </button>
            <p className="block mb-2 font-medium text-gray-900 text-md">
              Product Name: {name}
            </p>
            <p className="block mb-2 font-medium text-gray-900 text-md">
              Product Type: {type === "primary" ? "Primary" : "Derived"}
            </p>
            {
              productDependencies?.length > 0 ? <p className="block mb-2 font-medium text-gray-900 text-md">
                Product Ingredient: {productDependencies?.map((p) => {
                  return p.name
                }).join(", ")}
              </p> : <React.Fragment></React.Fragment>
            }
            <p className="block mb-2 font-medium text-gray-900 text-md">
              Issuer Org Id: {issuerOrgId}
            </p>
            <p className="block mb-2 font-medium text-gray-900 text-md">
              State: {state === "unblock" ? "Unblock" : "Block"}
            </p>
            <p className="block mb-2 font-medium text-gray-900 text-md">
              Created At: {new Date(createdAt).toUTCString()}
            </p>
            <Box maxHeight={250}>
              {
                histories?.length > 0 ? <DataGrid
                  rows={histories?.map((history, idx) => {
                    return {
                      id: idx,
                      ...history,
                      createdAt: new Date(history.createdAt).toUTCString()
                    }
                  })}
                  columns={[
                    { field: 'id', headerName: 'STT', width: 60 },
                    { field: 'note', headerName: 'Note', width: 180 },
                    { field: 'mspId', headerName: 'Organization', width: 160 },
                    {
                      field: 'createdAt',
                      headerName: 'Created At',
                      width: 240
                    },
                  ]}
                  rowSelection={false}
                /> : <React.Fragment></React.Fragment>
              }
            </Box>
            <form className="w-full" onSubmit={async (e) => {
              e.preventDefault()
              setProgressing(true)
              const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/histories`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id, note, date: new Date(date).toISOString()
                })
              })
              const json = await response.json()
              if (response.ok) {
                dashboardContext?.refresh()
                toast.success("Update product information success")
              } else {
                toast.error(`Error ${json.details?.map(v => v?.message)?.join(', ')}`)
              }
              setProgressing(false)
              setDate('')
              setNote('')
            }}>
              <div className="w-full mb-2">
                <label className="block text-xl font-semibold text-gray-900">
                  Note
                </label>
                <input
                  value={note}
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Note"
                  onChange={(e) => {
                    setNote(e.target.value)
                  }}
                  required
                  disabled={isProgressing}
                />
              </div>
              <div className="w-full mb-4">
                <label className="block text-xl font-semibold text-gray-900">
                  Date
                </label>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  type="datetime-local"
                  placeholder="Note"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  value={date}
                  required
                  disabled={isProgressing}
                />
              </div>
              <button type="submit"
                className="flex items-center justify-center w-full py-3 font-semibold text-white uppercase bg-blue-600 rounded-md cursor-pointer hover:bg-blue-900 px-9 focus:outline-none focus:shadow-outline disabled:bg-gray-500"
                disabled={isProgressing}
              >
                Update Information
              </button>
            </form>
          </div>
        </div>
      </Modal >
      <div className="z-10 px-6 py-8 bg-white rounded-lg shadow-lg border-[0.5px] border-gray-400">
        <button className="flex flex-row items-center w-full px-4 py-1 mb-4 text-gray-500 bg-gray-200 rounded-full" onClick={async () => {
          await navigator.clipboard.writeText(id)
          toast('Copy to clipboard!')
        }}>
          <MdContentCopy className="mr-1" />
          <p className="truncate">{id}</p>
        </button>
        <div
          className="px-1 mb-4 cursor-pointer"
          onClick={() => setModalIsOpen(!modalIsOpen)}
        >
          <div className="block mb-6 font-medium text-gray-900 text-md">
            Product Name: {name}
          </div>
          <div className="block mb-6 font-medium text-gray-900 text-md">
            Product Type: {type === "primary" ? "Primary" : "Derived"}
          </div>
          {/* <div className="block mb-6 font-medium text-gray-900 text-md">
            Product Ingredient Names : {dependencies?.join(', ')}
          </div> */}
          <div className="block mb-6 font-medium text-gray-900 text-md">
            Issuer Org Id: {issuerOrgId}
          </div>
          <div className="block mb-6 font-medium text-gray-900 text-md">
            State: {state === "block" ? "Block" : "Unblock"}
          </div>
          <p className="block mb-6 font-medium text-gray-900 text-md">
            Created At : {new Date(createdAt).toUTCString()}
          </p>
        </div>
      </div>
    </React.Fragment>
  );
}