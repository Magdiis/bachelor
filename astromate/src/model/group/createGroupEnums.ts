export enum useCase {
    Work = "Práce", // obory
    Sport = "Sport", // konkretni sporty
    Friendship = "Přátelství", 
    Relationship = "Vztah"
}

export const useCasesValues = Object.values(useCase)

export enum workCases{
    Sales = "Obchod",
    Education = "Vzdělání",
    Services = "Služby",
    Healthcare = "Zdravotnictví",
    Economics = "Ekonomie",
    Culture = "Kultura",
    Manual = "Řemeslné, manuální práce",
    Agriculture = "Zemědělství",
    Technical = "Technika a IS/IT",
    Other = "Jiné"
}

export const workCasesValues = Object.values(workCases)

export enum SportCases{
    Badminton = "Badminton",
    Tennis = "Tenis",
    TableTennis = "Stolní tennis",
    Yoga = "Joga",
    Football = "Fotbal",
    Floorball = "Florbal",
    IceHockey = "Zimní hokej",
    Hockey = "Hokej",
    Swimming = "Plavání",
    Cycling = "Cyklistika",
    Running = "Běh",
    FightSport = "Bojové sporty",
    Dance = "Tanec",
    Other = "Jiné"
}

export const sportCasesValues = Object.values(SportCases)


export enum colorsCases{
    Blue = "blue",
    Red = "red",
    Orange = "orange",
    Green = "green"
}

export const colorsCasesValues = Object.values(colorsCases)