import React from 'react'
import { colors } from '../../../../constants';

const Legend = () => {
    return (
        <div style={{ padding: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                <div style={{ backgroundColor: colors.violet, height: 20, width: 20, borderRadius: 10, marginRight: 10 }} />
                <span style={{ fontSize: 18 }}>Destination and provenience country</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                <div style={{ backgroundColor: colors.darkGreen, height: 20, width: 20, borderRadius: 10, marginRight: 10 }} />
                <span style={{ fontSize: 18 }}>Provenience country</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                <div style={{ backgroundColor: colors.darkRed, height: 20, width: 20, borderRadius: 10, marginRight: 10 }} />
                <span style={{ fontSize: 18 }}>Destination country</span>
            </div>
        </div>
    )
}

export default Legend