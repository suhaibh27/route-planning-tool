import mapboxgl from 'mapbox-gl';


export async function fetchRoute(coords: string) {
    try {
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        const json = await query.json();
        return json;
    } catch (err) {
        return null;
    }
}


export async function fetchStreetName(lng: number, lat: number, types: string[] = ["address"]) {
    try {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=${types.join(',')}&access_token=${mapboxgl.accessToken}`
        );
        const json = await res.json();
        return json;
    } catch (err) {
        return null;
    }
}