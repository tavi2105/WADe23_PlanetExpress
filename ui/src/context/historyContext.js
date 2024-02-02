import React, { useState, useContext } from 'react'
const HistoryContext = React.createContext({})
const HistoryProvider = ({ children }) => {

    const [historyState, setHistoryState] = useState({
        migrations: [],
        filterCountries: [],
        filterSex: [],
        filterAge: [],
        filterYear: []
    });

    return (
        <HistoryContext.Provider value={[historyState, setHistoryState]}>
            {children}
        </HistoryContext.Provider>
    )
};

export default HistoryContext;


export function useHistoryContext() {
    return useContext(HistoryContext)
}

export { HistoryProvider }