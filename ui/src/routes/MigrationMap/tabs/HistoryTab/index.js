import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";
import Button from '@mui/material/Button';

import { colors } from '../../../../constants';
import topojson from '../../../../assets/topo.json'

import SelectField from '../../components/SelectField';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Legend from './Legend';

import { useHistoryContext } from '../../../../context/historyContext';
import { mapCountries, getCoordinates, getBarChartData, getPieChartData } from './utils';
import ErrorScreen from '../../../../components/ErrorScreen'
import Loading from '../../../../components/Loading';
import MigrationEventsTable from './MigrationEventsTable';


const HistoryTab = ({ applyFilters, loading, error }) => {

    const [historyState,] = useHistoryContext()
    const [countryFilter, setCountryFilter] = useState('Romania')
    const [ageFilter, setAgeFilter] = useState('All ages')
    const [sexFilter, setSexFilter] = useState('Men and women')
    const [yearFilter, setYearFilter] = useState('All years')
    const [highlighted, setHighlighted] = useState({})

    const handleClick = (geo) => {
        if (geo === highlighted) {
            setHighlighted({})
        }
        else {
            setHighlighted(geo)
        }
    };

    const countryMapping = useMemo(() => mapCountries(historyState.migrations), [historyState])

    const mapColor = useCallback((countryName) => {
        if (highlighted.properties?.name === countryName) {
            return colors.darkBlue
        }
        if (countryName === countryFilter) {
            return colors.turqoise
        }
        if (countryMapping.origin.countries.includes(countryName)) {
            return countryMapping.origin.color
        }
        if (countryMapping.destination.countries.includes(countryName)) {
            return countryMapping.destination.color
        }
        if (countryMapping.originAndDestination.countries.includes(countryName)) {
            return countryMapping.originAndDestination.color
        }
        return colors.gray
    }, [historyState, highlighted, setHighlighted])

    const coordinates = useMemo(() => historyState.migrations.length > 0 && getCoordinates(historyState.migrations, countryFilter), [historyState])

    const { countryLabels, immigrantsSeries, emigrantsSeries } = useMemo(() => historyState.migrations.length > 0 && getBarChartData(historyState.migrations, countryFilter), [historyState])

    const { immigrantsPie, emigrantsPie } = useMemo(() => historyState.migrations.length > 0 && getPieChartData(historyState.migrations, countryFilter), [historyState])

    const handleCountryChange = (event) => {
        const {
            target: { value },
        } = event;
        setCountryFilter(value);
    };
    const handleAgeChange = (event) => {
        const {
            target: { value },
        } = event;
        setAgeFilter(value);
    };
    const handleSexChange = (event) => {
        const {
            target: { value },
        } = event;
        setSexFilter(value);
    };
    const handleYearChange = (event) => {
        const {
            target: { value },
        } = event;
        setYearFilter(value);
    };
    const renderTable = useCallback(() => (
        <MigrationEventsTable migrationEvents={!!highlighted.properties ? historyState?.migrations.filter(m => m.destName.value === highlighted.properties?.name || m.fromName.value === highlighted.properties?.name) : historyState?.migrations} />
    ), [highlighted, historyState])

    if (loading) {
        return (
            <Loading />
        )
    }
    if (error) {
        return (
            <ErrorScreen />
        )
    }

    return (
        <div >
            <span style={{ fontSize: 18 }}>{highlighted.properties?.name ? `Country: ${highlighted.properties?.name}` : 'Click on a country to filter table.'}</span>
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
                                        fill={mapColor(geography.properties?.name)}
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

                    {historyState.migrations.length > 0 && <Marker key={countryFilter} coordinates={coordinates}>
                        <circle r={2} fill={colors.red} stroke={colors.white} />
                    </Marker>}
                </ComposableMap>

                <div style={{ marginLeft: '2vw', marginTop: '2vw' }}>
                    <span style={{ display: 'block', fontSize: 20, fontWeight: 'bold', marginBottom: '2vw', color: colors.darkBlue }}>Filters</span>
                    <SelectField options={historyState?.filterCountries} label={"Country"} value={countryFilter} setValue={handleCountryChange} />
                    <SelectField options={historyState?.filterAge} label={"Age of migrants"} value={ageFilter} setValue={handleAgeChange} />
                    <SelectField options={historyState?.filterSex} label={"Sex of migrants"} value={sexFilter} setValue={handleSexChange} />
                    <SelectField options={historyState?.filterYear} label={"Year of migration"} value={yearFilter} setValue={handleYearChange} />
                    <Button variant="contained"
                        sx={{
                            width: '20vw', backgroundColor: colors.darkBlue, color: colors.white, "&:hover": {
                                backgroundColor: colors.darkGray
                            }
                        }}
                        onClick={() => applyFilters(countryFilter, ageFilter, sexFilter, yearFilter)}
                    >
                        Apply filters
                    </Button>
                    <Legend />
                </div>


            </div>
            {renderTable()}
            {
                historyState.migrations.length > 0 && (
                    <>
                        <span style={{ display: 'block', fontSize: 22, fontWeight: 'bold', marginTop: '2vw', color: colors.darkGray }}>Charts</span>
                        <div style={{ marginTop: '2vw', paddingLeft: '2vw' }}>
                            <span style={{ display: 'flex', fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>
                                {`Immigrants end emigrants number on top 10 countries by number of individuals (for ${countryFilter} with selected filters)`}</span>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: countryLabels }]}
                                series={[{ data: immigrantsSeries, color: colors.darkGreen, label: "number of immigrants" }, { data: emigrantsSeries, color: colors.darkRed, label: "number of emigrants" }]}
                                sx={{ padding: 1 }}
                                height={500}
                            />
                        </div>

                        {immigrantsPie.length > 1 &&
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '98%', alignContent: 'flex-start', marginTop: '2vw', paddingLeft: '2vw' }}>
                                <span style={{ display: 'flex', fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>Emigrants number to each country</span>
                                <PieChart
                                    series={[
                                        {
                                            data: immigrantsPie
                                        },
                                    ]}
                                    height={300}
                                    slotProps={{
                                        legend: {
                                            direction: 'column',
                                            position: { vertical: 'top', horizontal: 'left' },
                                            padding: 0,
                                        },

                                    }}

                                />
                            </div>
                        }
                        {emigrantsPie.length > 1 &&
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '98%', alignContent: 'flex-start', marginTop: '2vw', paddingLeft: '2vw' }}>
                                <span style={{ display: 'flex', fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>Immigrants number from each country</span>
                                <PieChart
                                    series={[
                                        {
                                            data: emigrantsPie
                                        },
                                    ]}

                                    height={300}
                                    slotProps={{
                                        legend: {
                                            direction: 'column',
                                            position: { vertical: 'top', horizontal: 'left' },
                                            padding: 0,
                                        },

                                    }}
                                />

                            </div>
                        }

                    </>
                )
            }



        </div >

    )
}

export default HistoryTab