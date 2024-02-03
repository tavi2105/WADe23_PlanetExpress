import { colors } from "../../../../constants"

export const mapMarkers = (migrations, countryName) => {
    if (migrations.length === 0) {
        console.log("cee")
        return []
    }
    let markerMapping;
    if (countryName === 'None') {
        markerMapping = migrations.map(m =>
        (
            {
                tooltipText: `From: ${m.origin}\nTo: ${m.destination}\nProgress: ${m.progress}%\nStart time: ${m.startTime}`,
                coordinates: [m.coordinate.longitude, m.coordinate.latitude],
                color: colors.violet
            }
        )
        )
    }
    else {
        let filteredMigrations = migrations.filter(m => m.destination === countryName || m.origin === countryName)
        markerMapping = filteredMigrations.map(m =>
        (
            {
                tooltipText: `From: ${m.origin}\nTo: ${m.destination}\nProgress: ${m.progress}%\nStart time: ${m.startTime}`,
                coordinates: [m.coordinate.longitude, m.coordinate.latitude],
                color: countryName === m.destination ? colors.green : colors.red
            }
        )

        )
    }
    return markerMapping
}