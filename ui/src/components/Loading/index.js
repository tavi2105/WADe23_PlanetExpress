import React from 'react'
import { colors } from '../../constants';

import ReactLoading from "react-loading";


const Loading = () => {

    return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div >
                <ReactLoading type="spinningBubbles" color={colors.darkBlue} height={100} width={100} />
            </div >

        </div>

    )
}


export default Loading;