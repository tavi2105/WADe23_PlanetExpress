import React from 'react'
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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                            <StyledTab label="Live" value="1" />
                            <StyledTab label="History" value="2" />
                        </TabList>
                    </Box>
                    <h2 style={{ marginLeft: '1vw' }}>{`Migration map of ${category}`}</h2>
                    <TabPanel value="1" >
                        <LiveTab />
                    </TabPanel>
                    <TabPanel value="2">  <HistoryTab /></TabPanel>
                </TabContext>
            </div >
        </body>

    )
}


export default MigrationMap;