import React from "react";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "swiper/css";
import { AiOutlineArrowRight } from "react-icons/ai";
// import UserDetails from "./UserDetails";
import SellProduct from "./SellProduct";
import { DashboardContext, useDashboardContext } from "../contexts/useDashboardContext";
export default function Dashboard() {

  const { products, refresh, allProducts, msp } = useDashboardContext()

  return (
    <DashboardContext.Provider value={{
      products,
      refresh,
      msp,
      allProducts
    }}>
      <div className="h-full">
        <Header />
        <div className="w-full mx-auto">
          <div className="container flex flex-row items-center justify-between mx-auto" >
            {
              <div className="flex flex-1 py-8 ">
                <div className="z-0 flex flex-col ml-3">
                  {/* <UserDetails /> */}
                  <SellProduct />
                </div>
                <div className="z-0 flex flex-col w-full ml-5">
                  <div className="flex flex-col items-start w-full">
                    <h1 className="flex mb-8 ml-6 text-2xl font-bold uppercase">
                      My Listing <AiOutlineArrowRight className="mt-1 ml-4" />
                    </h1>
                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3 drop-shadow-md">
                      {products.map((product) => {
                        return (
                          <div key={product?.id} className="mb-8">
                            <ProductCard
                              {...product}
                            />
                          </div>
                        );

                      })}
                    </div>
                  </div>
                  {/* <div className="flex flex-col items-start w-full">
                    <h1 className="flex mb-8 ml-6 text-2xl font-bold uppercase">
                      Shopping <AiOutlineArrowRight className="mt-1 ml-4" />
                    </h1>
                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3 drop-shadow-md">
                      {allProducts?.filter(p => {
                        if (p?.issuerOrgId !== msp) {
                          return true
                        }
                        return false
                      })?.map((product) => {
                        return (
                          <div key={product?.id} className="mb-8">
                            <ProductCard
                              {...product}
                            />
                          </div>
                        );

                      })}
                    </div>
                  </div> */}


                </div>
              </div>
            }
          </div>

        </div>
      </div>
    </DashboardContext.Provider>
  );
}