import React, { useEffect, useState } from 'react'
import { colors } from '../../constants';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import HistoryTab from './components/HistoryTab';
import LiveTab from './components/LiveTab'
import { useLocation } from 'react-router-dom';
import { styled } from "@mui/material/styles";
import { useHistoryContext } from '../../context/historyContext';
import axios from 'axios';



const StyledTab = styled(Tab)({
    "&.Mui-selected": {
        color: colors.darkBlue,
        backgroundColor: colors.oldBackground,
    },
    color: colors.oldBackground,
    fontWeight: 'bold'
});


const MigrationMap = () => {
    const { state } = useLocation()
    const { category } = state;
    const [value, setValue] = React.useState('1');
    const [loading, setLoading] = useState(false)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [historyState, setHistoryState] = useHistoryContext()
    console.log(historyState)

    const getMigrations = () => {
        setLoading(true)
        axios.get('https://enormous-poetic-ewe.ngrok-free.app/migrations/?country=Romania',
            {
                // mode: 'no-cors',
                headers: {
                    'ngrok-skip-browser-warning': '1',
                    // 'Access-Control-Allow-Origin': '*',
                    // 'Content-Type': 'application/json',
                },
                // withCredentials: true,
                // credentials: 'same-origin',
            })
            .then(response => {
                setLoading(false)
                console.log("response", response)
                setHistoryState({ ...historyState, migrations: response.data })
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() =>
        getMigrations(), []);


    console.log("din screen", loading)
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

                            <StyledTab label="Live" value="2" />

                        </TabList>
                    </Box>
                    <h2 style={{ marginLeft: '1vw' }}>{`Migration map of ${category}`}</h2>
                    <TabPanel value="1" >
                        <HistoryTab loading={loading} applyFilters={getMigrations} />
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