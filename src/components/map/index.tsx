import { useEffect, useRef } from "react";
import mapboxgl, { Map, MapMouseEvent, type LngLatLike, type Source } from 'mapbox-gl';
import { pairsToMapboxCoordinates } from "../../utils/Utils";

mapboxgl.accessToken = "pk.eyJ1Ijoic3VoYWliaGsiLCJhIjoiY21sZmN3aGNrMDBoczNjc2lod2psdDI5MiJ9.V2FKtFr-p85U0xrCAP1iSQ";
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js');

const DEFAULT_MAP_STYLE: string = "mapbox://styles/suhaibhk/cmlfeia9v001d01sf84h0dfl7";
const DEFAULT_ZOOM_LEVEL: number = 14;
const DEFAULT_CENTER: LngLatLike = [35.93, 31.95];

function Mapbox() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);

   

    const addPointToMap = (point: any, id: string, color: string) => {
        mapRef.current?.addLayer({
            id: id,
            type: "circle",
            source: {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Point",
                                coordinates: point,
                            },
                        },
                    ],
                },
            },
            paint: {
                "circle-radius": 10,
                "circle-color": color,
            },
        });
    }

    async function getRoute(points: LngLatLike[] | [number, number]) {
        const mapboxdDirectionCoords = pairsToMapboxCoordinates(points)
        console.log("mapboxgl", mapboxgl.accessToken)
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${mapboxdDirectionCoords}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        const json = await query.json();
        const data = json.routes[0];
        const geojson = {
            'type': 'Feature' as const,
            'properties': {},
            'geometry': data.geometry
        };
        if (mapRef.current?.getSource('route')) {
            (mapRef.current?.getSource('route') as mapboxgl.GeoJSONSource)?.setData(geojson);
        }
        else {
            mapRef.current?.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geojson
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        }
    }

    function setToCurrentLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation: LngLatLike = [
                        position.coords.longitude,
                        position.coords.latitude,
                    ];
                    console.log("User location:", userLocation);
                    mapRef.current?.flyTo({
                        center: userLocation,
                        zoom: DEFAULT_ZOOM_LEVEL,
                    });
                    addPointToMap(userLocation, "origin-circle", "#48ff00");
                    addPointToMap([35.93, 31.95], "destination-circle", "#f30");

                    getRoute([userLocation, [35.93, 31.95]])
                },

                (error) => {
                    console.warn("Geolocation failed:", error.message);
                },
                {
                    enableHighAccuracy: true,
                }
            );
        }

    }

    function setControls() {
        mapRef.current?.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
                showUserHeading: false,
                showAccuracyCircle: false,
                fitBoundsOptions: { zoom: 14 }
            })
        );
    }

    function setupMap() {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: DEFAULT_MAP_STYLE,
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM_LEVEL,
        });
        setControls();
    }

    useEffect(() => {
        setupMap()
        mapRef.current?.on("load", () => {
            setToCurrentLocation()
            mapRef.current?.on('click', (event: MapMouseEvent) => {

                const coords: [number, number] = [event.lngLat.lng, event.lngLat.lat];

                const end: GeoJSON.FeatureCollection<GeoJSON.Point> = {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coords
                            }
                        }
                    ]
                };
                console.log("Clicked coordinates:", coords);
                (mapRef.current?.getSource('destination-circle') as mapboxgl.GeoJSONSource)?.setData(end);

                getRoute([coords, [35.93, 31.95]]);    
            });
        });



        return () => {
            mapRef.current?.remove();
        };
    }, []);

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full"
        />
    )
}

export default Mapbox;