import React from 'react'
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import LinearProgress, {
    linearProgressClasses
} from '@mui/material/LinearProgress';
import { colors } from '../../../../constants'

const StyledPaper = styled(Paper)(({ }) => ({
    padding: 20,
    marginBottom: 20,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.darkBlue,
    color: colors.white
}));

const StyledLinearProgressBar = styled(LinearProgress, {
    props: { variant: "determinate" }
})({
    [`&.${linearProgressClasses.determinate} > .${linearProgressClasses.bar1Determinate}`]: { backgroundColor: colors.white },
    [`&.${linearProgressClasses.determinate}`]: { backgroundColor: 'rgba(255, 255, 255, 0.5)' }
});

const LiveCard = ({ migrationEvent }) => {
    return (
        <StyledPaper variant="elevation">
            <span>{`${migrationEvent.origin} ▶ ${migrationEvent.destination}`}</span>
            <span>{`${migrationEvent.numberOfPeople} ${migrationEvent.gender}`}</span>
            <span>{`Ages ${migrationEvent.age}`}</span>
            <span>{`Long. ${parseFloat(migrationEvent.coordinate.longitude).toFixed(2)}   Lat. ${parseFloat(migrationEvent.coordinate.latitude).toFixed(2)}`}</span>
            <span>{`Progress ${migrationEvent.progress}%`}</span>
            <StyledLinearProgressBar value={migrationEvent.progress}
                sx={{
                    "& .MuiLinearProgress-bar": {
                        transition: "none"
                    },
                    marginTop: 2
                }}
                variant="determinate" />
        </StyledPaper>
    )

}

export default LiveCard