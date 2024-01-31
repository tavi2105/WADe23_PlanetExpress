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