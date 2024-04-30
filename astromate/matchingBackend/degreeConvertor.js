 function getDegree(longitude) {
    const degree = longitude.substring(0, longitude.indexOf("°"))
    return Number(degree) + getDegreeByRoundedMinutes(longitude)
}

 function getDegreeByRoundedMinutes(longitude) {
    var minutes = longitude.split('°')[1]
    minutes = minutes.substring(0, minutes.indexOf("'"))
    if (Number(minutes) < 30){
        return 0
    } else {
        return 1
    }
}

 module.exports = {getDegree}