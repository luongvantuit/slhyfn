import React from "react"

export const DashboardContext = React.createContext({})

export const useDashboardContext = () => {

    const [products, setProducts] = React.useState([])
    const [allProducts, setAllProducts] = React.useState([])
    const [msp, setMsp] = React.useState("")
    const load = async () => {
        const getProducts = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/myproduct`, {
            method: 'POST',
        })
        if (getProducts.ok) {
            const json = await getProducts.json()
            setProducts(json?.products)
        }
        const getAllProducts = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/products`, {
            method: 'GET',
        })
        if (getAllProducts.ok) {
            const json = await getAllProducts.json()
            setAllProducts(json?.products)
        }
        const getMspRes = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/mymsp`, {
            method: 'POST',
        })
        if (getMspRes.ok) {
            const json = await getMspRes.json()
            setMsp(json?.msp)
        }
    }
    const refresh = () => {
        load()
    }
    React.useEffect(() => {
        load()
    }, [])
    return {
        products,
        refresh,
        allProducts,
        msp
    }
}