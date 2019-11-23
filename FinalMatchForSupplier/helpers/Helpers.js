export const daysBetween2Dates = (bigDay, smallDay) => {   
    if(bigDay < smallDay) {
        return 0
    }
    let times =   bigDay.getTime() - smallDay.getTime()
    let days = Math.floor(times / (1000 * 3600 * 24 * 365))
    return days
}
export function formatDate(day, month, year) {
    const strDay = day < 10 ? `0${day}` : `${day}`
    month += 1
    const strMonth = month < 10 ? `0${month}` : `${month}`
    return `${strDay}/${strMonth}/${year}`
}