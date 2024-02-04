import React, { useState, useMemo } from 'react'
import { colors } from '../../constants'
import BootstrapInput from './components/Input';
import Button from '@mui/material/Button';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useHistoryContext } from '../../context/historyContext';
import Loading from '../../components/Loading';

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

const alertMapping = {
    "success": {
        message: "Success!",
    },
    "error": {
        message: "Something went wrong."
    },
    "warning": {
        message: "Please complete all required fields (marked with *)."
    }
}

const AddEvent = () => {

    const [historyState,] = useHistoryContext()
    const [destCountry, setDestCountry] = useState('')
    const [originCountry, setOriginCountry] = useState('')
    const [migrantsNumber, setMigrantsNumber] = useState('')
    const [year, setYear] = useState('')
    const [age, setAge] = useState('Unknown age')
    const [sex, setSex] = useState('Men and women')
    const [showAlert, setShowAlert] = useState('')
    const [loading, setLoading] = useState(false)

    const handleAgeChange = (event) => {
        const {
            target: { value },
        } = event;
        setAge(value);
    };
    const handleSexChange = (event) => {
        const {
            target: { value },
        } = event;
        setSex(value);
    };
    const handleDestChange = (event) => {
        const {
            target: { value },
        } = event;
        setDestCountry(value);
    };
    const handleOriginChange = (event) => {
        const {
            target: { value },
        } = event;
        setOriginCountry(value);
    };
    const handleYearChange = (event) => {
        const {
            target: { value },
        } = event;
        setYear(value);
    };
    const handleNumberChange = (event) => {
        const {
            target: { value },
        } = event;
        setMigrantsNumber(value);
    };

    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("Geolocation not supported");
        }
    }, []);


    const success = () => {
        axios.get("https://ipapi.co/json/")
            .then(response => {
                setDestCountry(response.data?.country_name);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const error = () => {
        console.log("Unable to retrieve your location");
    }

    const isFormValid = useMemo(() => !!destCountry && !!originCountry && !!migrantsNumber && !!year, [destCountry, originCountry, migrantsNumber, year])

    const addMigration = () => {
        axios.post(`https://enormous-poetic-ewe.ngrok-free.app/migrations/add/`,
            {
                destination: destCountry,
                origin: originCountry,
                age: age,
                gender: sex,
                year: year,
                value: migrantsNumber
            },
            {
                headers: {
                    'ngrok-skip-browser-warning': '1',
                },
            })
            .then(res => {
                setLoading(false)
                if (res.status === 200) {
                    setShowAlert('success')
                }
            })
            .catch(error => {
                setLoading(false)
                setShowAlert('error')
                console.error(error);
            });
    }

    const onClick = () => {
        if (isFormValid) {
            addMigration()
        }
        else {
            setShowAlert('warning')
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <body style={{
            backgroundPosition: '100% 100%',
            width: '100vw',
            minHeight: '100vh',
            backgroundColor: colors.oldBackground,
            overflowY: 'scroll',

        }}>
            <div style={{ paddingBottom: '10vh' }}>
                {showAlert && <Alert variant='filled' severity={showAlert} onClose={() => setShowAlert(false)}>
                    {alertMapping[showAlert].message}
                </Alert>}
                <h2 style={{ marginLeft: '1vw' }}>Add a new migration event</h2>
                <div style={{ marginLeft: '1vw', display: 'flex', flexDirection: 'column' }}>
                    <span >Add here data about a migration event you know. Note that the destination country will be automatically filled with your actual location. You can change it if needed.</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 100, flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24
                    }}>
                        < span style={{ color: colors.darkBlue }}> Destination country*:</span>
                        <BootstrapInput value={destCountry} onChange={handleDestChange} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Origin country*:</span>
                        <BootstrapInput value={originCountry} onChange={handleOriginChange} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Number of migrants*:</span>
                        <BootstrapInput value={migrantsNumber} onChange={handleNumberChange} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Year of migration*:</span>
                        <BootstrapInput value={year} onChange={handleYearChange} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Sex of migrants:</span>
                        <Select
                            value={sex}
                            onChange={handleSexChange}
                            sx={{ minWidth: '30vw' }}
                            MenuProps={MenuProps}
                            input={<BootstrapInput />}
                        >
                            {historyState?.filterSex.map((item) => (
                                <MenuItem
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Age of migrants:</span>
                        <Select
                            value={age}
                            onChange={handleAgeChange}
                            sx={{ minWidth: '30vw' }}
                            MenuProps={MenuProps}
                            input={<BootstrapInput />}
                        >
                            {historyState?.filterAge.map((item) => (
                                <MenuItem
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div style={{ justifyContent: 'center', display: 'flex', marginTop: 40 }}>
                    <Button variant="contained"
                        sx={{
                            width: 200, minWidth: '30vw', backgroundColor: colors.darkBlue, color: colors.white, "&:hover": {
                                backgroundColor: colors.darkGray
                            }
                        }}
                        onClick={onClick}
                    >
                        Add event
                    </Button>
                </div>
            </div >
        </body >
    )
}

export default AddEvent