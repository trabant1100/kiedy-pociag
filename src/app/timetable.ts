export interface Timetable {
    trains: (TrainEntity)[];
}

export interface TrainEntity {
    id: number,
    line: string;
    num: string;
    from: string;
    comments: string;
    stations: (StationEntity)[];
    startStation: StationEntity;
    endStation: StationEntity;
    isCisie: boolean;
    direction: DIRECTION;
}

export interface StationEntity {
    code: string;
    shortName: string;
    name: string;
    time: string;
    time2?: string | null;
}

export enum DIRECTION {
    WWA = 'Warszawa Zachodnia',
    LUK = 'Łuków'
}