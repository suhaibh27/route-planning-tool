import { useEffect, useRef } from "react";
import mapboxgl, { Map, MapMouseEvent, type LngLatLike, type Source } from 'mapbox-gl';
import { pairsToMapboxCoordinates } from "../../utils/Utils";
import type { MapPoint, Summary } from "../../views/Main";
import { fetchRoute, fetchStreetName, } from "../../apis";

mapboxgl.accessToken = "pk.eyJ1Ijoic3VoYWliaGsiLCJhIjoiY21sZmN3aGNrMDBoczNjc2lod2psdDI5MiJ9.V2FKtFr-p85U0xrCAP1iSQ";
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js');

const DEFAULT_MAP_STYLE: string = "mapbox://styles/suhaibhk/cmlfeia9v001d01sf84h0dfl7";
const DEFAULT_ZOOM_LEVEL: number = 14;
const DEFAULT_CENTER: LngLatLike = [35.93, 31.95];

function Mapbox(props: { addPoint: any; points: MapPoint[]; setSummary: (summary: Summary) => void; }) {
    const { addPoint, points, setSummary } = props;

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            if (mapRef.current!.getSource(`${point.id}-circle`)) continue;
            addPointToMap(point.coordinates, point.id, point.label);
        }

        if (points.length < 2) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            getRoute(points.map((point) => point.coordinates));
        }, 1000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [points]);

 

    const addPointToMap = (point: any, id: string, label: string) => {
        mapRef.current?.addLayer({
            id: `${id}-circle`,
            type: "circle",
            source: {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {
                                label: label
                            },
                            geometry: {
                                type: "Point",
                                coordinates: point,
                            },
                        },
                    ],
                },
            },
            paint: {
                "circle-radius": 12,
                "circle-color": "#ffffff",
            },
        });

        mapRef.current?.addLayer({
            id: `${id}-label`,
            type: "symbol",
            source: `${id}-circle`,
            layout: {
                "text-field": ["get", "label"],
                "text-size": 16,
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],

                "text-anchor": "center",
            },
            paint: {
                "text-color": "#0b011d",
            },
        });
    }


    async function getRoute(points: LngLatLike[] | [number, number]) {
        const mapboxdDirectionCoords = pairsToMapboxCoordinates(points)
        const json = await fetchRoute(mapboxdDirectionCoords);
        const data = json.routes[0];
        const geojson = {
            'type': 'Feature' as const,
            'properties': {},
            'geometry': data.geometry
        };
        setSummary({ totalDistance: data.distance, totalDuration: data.duration });
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
                    'line-color': '#2652ca',
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
                    mapRef.current?.flyTo({
                        center: userLocation,
                        zoom: DEFAULT_ZOOM_LEVEL,
                    });
                   

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
            mapRef.current?.on('click', async (event: MapMouseEvent) => {
                // const roadLayerIds = mapRef.current?.getStyle().layers
                //     ?.filter(layer => layer.id.includes('road'))
                //     .map(layer => layer.id);

                // if (!roadLayerIds || roadLayerIds.length === 0) return;

                // const features = mapRef.current?.queryRenderedFeatures(event.point, {
                //     layers: roadLayerIds
                // });

                // features

                const coords: [number, number] = [event.lngLat.lng, event.lngLat.lat];
                const data = await fetchStreetName(event.lngLat.lng, event.lngLat.lat);
                let pointDetails = {};
                if (data && data.features && data.features.length > 0) {
                    pointDetails = data.features[0]
                }
                addPoint(coords, pointDetails);
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