

export function getDegree(longitude: string): number {
    const degree = longitude.substring(0, longitude.indexOf("°"))
    return Number(degree) + getDegreeByRoundedMinutes(longitude)
}

export function getDegreeByRoundedMinutes(longitude: string): number {
    var minutes: string = longitude.split('°')[1]
    minutes = minutes.substring(0, minutes.indexOf("'"))
   if (Number(minutes) < 30){
       return 0
   } else {
       return 1
   }
}