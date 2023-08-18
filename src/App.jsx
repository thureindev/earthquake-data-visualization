import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import './assets/styles//App.css';
import MapContainer from './MapContainer';

const API_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

function App() {
    // api documentation for bbox data https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
    //  //  metadata.title = string
    const [title, setTitle] = useState("Earthquake Data");
    //  //  metadata.count = number
    const [count, setCount] = useState(0);
    //  //  features
    //  //  coordinates: features[index].geometry.coordinates
    //  //  location: features[index].properties.place
    //  //  time: features[index].properties.time
    const [featureData, setFeatureData] = useState([]);   
    //  //  bboxData = [minLng, minLat, minDepth, maxLng, maxLat, maxDepth]
    const [bboxData, setBboxData] = useState([]);
    
    // calculating mapCenterPoint for Google Map
    const mapCenterPoint = useMemo(() => {
        const centerLng = bboxData[0] + (bboxData[3] = bboxData[0]) / 2;
        const centerLat = bboxData[1] + (bboxData[4] - bboxData[1]) / 2;
        console.log(centerLng, centerLat);
        return { lng: centerLng, lat: centerLat };
    }, [bboxData]);

    // Make a request for a user with a given ID
    async function getUser() {
        try {
            const response = await axios.get(API_URL);

            setTitle(response.data.metadata.title);
            setCount(response.data.metadata.count);
            setFeatureData(response.data.features);
            setBboxData(response.data.bbox);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <h1>{title}</h1>
            <p>{"Total " + count + " earthquakes recorded"}</p>

            <MapContainer
                featureData={featureData}
                mapCenterPoint={mapCenterPoint}
            />

            {/* <p>{JSON.stringify(featureData)}</p> */}
        </>
    )
}

export default App
