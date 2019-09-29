import { TrainEntity, StationEntity, Timetable, DIRECTION } from './timetable';
import { StationCoordDecorator } from './station-coord-decorator';

export class TimetableDecorator {
    constructor(private timetable: Timetable) {
        this.decorate();
    }

    get DecoratedTimetable(): Timetable {
        return this.timetable;
    }

    private decorate() {
        let id = 1;
        for (const train of this.timetable.trains) {
            train.startStation = this.getStartStation(train);
            train.endStation = this.getEndStation(train);
            train.direction = this.getDirection(train);
            train.isCisie = this.isCisie(train);
            train.id = id++;
            for (const station of train.stations) {
                station.code = StationCoordDecorator.getCodeFromName(station.name);
                station.shortName = StationCoordDecorator.generateShortName(station.name);
            }
        }
    }

    private getStartStation(train: TrainEntity): StationEntity {
        let stations = train.stations;
        let station = stations.find((s: StationEntity) => s.time2 != null && s.time2 != "" && s.time2 != '|');

        return station;
    }

    private getEndStation(train: TrainEntity): StationEntity {
        let stations = train.stations;
        let station = stations[stations.length - 1];
        for (let i = stations.length - 1; i >= 0; i--) {
            station = stations[i];
            if ((station.time != "" && station.time != '|') || (station.time2 != null && station.time2 != "" && station.time2 != '|')) {
                return station;
            }
        }

        return station;
    }

    private getDirection(train: TrainEntity): DIRECTION {
        let lastStation = train.stations[train.stations.length - 1];
        console.assert(lastStation != null);
        switch (lastStation.name) {
            case DIRECTION.WWA:
                return DIRECTION.WWA;
            case 'Łuków':
            case 'Siedlce':
                return DIRECTION.LUK;
            default:
                throw `Unknown direction ${lastStation.name} ${train.num}`;
        }
    }

    private isCisie(train: TrainEntity): boolean {
        return train.stations.find((station: StationEntity) => station.name == 'Cisie' && station.time != '' && station.time != '|') != null;
    }
}
