import React, { useState, useMemo } from 'react'
import { colors } from '../../constants'
import BootstrapInput from './components/Input';
import Button from '@mui/material/Button';
import axios from 'axios';
import Alert from '@mui/material/Alert';

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
    const [destCountry, setDestCountry] = useState('')
    const [originCountry, setOriginCountry] = useState('')
    const [migrantsNumber, setMigrantsNumber] = useState('')
    const [year, setYear] = useState('')
    const [age, setAge] = useState('')
    const [sex, setSex] = useState('')
    const [showAlert, setShowAlert] = useState('')
    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("Geolocation not supported");
        }
    }, []);


    const success = () => {
        axios.get("http://ip-api.com/json")
            .then(response => {
                setDestCountry(response.data?.country);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const error = () => {
        console.log("Unable to retrieve your location");
    }

    const isFormValid = useMemo(() => !!destCountry && !!originCountry && !!migrantsNumber && !!year && !!age && !!sex, [destCountry, originCountry, migrantsNumber, year, age, sex])

    const onClick = () => {
        if (isFormValid) {
            setShowAlert('success')
        }
        else {
            setShowAlert('warning')
        }
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
                <dev style={{ marginLeft: '1vw', display: 'flex', flexDirection: 'column' }}>
                    <span >Add here data about a migration event you know. Note that the destination country will be automatically filled with your actual location.</span>
                </dev>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24
                    }}>
                        < span style={{ color: colors.darkBlue }}> Destination country*:</span>
                        <BootstrapInput value={destCountry} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Origin country*:</span>
                        <BootstrapInput value={destCountry} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Number of migrants*:</span>
                        <BootstrapInput value={destCountry} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Year of migration*:</span>
                        <BootstrapInput value={destCountry} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Sex of migrants*:</span>
                        <BootstrapInput value={destCountry} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '30vw', marginBottom: 24 }}>
                        <span style={{ color: colors.darkBlue }}>Age of migrants:</span>
                        <BootstrapInput value={destCountry} />
                    </div>


                    <Button variant="contained"
                        sx={{
                            width: 100, minWidth: '20vw', backgroundColor: colors.darkBlue, color: colors.white, "&:hover": {
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