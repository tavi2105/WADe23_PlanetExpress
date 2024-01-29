import React, { useState } from 'react'
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";

import { colors } from '../../../../constants';
import topojson from '../../../../assets/topo.json'

import SelectField from '../SelectField';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Legend from './Legend';


const markers = [
    {
        name: "Romania",
        coordinates: [25.601198, 45.657974]
    },
];

const HistoryTab = () => {

    const [highlighted, setHighlighted] = useState({})
    const [country, setCountry] = useState({
        name: "Romania",
        coordinates: [25.601198, 45.657974]
    })

    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];

    const xLabels = [
        'Page A',
        'Page B',
        'Page C',
        'Page D',
        'Page E',
        'Page F',
        'Page G',
    ];

    console.log(highlighted)

    const handleClick = (geo) => {
        console.log(geo)
        setHighlighted(geo)

    };
    const handleCountryChange = (event) => {
        const {
            target: { value },
        } = event;
        setCountry(value);
    };
    console.log("dest", highlighted)
    return (
        <div >
            <span style={{ fontSize: 18 }}>{highlighted.properties?.name ? `Country: ${highlighted.properties?.name}` : 'Click on a country for details.'}</span>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

                <ComposableMap
                    projectionConfig={{
                        rotate: [0, 0, 0],
                        scale: 100
                    }}
                    enableBackground={false}
                    width={500}
                    height={300}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', width: '70vw', border: '1px solid', borderColor: colors.darkBlue, marginTop: 10, borderRadius: 10
                    }}
                >
                    <Geographies geography={topojson} >
                        {({ geographies }) =>
                            geographies.map((geography, i) => {
                                return (
                                    <Geography
                                        key={geography.rsmKey}
                                        geography={geography}
                                        fill={highlighted.properties?.name === geography.properties?.name ? colors.red : colors.darkBlue}
                                        stroke={colors.white}
                                        strokeWidth={0.2}
                                        onClick={() => handleClick(geography)}
                                        style={{
                                            hover: {
                                                fill: colors.red,
                                                stroke: colors.darkRed,
                                                strokeWidth: 0.75,
                                                outline: "none",
                                                transition: "all 250ms"
                                            },
                                            pressed: { outline: "none" },
                                            default: { outline: "none" },
                                        }}
                                    />
                                )
                            })
                        }
                    </Geographies>

                    {country && <Marker key={country.name} coordinates={country.coordinates}>
                        <circle r={2} fill={colors.red} stroke={colors.white} />
                    </Marker>}
                </ComposableMap>

                <div style={{ marginLeft: '2vw', marginTop: '2vw' }}>
                    <span style={{ display: 'block', fontSize: 20, fontWeight: 'bold', marginBottom: '2vw', color: colors.darkBlue }}>Filters</span>
                    <SelectField options={markers} label={"Country"} value={country} setValue={handleCountryChange} />
                    <SelectField options={markers} label={"Age of migrants"} value={country} setValue={handleCountryChange} />
                    <SelectField options={markers} label={"Sex of migrants"} value={country} setValue={handleCountryChange} />
                    <SelectField options={markers} label={"Year of migration"} value={country} setValue={handleCountryChange} />
                    <Legend />
                </div>


            </div>
            <span style={{ display: 'block', fontSize: 22, fontWeight: 'bold', marginTop: '2vw', color: colors.darkGray }}>Charts</span>
            <div style={{ marginTop: '2vw', paddingLeft: '2vw' }}>
                <span style={{ display: 'flex', fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>
                    Immigrants end emigrants number evolution from the selected year to present</span>
                <LineChart
                    width={800}
                    height={400}
                    series={[
                        { data: pData, label: 'pv', color: colors.darkGreen },
                        { data: uData, label: 'uv', color: colors.darkRed },
                    ]}
                    xAxis={[{ scaleType: 'point', data: xLabels }]}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '5vw', alignItems: 'center', justifyContent: 'space-between' }}>
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
}

export default HistoryTab