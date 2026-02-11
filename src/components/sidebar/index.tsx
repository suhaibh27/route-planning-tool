import { type LngLatLike } from 'mapbox-gl';
import { formatRouteDuration } from "../../utils/Utils";
import type { MapPoint, Summary } from "../../views/Main";
import MapSearchBox from '../map-search-box';

function SideBar(props: { summary: Summary, points: MapPoint[], addPoint: (point: LngLatLike, pointDetails?: any) => void }) {
    const { summary, points, addPoint } = props;
    return (
        <div className="w-64 md:w-80 lg:w-96 p-4 flex flex-col gap-5 ">
            <div >
               <MapSearchBox
               onRetrieve={(point:LngLatLike, pointDetails:any) => addPoint(point, pointDetails)}
               />
            </div>
            {
                (points && points.length > 0) &&
                points.map((point) => (
                    <div className="border rounded-sm border-gray-300 p-4 bg-[color:var(--secondary-color)] flex items-center gap-x-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white text-[color:var(--primary-color)] flex items-center justify-center font-bold">
                            {point.label}
                        </div>
                        <label className="text-white">
                            {point.name}
                        </label>
                    </div>
                ))
            }


            <div className="mt-6 border rounded-sm border-gray-300 p-4 bg-[color:var(--secondary-color)]">
                <h2 className="text-white text-lg mb-4">Route Summary:</h2>
                <div className="flex justify-between text-gray-400">
                    <span>Total Distance:</span>
                    <span className="text-white">{(summary.totalDistance / 1000).toFixed(1)} km</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>Total Duration:</span>
                    <span className="text-white">{formatRouteDuration(Number(summary.totalDuration))}</span>
                </div>
            </div>
        </div>
    )
}

export default SideBar