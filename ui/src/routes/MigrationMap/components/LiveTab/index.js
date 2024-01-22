import React from 'react'
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker
} from "react-simple-maps";

import { colors } from '../../../../constants';
import topojson from '../../../../assets/topo.json'


const markers = [
    {
        markerOffset: -15,
        name: "Buenos Aires",
        coordinates: [-58.3816, -34.6037]
    },
    { markerOffset: 0, name: "La Paz", coordinates: [-68.1193, -16.4897] },
    { markerOffset: 0, name: "Brasilia", coordinates: [-47.8825, -15.7942] },
    { markerOffset: 0, name: "Santiago", coordinates: [-70.6693, -33.4489] },
    { markerOffset: 0, name: "Bogota", coordinates: [-74.0721, 4.711] },
    { markerOffset: 0, name: "Quito", coordinates: [-78.4678, -0.1807] },
    { markerOffset: 0, name: "Georgetown", coordinates: [-58.1551, 6.8013] },
    { markerOffset: 0, name: "Asuncion", coordinates: [-57.5759, -25.2637] },
    { markerOffset: 0, name: "Paramaribo", coordinates: [-55.2038, 5.852] },
    { markerOffset: 0, name: "Montevideo", coordinates: [-56.1645, -34.9011] },
    { markerOffset: 0, name: "Caracas", coordinates: [-66.9036, 10.4806] },
    { markerOffset: 0, name: "Lima", coordinates: [-77.0428, -12.0464] }
];



const LiveTab = () => {
    const [hovered, setHovered] = React.useState(false)
    const [highlighted, setHighlighted] = React.useState({})

    console.log(highlighted)

    const handleMove = (geo) => {
        console.log(geo)
        if (hovered) return;
        setHighlighted(geo)
        setHovered(true)
    };
    const handleLeave = () => {
        setHighlighted("")
        setHovered(false)
    };
    return (
        <div >
            <h3>{`Country: ${highlighted.properties?.name}`}</h3>
            <div>

                <ComposableMap
                    projectionConfig={{
                        rotate: [0, 0, 0],
                        scale: 100
                    }}
                    enableBackground={false}
                    width={500}
                    height={300}
                    style={{
                        backgroundColor: colors.turqoise, width: '60vw', border: '1px solid', borderColor: colors.darkGray
                    }}
                >
                    <Geographies geography={topojson} >
                        {({ geographies }) =>
                            geographies.map((geography, i) => {
                                return (
                                    <Geography
                                        key={geography.rsmKey}
                                        geography={geography}
                                        fill={colors.peach}
                                        stroke={colors.darkGray}
                                        strokeWidth={0.5}
                                        onMouseMove={() => handleMove(geography)}
                                        onMouseLeave={handleLeave}
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
                    {markers.map(({ name, coordinates, markerOffset }) => (
                        <Marker key={name} coordinates={coordinates}>
                            <circle r={2} fill={colors.red} stroke={colors.black} />
                            <text
                                textAnchor="middle"
                                y={markerOffset}
                                style={{ fontSize: 6, fontWeight: 'bold', fill: colors.black }}
                            >
                                {name}
                            </text>
                        </Marker>
                    ))}
                </ComposableMap>
            </div>
        </div>

    )
}

export default LiveTab