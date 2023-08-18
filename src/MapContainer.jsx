import { useState } from "react";
import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from "@react-google-maps/api";

import "./assets/styles/MapContainer.css";

export default function MapContainer({ featureData, mapCenterPoint }) {

    const [selectedMarker, setSelectedMarker] = useState(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN,
    });

    if (!isLoaded) return <div>Loading Google Map... Please wait</div>;
    return (
        <GoogleMap
            zoom={5}
            center={mapCenterPoint}
            mapContainerClassName="map-container"
        >
            {featureData &&
                featureData.map((feature, index) => (
                    <MarkerF
                        key={index}
                        position={{
                            lng: feature.geometry.coordinates[0],
                            lat: feature.geometry.coordinates[1]
                        }}
                        onClick={() => {
                            setSelectedMarker(featureData[index])
                        }}
                    />
                ))}

            {selectedMarker &&
                <InfoWindow
                    position={{
                        lng: selectedMarker.geometry.coordinates[0],
                        lat: selectedMarker.geometry.coordinates[1]
                    }}
                    onCloseClick={() => setSelectedMarker(null)}
                >
                    <div>
                        <h4>{selectedMarker.properties.place}</h4>
                        <p>{new Date(selectedMarker.properties.time).toLocaleString()}</p>
                    </div>
                </InfoWindow>
            }

        </GoogleMap>
    );
}