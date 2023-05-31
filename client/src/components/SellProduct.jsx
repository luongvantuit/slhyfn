import { Box, Modal } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import React from "react";
import { toast } from "react-hot-toast";
import { s2d } from "../s2d";
import { DashboardContext } from "../contexts/useDashboardContext";
import { MdClose } from "react-icons/md";

const modelStyles = {
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

export default function SellProduct() {

  const [name, setName] = React.useState("")
  const [type, setType] = React.useState("primary")
  const [dependencies, setDependencies] = React.useState([])
  const [isProgressing, setProgressing] = React.useState(false)
  const [openSelectProduct, setOpenSelectProduct] = React.useState(false)
  const apiRef = useGridApiRef()

  const dashboardContext = React.useContext(DashboardContext)

  return (
    <React.Fragment>
      <Modal open={openSelectProduct} style={modelStyles}>
        <div className="flex flex-col items-center justify-center w-full h-screen px-12 bg-transparent py-14">

          <div className="flex flex-col items-center justify-center px-4 py-8 bg-white rounded-md">
            <div className="flex justify-end w-full mx-8">
              <MdClose
                onClick={() => setOpenSelectProduct(false)}
                size={35}
              />
            </div>
            <h1 className="mb-8 text-3xl font-bold text-center uppercase">
              List Products
            </h1>
            <Box>
              {
                dashboardContext?.allProducts?.filter(v => {
                  return true
                }).length > 0 ? <DataGrid
                  apiRef={apiRef}
                  rows={dashboardContext?.allProducts?.map((product, idx) => {
                    return {
                      idx,
                      ...product,
                      createdAt: s2d(product?.createdAt)
                    }
                  })}
                  checkboxSelection={true}
                  columns={[
                    { field: 'idx', headerName: 'STT', width: 60 },
                    { field: 'id', headerName: 'ID', width: 160 },
                    { field: 'issuerOrgId', headerName: 'MSP', width: 120 },
                    {
                      field: 'name',
                      headerName: 'Name',
                      width: 160,
                    },
                    {
                      field: 'type',
                      headerName: 'Type',
                      width: 100,
                    },
                    {
                      field: 'createdAt',
                      headerName: 'Created At',
                      width: 180
                    },
                  ]}
                  pageSizeOptions={[5, 10]}
                  rowSelection
                /> : <React.Fragment></React.Fragment>
              }
            </Box>
            <button type="button"
              className="flex items-center justify-center w-full py-3 mt-4 font-semibold text-white uppercase bg-blue-600 rounded-md cursor-pointer hover:bg-blue-900 px-9 focus:outline-none focus:shadow-outline disabled:bg-gray-500"
              onClick={() => {
                if (apiRef.current) {
                  const depends = []
                  if (dashboardContext?.allProducts?.length > 0) {
                    apiRef?.current?.getSelectedRows()?.forEach((v) => {
                      depends.push(v.id)
                    })
                    setDependencies(depends)
                  }
                }
                setOpenSelectProduct(false)
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </Modal>
      <form className="px-6 py-5 text-black border-[0.5px] border-gray-400 bg-white rounded shadow-lg w-[340px]" onSubmit={async (e) => {
        e.preventDefault()
        setProgressing(true)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/products`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            name, type, dependencies
          })
        })
        const json = await response.json()
        if (response.ok) {
          setName("")
          setType("primary")
          setDependencies([])
          dashboardContext?.refresh()
          toast.success(`Create success product ${json?.product?.id}`)
        } else {
          toast.error(`Error ${json.details?.map(v => v?.message)?.join(', ')}`)
        }
        setProgressing(false)
      }
      }>
        <h1 className="mb-2 text-2xl font-bold text-center uppercase">
          New Product
        </h1>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Product Type Name
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter product name..."
            onChange={(e) =>
              setName(e.target.value)
            }
            value={name}
            required
            disabled={isProgressing}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Select type
          </label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={(e) =>
              setType(e.target.value)
            }
            disabled={isProgressing}
          >
            <option value="primary" defaultValue={type}>
              Primary
            </option>
            <option value="derived">
              Derived
            </option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Product Ingredient
          </label>
          <button
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            onClick={() => {
              setOpenSelectProduct(true)
              dashboardContext?.refresh()
            }}
            disabled={isProgressing}
            type="button"
          >
            Select Product Ingredient
          </button>
          <div className="flex flex-col mt-3 space-y-2">
            {
              dependencies?.map((dependency, idx) => {
                return <React.Fragment key={idx}>
                  <a href="/" className="text-blue-400 underline truncate">{dependency}</a>
                </React.Fragment>
              })
            }
          </div>
        </div>
        <button type="submit"
          className="flex items-center justify-center w-full py-3 font-semibold text-white uppercase bg-blue-600 rounded-md cursor-pointer hover:bg-blue-900 px-9 focus:outline-none focus:shadow-outline disabled:bg-gray-500"
          disabled={isProgressing}
        >
          Submit
        </button>
      </form>
    </React.Fragment>
  );
}
