import { TrainEntity, StationEntity, Timetable, DIRECTION } from './timetable';

export class TimetableDecorator {
    constructor(private timetable: Timetable) {
        this.decorate();
    }

    get DecoratedTimetable(): Timetable {
        return this.timetable;
    }

    private decorate() {
        for (const train of this.timetable.trains) {
            train.endStation = this.getEndStation(train);
            train.direction = this.getDirection(train);
            train.isCisie = this.isCisie(train);
        }
    }

    private getEndStation(train: TrainEntity): StationEntity {
        let stations = train.stations;
        let station = stations[stations.length - 1];
        for (let i = stations.length - 1; i >= 0; i--) {
            station = stations[i];
            if (station.time != "" || station.time2 != "") {
                return station;
            }
        }

        return station;
    }

    private getDirection(train: TrainEntity): DIRECTION {
        let endStation = train.endStation;
        console.assert(endStation != null);
        switch(endStation.name) {
            case DIRECTION.WWA:
                return DIRECTION.WWA;
            case 'Łuków':
                return DIRECTION.LUK;
            default:
                throw `Unknown direction ${endStation.name} ${train.num}`;
        }
    }

    private isCisie(train: TrainEntity): boolean {
        return train.stations.find((station: StationEntity) => station.name == 'Cisie') != null;
    }
}
