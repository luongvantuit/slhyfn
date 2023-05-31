import React from "react"


export const useMyProject = () => {
    const [myProduct, setMyProduct] = React.useState([])
    const load = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/myproduct`, {
            method: 'GET',
        })
        if (response.ok) {
            const json = await response.json()
            setMyProduct(json?.products)
        }
    }

    const refresh = () => {
        load()
    }

    React.useEffect(() => {
        load()
    }, [])
    return { myProduct, refresh }
}

