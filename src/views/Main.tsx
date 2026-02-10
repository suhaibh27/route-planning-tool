import Mapbox from "../components/map"



function Main() {
  


    return (
        <div className="flex flex-col min-h-screen  bg-[color:var(--primary-color)]">
            <div className="p-4 flex justify-between items-center">
                <h1 className="text-2xl text-white">Route Planning Tool</h1>
                <div className="flex items-center">
                    <button className="p-3 bg-gray-300 rounded-sm mr-4">optimize</button>
                    <button className="p-3 bg-gray-300 rounded-sm">export</button>
                </div>
            </div>
            <div className="flex flex-1">
                <div className="w-64 md:w-80 lg:w-96 p-4 flex flex-col gap-10">
                    <div className="border rounded-sm border-[color:var(--secondary-color)] p-4">
                        
                    </div>
                </div>
                <div className="flex-1 bg-gray-300">
                  <Mapbox/>
                </div>
            </div>
            <div className="p-4 ">
                footer
            </div>
        </div>
    )
}

export default Main
