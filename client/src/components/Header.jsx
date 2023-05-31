import TrackBtn from "./TrackBtn";

export default function Header() {

  return (
    <div className="p-4 bg-white shadow ">
      <div className="container flex flex-row items-center justify-between mx-auto">
        <div id="logo" className="text-2xl font-bold text-blue-500">
          Supply Chain
        </div>
        <div className="flex items-center">
          <TrackBtn />
          {/* <div className="ml-4">
            <Link to={"/signin"} className="flex items-center justify-between py-3 mr-4 font-semibold text-white uppercase bg-blue-600 rounded-full cursor-pointer hover:bg-blue-900 px-9 focus:outline-none focus:shadow-outline">
              Sign in
            </Link>
          </div> */}

        </div>
      </div>
    </div>
  );
}