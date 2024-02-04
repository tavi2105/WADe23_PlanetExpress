import React, { useState, useEffect, useMemo } from 'react'
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";

import { colors } from '../../../../constants';
import topojson from '../../../../assets/topo.json'

import SelectField from '../../components/SelectField';
import { Tooltip } from "react-tooltip";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useHistoryContext } from '../../../../context/historyContext';
import { mapMarkers } from './utils';
import LiveCard from './LiveCard';


const LiveTab = () => {

    const [historyState,] = useHistoryContext()
    const [highlightedCountries, setHighlightedCountries] = useState([])
    const [data, setData] = useState([])
    const [tooltipContent, setTooltipContent] = useState('')
    const [country, setCountry] = useState('None')
    const markerMapping = useMemo(() => { return mapMarkers(data, country) }, [data, country])

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            await fetchEventSource('https://enormous-poetic-ewe.ngrok-free.app/live/', {
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

    const handleCountryChange = (event) => {
        const {
            target: { value },
        } = event;
        setCountry(value);
    };
    return (
        <div >
            <span style={{ fontSize: 18 }}>Hover on marker to see details about ongoin migration event.</span>
            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', marginTop: 8 }}>
                <SelectField options={['None', ...historyState?.filterCountries]} label={"Country"} value={country} setValue={handleCountryChange} />
                <Tooltip id="my-tooltip" multiline={true}>{tooltipContent}</Tooltip>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', flexWrap: 'wrap', marginTop: 10, }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflowY: "scroll", paddingRight: 10, marginRight: 10, maxHeight: '100vh', width: '25vw' }}>
                            {
                                data.map(m => <LiveCard migrationEvent={m} onHover={setHighlightedCountries} />)
                            }
                        </div>
                    </div>
                    <ComposableMap
                        projectionConfig={{
                            rotate: [0, 0, 0],
                            scale: 100
                        }}
                        enableBackground={false}
                        width={500}
                        height={300}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)', width: '70vw', border: '1px solid', borderColor: colors.darkBlue, borderRadius: 10
                        }}
                    >
                        <Geographies geography={topojson} >
                            {({ geographies }) =>
                                geographies.map((geography, i) => {
                                    return (
                                        <Geography
                                            key={geography.rsmKey}
                                            geography={geography}
                                            fill={highlightedCountries?.findIndex((c) => c === geography.properties?.name) > -1 ? colors.turqoise : colors.darkBlue}
                                            stroke={highlightedCountries?.findIndex((c) => c === geography.properties?.name) > -1 ? colors.darkRed : colors.white}
                                            strokeWidth={0.3}
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

                        {markerMapping.length > 0 && markerMapping.map((m) => (
                            <Marker
                                coordinates={m.coordinates}
                                onMouseOver={() => {
                                    setTooltipContent(m.tooltipText);
                                }}
                                onMouseLeave={() => {
                                    setTooltipContent("");
                                }}
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={tooltipContent}
                                style={{ hover: { outline: "none" }, default: { outline: 'none' } }}
                            >
                                <circle r={2} fill={colors.white} stroke={m.color} strokeWidth={2} />
                            </Marker>
                        ))
                        }
                    </ComposableMap>
                </div>
            </div>
        </div >

    )
}

export default LiveTab