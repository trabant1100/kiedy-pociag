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
    endStation: StationEntity;
    isCisie: boolean;
    direction: DIRECTION;
}

export interface StationEntity {
    code: string;
    name: string;
    time: string;
    time2?: string | null;
}

export enum DIRECTION {
    WWA = 'Warszawa Zachodnia',
    LUK = 'Łuków'
}