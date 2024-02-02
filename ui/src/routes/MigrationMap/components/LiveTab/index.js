import React, { useState, useEffect } from 'react'
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";

import { colors } from '../../../../constants';
import topojson from '../../../../assets/topo.json'

import SelectField from '../SelectField';
import { PieChart } from '@mui/x-charts/PieChart';
import { Tooltip } from "react-tooltip";
import { fetchEventSource } from "@microsoft/fetch-event-source";


const LiveTab = () => {
    const [data, setData] = useState({})
    const [tooltipContent, setTooltipContent] = useState('')
    const [country, setCountry] = useState({
        name: "Romania",
        coordinates: [25.601198, 45.657974]
    })

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            await fetchEventSource('https://enormous-poetic-ewe.ngrok-free.app/live', {
                method: "GET",
                headers: {
                    Accept: "text/event-stream",
                    'ngrok-skip-browser-warning': '1',
                },
                signal: controller.signal,
                onopen(res) {
                    if (res.ok && res.status === 200) {
                        console.log("Connection made ", res);
                    } else if (
                        res.status >= 400 &&
                        res.status < 500 &&
                        res.status !== 429
                    ) {
                        console.log("Client side error ", res);
                    }
                },
                onmessage(event) {
                    const parsedData = JSON.parse(event.data);
                    setData(parsedData);
                    console.log(parsedData)
                },
                onclose() {
                    controller.abort();
                    console.log("Connection closed by the server");
                },
                onerror(err) {
                    console.log("There was an error from server", err);
                },
            });
        };
        fetchData();
        return () => controller.abort();
    }, []);
    // console.log(tooltipContent)

    const handleCountryChange = (event) => {
        const {
            target: { value },
        } = event;
        setCountry(value);
    };
    return (
        <div >
            <span style={{ fontSize: 18 }}>Hover on marker to see details about ongoin migration event</span>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <Tooltip id="my-tooltip">{tooltipContent}</Tooltip>
                <ComposableMap
                    projectionConfig={{
                        rotate: [0, 0, 0],
                        scale: 100
                    }}
                    enableBackground={false}
                    width={500}
                    height={300}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', width: '90vw', border: '1px solid', borderColor: colors.darkBlue, marginTop: 10, borderRadius: 10
                    }}
                >
                    <Geographies geography={topojson} >
                        {({ geographies }) =>
                            geographies.map((geography, i) => {
                                return (
                                    <Geography
                                        key={geography.rsmKey}
                                        geography={geography}
                                        fill={colors.darkBlue}
                                        stroke={colors.white}
                                        strokeWidth={0.2}
                                        style={{
                                            hover: { outline: "none" },
                                            pressed: { outline: "none" },
                                            default: { outline: "none" },
                                        }}
                                    />
                                )
                            })
                        }
                    </Geographies>

                    {data && data.length > 0 && data.map((m) => (
                        <Marker
                            // key={}
                            coordinates={[m.coordinate.longitude, m.coordinate.latitude]}
                            onMouseOver={() => {
                                setTooltipContent(m.origin + ' - ' + m.destination);
                            }}
                            onMouseLeave={() => {
                                setTooltipContent("");
                            }}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={tooltipContent}
                            style={{ hover: { outline: "none" }, default: { outline: 'none' } }}
                        >
                            <circle r={2} fill={colors.white} stroke={colors.green} strokeWidth={2} />
                            {/* <rect width={4} height={4} fill={colors.white} stroke={colors.red} strokeWidth={2} /> */}
                        </Marker>
                    ))
                    }
                </ComposableMap>
                {/* <div style={{ marginLeft: '2vw', marginTop: '2vw' }}>
                    <span style={{ display: 'block', fontSize: 20, fontWeight: 'bold', marginBottom: '2vw', color: colors.darkBlue }}>Filters</span>
                    <SelectField options={markers} label={"Country"} value={country} setValue={handleCountryChange} />
                    <SelectField options={markers} label={"Age of migrants"} value={country} setValue={handleCountryChange} />
                    <SelectField options={markers} label={"Sex of migrants"} value={country} setValue={handleCountryChange} />
                </div> */}
            </div>
            <span style={{ display: 'block', fontSize: 22, fontWeight: 'bold', marginTop: '2vw', color: colors.darkGray }}>Charts</span>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '2vw', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: 'series A' },
                                    { id: 1, value: 15, label: 'series B' },
                                    { id: 2, value: 20, label: 'series C' },
                                ],
                            },
                        ]}
                        width={500}
                        height={300}
                    />
                    <span style={{ display: 'flex', fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Emigrants number from each country</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: 'series A' },
                                    { id: 1, value: 15, label: 'series B' },
                                    { id: 2, value: 20, label: 'series C' },
                                ],
                            },
                        ]}
                        width={500}
                        height={300}
                        title='Number of migrants over the years (selected year to present year'
                    />
                    <span style={{ display: 'flex', fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Immigrants number from each country</span>
                </div>
            </div>

        </div >

    )
    // return null
}

export default LiveTab