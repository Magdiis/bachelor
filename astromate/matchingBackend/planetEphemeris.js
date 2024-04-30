const ephemeris = require('ephemeris');
const { getDegree } = require("./degreeConvertor")


function getPlanetEphemeris(date, latitude, longitude){
    const fromStringDate = new Date(date)
    return {
        jupiter: getDegree(ephemeris.getPlanet('jupiter',fromStringDate,latitude, longitude, 0).observed.jupiter.apparentLongitudeDms360),
        mars: getDegree(ephemeris.getPlanet('mars',fromStringDate,latitude, longitude, 0).observed.mars.apparentLongitudeDms360),
        sun: getDegree(ephemeris.getPlanet('sun',fromStringDate,latitude, longitude, 0).observed.sun.apparentLongitudeDms360)
    }
}

module.exports = {getPlanetEphemeris}