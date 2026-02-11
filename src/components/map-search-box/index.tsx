import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl, { type LngLatLike } from 'mapbox-gl';
import { useRef, useState } from "react";


const MapSearchBox = (props: { onRetrieve: (point: LngLatLike, pointDetails?: any) => void }) => {
    const { onRetrieve } = props;

    return (
        <SearchBox
            accessToken={mapboxgl.accessToken as string}
            options={{
                types: "street",
                language: "en",
                country: "JO",
                limit: 5
            }}

            theme={{
                variables: {
                   
                    borderRadius: "6px",
                    fontFamily: "inherit",

                }
            }}
            onRetrieve={(result) => {
                const feature = result.features[0];
                if (!feature) return;

                const coords = feature.geometry.coordinates;
                
                onRetrieve(coords as [number, number], { place_name: feature.properties.name });
            }}

        >

        </SearchBox>
    )
}

export default MapSearchBox