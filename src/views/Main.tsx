import { useEffect, useState } from "react"
import Mapbox from "../components/map"
import SideBar from "../components/sidebar"
import type { LngLatLike } from "mapbox-gl";


export type MapPoint = {
    id: string;
    coordinates: LngLatLike;
    label: string;
    name?:string
};

export type Summary = {
    totalDistance: number;
    totalDuration: number;
};


function Main() {
    const [points, setPoints] = useState<MapPoint[]>([]);
    const [summary, setSummary] = useState<Summary>({ totalDistance: 0, totalDuration: 0 });

    function addPoint(point: LngLatLike, pointDetails: any = {}) {
        if (points.length >= 25) {
            alert("Maximum of 25 points allowed.");
            return;
        }
        setPoints((prevPoints) => [...prevPoints, { coordinates: point, id: `point-${prevPoints.length + 1}`, label: `${prevPoints.length + 1}`,name:pointDetails.place_name }]);
    }

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
                <SideBar  addPoint={addPoint} summary={summary} points={points}/>
                <div className="flex-1 bg-gray-300">
                    <Mapbox addPoint={addPoint} points={points} setSummary={(summary:Summary)=>setSummary(summary)}/>
                </div>
            </div>
            <div className="p-4 ">
                footer
            </div>
        </div>
    )
}

export default Main
