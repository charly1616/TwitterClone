export const formatPostDate = (createdAt) => {
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate)/1000.0);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60.0);
    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes/60.0);
    const timeDifferenceInDays = Math.floor(timeDifferenceInHours/24.0);
    const timeDifferenceInWeeks = Math.floor(timeDifferenceInDays/7.0);

    if (timeDifferenceInWeeks > 1){
        return createdAtDate.toLocaleDateString("en-US", {month: "short", day: "numeric"});
    } else if (timeDifferenceInWeeks === 1){
        return "1W";
    } else if (timeDifferenceInDays >= 1){
        return `${timeDifferenceInDays}d`
    } else if (timeDifferenceInHours >= 1){
        return `${timeDifferenceInHours}h`
    } else if (timeDifferenceInMinutes >= 1){
        return `${timeDifferenceInMinutes}m`
    } else {
        return "Ahora mismo"
    }
}

export const formatMemberSinceDate = (createdAt) => {
    const date = new Date(createdAt);
    const months = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ]

    const month = months[date.getMonth()]
    const year = date.getFullYear();

    return `Leal desde ${month} ${year}`
}
