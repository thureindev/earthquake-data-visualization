import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import './assets/styles//App.css';
import MapContainer from './MapContainer';

const API_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

function App() {
    // api documentation for bbox data https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
    //  //  metadata.title = string
    const [title, setTitle] = useState("Earthquake Data");
    //  //  total count of features // metadata.count = number
    const [count, setCount] = useState(0);
    //  //  features
    //  //  coordinates: features[index].geometry.coordinates
    //  //  location: features[index].properties.place
    //  //  time: features[index].properties.time
    const [featureData, setFeatureData] = useState([]);
    //  //  bboxData = [minLng, minLat, minDepth, maxLng, maxLat, maxDepth]
    const [bboxData, setBboxData] = useState([]);

    // Toggle for showing list of features with powerful magnitute 
    const [showPowerfulMagFeatures, setShowPowerfulMagFeatures] = useState(false);
    const POWERFUL_MAG = 6;

    // calculating mapCenterPoint for Google Map View
    const mapCenterPoint = useMemo(() => {
        if (bboxData.length > 0) {
            const centerLng = bboxData[0] + (bboxData[3] = bboxData[0]) / 2;
            const centerLat = bboxData[1] + (bboxData[4] - bboxData[1]) / 2;
            console.log(centerLng, centerLat);
            return { lng: centerLng, lat: centerLat };
        }
        return { lng: 1, lat: 1 }
    }, [bboxData]);

    // funcion to request for a api data
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
    // call api when this component loads
    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <header>
                <h1>{title}</h1>

                <section>
                    <h2 className='summary'>Summary</h2>
                    
                    {count > 0
                        ?
                        <>
                            <p className='recorded-count'>{"Total (" + count + ") earthquakes recorded"}</p>

                            {/* This info p tag is used as toggle button to hide and show details of powerful magnitude features*/}
                            <p
                                className={`recorded-count-powerful-mag ${showPowerfulMagFeatures ? "active" : ""}`}
                                onClick={() => count > 0 ? setShowPowerfulMagFeatures(!showPowerfulMagFeatures): setShowPowerfulMagFeatures(false)}
                            >
                                {`Total (${
                                    // count for earthquake data that are greater than 4.5 magnitude
                                    featureData.filter((feature) => feature.properties.mag > POWERFUL_MAG).length
                                    }) earthquakes that are greater than 6 magnitude`
                                }
                            </p>

                            {/* show only when there are powerful magnitutes */}
                            {showPowerfulMagFeatures &&
                                <ol className='list-powerful-mag'>
                                    {
                                        // count for earthquake data that are greater than 4.5 magnitude
                                        featureData.map((feature, index) => {
                                            if (feature.properties.mag > 6) {
                                                return (
                                                    <li key={index} className='powerful-mag-data'>
                                                        {feature.properties.place + " - " + feature.properties.mag + " - " + new Date(feature.properties.time).toLocaleString()}
                                                    </li>
                                                )
                                            }
                                        })}
                                </ol>
                            }
                        </>
                        :
                        <p className='loading-message'>{"Loading earthquake data... Please wait."}</p>
                    }
                </section>
            </header>

            <MapContainer
                featureData={featureData}
                mapCenterPoint={mapCenterPoint}
            />

            {/* <p>{JSON.stringify(featureData)}</p> */}
        </>
    )
}

export default App
