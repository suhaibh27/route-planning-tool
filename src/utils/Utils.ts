import { type LngLatLike } from 'mapbox-gl';


export function pairsToMapboxCoordinates(pairs: LngLatLike[] | [number, number]) {
    return pairs.map((pair) => {
        const [lon, lat] = pair as [number, number];
        return `${lon},${lat}`;
    }).join(';');
}

export function formatRouteDuration(durationSeconds: number) {
  const totalMinutes = Math.round(durationSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return  hours > 0 ? `${hours}h ${minutes} min` : `${minutes} min`;

}