import React, { useEffect, useState } from 'react'
import { colors } from '../../constants';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import HistoryTab from './tabs/HistoryTab';
import LiveTab from './tabs/LiveTab'
import { useLocation } from 'react-router-dom';
import { styled } from "@mui/material/styles";
import { useHistoryContext } from '../../context/historyContext';
import axios from 'axios';



const StyledTab = styled(Tab)({
    "&.Mui-selected": {
        color: colors.darkBlue,
        backgroundColor: colors.oldBackground,
    },
    "&.Mui-disabled": {
        color: colors.mediumGray,
    },
    color: colors.oldBackground,
    fontWeight: 'bold'
});


const MigrationMap = () => {
    const { state } = useLocation()
    const { category } = state;
    const [value, setValue] = React.useState('1');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [historyState, setHistoryState] = useHistoryContext()
    // console.log(historyState)

    const getMigrations = (country, age, gender, year) => {
        setLoading(true)
        axios.get(`https://enormous-poetic-ewe.ngrok-free.app/migrations/?country=${country}&age=${age}&gender=${gender}&year=${year}`,
            {
                headers: {
                    'ngrok-skip-browser-warning': '1',
                },
            })
            .then(response => {
                setLoading(false)
                console.log("response", response)
                setHistoryState({ ...historyState, migrations: response.data })
            })
            .catch(error => {
                setLoading(false)
                setError(true)
                console.error(error);
            });
    }

    const getInitialHistoryData = () => {
        const urls = [
            'https://enormous-poetic-ewe.ngrok-free.app/migrations/',
            'https://enormous-poetic-ewe.ngrok-free.app/migrations/filters/'
        ]
        const requests = urls.map((url) => axios.get(url, {
            headers: {
                'ngrok-skip-browser-warning': '1',
            },
        }));
        setLoading(true)

        axios.all(requests).then((responses) => {
            console.log(responses)
            const state = {
                migrations: responses[0].data,
                filterCountries: responses[1].data.country,
                filterSex: responses[1].data.gender,
                filterAge: responses[1].data.age,
                filterYear: responses[1].data.year
            }
            setHistoryState(state)
            setLoading(false)
        })
            .catch(error => {
                setLoading(false)
                setError(true)
                console.error(error);
            });
    }

    useEffect(() => {
        getInitialHistoryData()
    }, []);

    return (
        <body style={{
            backgroundPosition: '100% 100%',
            width: '100vw',
            minHeight: '100vh',
            backgroundColor: colors.oldBackground,
            overflowY: 'scroll',

        }}>
            <div style={{ paddingBottom: '10vh' }}>
                <TabContext value={value}>
                    <Box sx={{ backgroundColor: colors.darkGray, paddingTop: '1em', "& .MuiTabs-indicator": { display: "none" } }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <StyledTab label="History" value="1" />

                            <StyledTab label="Live" value="2" disabled={loading} />

                        </TabList>
                    </Box>
                    <h2 style={{ marginLeft: '1vw' }}>{`Migration map of ${category}`}</h2>
                    <TabPanel value="1" >
                        <HistoryTab applyFilters={getMigrations} loading={loading} error={error} />
                    </TabPanel>
                    <TabPanel value="2">
                        <LiveTab />
                    </TabPanel>
                </TabContext>
            </div >
        </body >

    )
}


export default MigrationMap;