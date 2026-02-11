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
    return hours > 0 ? `${hours}h ${minutes} min` : `${minutes} min`;

}

export const exportJsonData = (data: any,title:string) => {
    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title||"data"}.json`;
    a.click();

    URL.revokeObjectURL(url);
}