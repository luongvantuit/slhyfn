import React from "react"


export const useAllProduct = () => {
    const [products, setProducts] = React.useState([])
    const load = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/products`, {
            method: 'GET',
        })
        if (response.ok) {
            const json = await response.json()
            setProducts(json?.products)
        }
    }

    const refresh = () => {
        load()
    }

    React.useEffect(() => {
        load()
    }, [])
    return { products, refresh }
}

