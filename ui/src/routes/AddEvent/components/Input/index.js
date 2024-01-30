import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { colors } from '../../../../constants'


const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        backgroundColor: colors.white,
        border: '1px solid',
        borderRadius: 4,
        borderColor: colors.darkBlue,
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
}));


export default BootstrapInput