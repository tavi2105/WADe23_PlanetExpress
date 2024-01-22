import React from 'react'
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { colors } from '../../constants';
import { useNavigate } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import LiveTab from './components/LiveTab';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const MigrationMap = () => {

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div
                style={{
                    backgroundColor: colors.white,
                    minWidth: '100vw',
                    height: '100em'
                }}
            >
                <TabContext value={value}>
                    <Box sx={{ backgroundColor: colors.darkGray, paddingTop: '1em' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Live" value="1" />
                            <Tab label="History" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1" >
                        <LiveTab />
                    </TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                </TabContext>
            </div >
        </ThemeProvider >
    )
}


export default MigrationMap;