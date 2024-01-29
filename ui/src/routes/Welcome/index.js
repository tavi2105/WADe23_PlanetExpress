import React, { useState } from 'react';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import background from '../../assets/images/migration.jpg'
import MenuItem from '@mui/material/MenuItem';
import { colors } from '../../constants';
import BootstrapInput from './components/SelectInput';
import { useNavigate } from 'react-router-dom';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const species = ['Birds', 'Humans']

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Welcome = () => {
    const navigate = useNavigate();
    const [migrationCategory, setMigrationCategory] = useState('Humans')
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setMigrationCategory(value);
    };

    const handleMapButtonClick = () => { navigate('/migration', { state: { category: migrationCategory } }) }

    return (
        <ThemeProvider theme={darkTheme}>
            <body
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    minWidth: '100vw',
                    minHeight: '100vh',
                    position: 'fixed'
                }}

            >
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 20, display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{ color: colors.white, fontSize: 50 }}>Migration Reporting Tool</h1>
                    <span style={{ color: colors.white, fontSize: 20 }}>Please select the migration category:</span>
                    <Select
                        value={migrationCategory}
                        onChange={handleChange}
                        sx={{ minWidth: '20em', marginTop: '1em' }}
                        MenuProps={MenuProps}
                        input={<BootstrapInput />}
                    >
                        <MenuItem disabled value="">
                            <em>Species</em>
                        </MenuItem>
                        {species.map((item) => (
                            <MenuItem
                                key={item}
                                value={item}
                            >
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained"
                        sx={{
                            width: 200, minWidth: '40em', marginTop: '3em', backgroundColor: colors.darkBlue, color: colors.white, "&:hover": {
                                backgroundColor: colors.darkGray
                            }
                        }}
                        onClick={handleMapButtonClick}
                    >
                        View migration map
                    </Button>
                    <Button variant="outlined" sx={{
                        width: 200, minWidth: '40em', marginTop: '3em', color: colors.white, borderColor: colors.white, "&:hover": {
                            borderColor: colors.white
                        }
                    }}>Add migration event</Button>
                </div>

            </body >

        </ThemeProvider >
    );
}

export default Welcome