import React from 'react'
import { colors } from '../../constants'

const EmptyScreen = () => {
    return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div >
                <span style={{ fontSize: 40, color: colors.darkBlue }}>Oups! Something went wrong. PLease try again later!</span>
            </div >

        </div>
    )
}

export default EmptyScreen