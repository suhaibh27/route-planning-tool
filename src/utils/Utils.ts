import { type LngLatLike } from 'mapbox-gl';


export function pairsToMapboxCoordinates(pairs: LngLatLike[] | [number, number]) {
    return pairs.map((pair) => {
        const [lon, lat] = pair as [number, number];
        return `${lon},${lat}`;
    }).join(';');
}