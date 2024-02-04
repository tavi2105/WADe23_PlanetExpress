import { colors } from "../../../../constants"


export const mapCountries = (migrationEvents) => {
    let origin = []
    let destination = []
    let originAndDestination = []

    migrationEvents?.forEach(element => {
        const { destName, fromName } = element;
        if (!destination.includes(destName.value)) {
            destination = [...destination, destName.value]
        }
        if (!origin.includes(fromName.value)) {
            origin = [...origin, fromName.value]
        }

    });

    originAndDestination = origin.filter(function (element) {
        return destination.indexOf(element) !== -1;
    });

    origin = origin.filter(function (element) {
        return originAndDestination.indexOf(element) === -1;
    });

    destination = destination.filter(function (element) {
        return originAndDestination.indexOf(element) === -1;
    });

    return {
        origin: {
            color: colors.darkGreen,
            countries: [...origin],
        },
        destination: {
            color: colors.darkRed,
            countries: [...destination],
        },
        originAndDestination: {
            color: colors.violet,
            countries: [...originAndDestination],
        },
    }
}


export const getCoordinates = (migrations, countryName) => {
    const migrationEvent = { ...migrations[0] }
    if (migrationEvent.fromName.value === countryName) {
        return [migrationEvent.fromName.fromLongitude.value, migrationEvent.fromName.fromLatitude.value]
    }
    return [migrationEvent.destName.destLongitude.value, migrationEvent.destName.destLatitude.value]
}

const chartDataHelper = (migrations) => {
    let chartData = []
    migrations?.forEach((element) => {
        const i = chartData.findIndex(e => e.name === element.fromName.value)
        if (i !== -1) {
            chartData[i] = { ...chartData[i], immigrants: chartData[i].immigrants + parseInt(element.value.value) }
        }
        else {
            chartData = [...chartData, { name: element.fromName.value, emigrants: 0, immigrants: parseInt(element.value.value) }]
        }
        const j = chartData.findIndex(e => e.name === element.destName.value)
        if (j !== -1) {
            chartData[j] = { ...chartData[j], emigrants: chartData[j].emigrants + parseInt(element.value.value) }
        }
        else {
            chartData = [...chartData, { name: element.destName.value, immigrants: 0, emigrants: parseInt(element.value.value) }]
        }
    })
    return chartData
}


const getMyColor = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};



export const getBarChartData = (migrations, countryFilter) => {
    let barChart = chartDataHelper(migrations)
    const filterIndex = barChart.findIndex(e => e.name === countryFilter)
    if (filterIndex > -1) {
        barChart.splice(filterIndex, 1)
    }
    const reduced = barChart.sort(function (a, b) { return (b.immigrants + b.emigrants) - (a.immigrants + a.emigrants) }).slice(0, 10)
    const countryLabels = reduced.map(e => e.name)
    let immigrantsSeries = reduced.map(e => e.immigrants)
    let emigrantsSeries = reduced.map(e => e.emigrants)
    return { countryLabels, immigrantsSeries, emigrantsSeries }

}

export const getPieChartData = (migrations, countryFilter) => {
    let pieChart = chartDataHelper(migrations)
    const filterIndex = pieChart.findIndex(e => e.name === countryFilter)
    if (filterIndex > -1) {
        pieChart.splice(filterIndex, 1)
    }
    let sort = pieChart.sort(function (a, b) { return b.immigrants - a.immigrants })
    let reduced = sort.slice(0, 10)
    let immigrantsPie = reduced.filter(e => e.immigrants !== 0).map((e, index) => ({
        id: index,
        label: e.name,
        value: e.immigrants,
        color: getMyColor()
    }))
    let otherImmigrants = 0;
    sort.slice(10).forEach(e => otherImmigrants += e.immigrants)
    immigrantsPie = [...immigrantsPie, { id: 10, label: 'Others', value: otherImmigrants, color: getMyColor() }]

    sort = pieChart.sort(function (a, b) { return b.emigrants - a.emigrants })
    reduced = sort.slice(0, 10)
    let otherEmigrants = 0;
    sort.slice(10).forEach(e => otherEmigrants += e.emigrants)
    let emigrantsPie = reduced.filter(e => e.emigrants !== 0).map((e, index) => ({
        id: index,
        label: e.name,
        value: e.emigrants,
        color: getMyColor()
    }))
    emigrantsPie = [...emigrantsPie, { id: 10, label: 'Others', value: otherEmigrants, color: getMyColor() }]
    return { immigrantsPie, emigrantsPie }
}

export const getVocab = (path) => {
    const url = new URL(path)
    return url.origin

}
export const getType = (path) => {
    const url = new URL(path)
    return url.pathname.substring(1)
}