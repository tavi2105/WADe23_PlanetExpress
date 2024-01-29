
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { colors } from '../../../../constants'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        border: '1px solid',
        borderColor: colors.darkGray,
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
}));

const SelectField = (props) => {
    const { label, value, setValue, options } = props
    console.log("props", props)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '4vw', marginBottom: '2vw' }}>
            <span style={{ color: colors.darkBlue, fontSize: 16 }}>{label}</span>
            <Select
                value={value}
                onChange={setValue}
                sx={{ minWidth: '20em', alignSelf: 'flex-start' }}
                input={<BootstrapInput />}
                defaultValue={value}
            >
                {options.map((item) => (
                    <MenuItem
                        key={item}
                        value={item}
                    >
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default SelectField
