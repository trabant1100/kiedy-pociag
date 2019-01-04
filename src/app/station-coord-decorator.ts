import { StationCoord } from './stationcoord';

export class StationCoordDecorator {
    constructor(private stationCoord: StationCoord) {
        this.decorate();
    }

    get DecoratedStationCoord(): StationCoord {
        return this.stationCoord;
    }

    static getCodeFromName(name: string): string {
        return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Ł/g, 'L').replace(/ł/g, 'l').replace(/\s/g, '');
    }

    static generateShortName(name: string): string {
        name = name.replace('Warszawa', 'W-wa').replace('Mińsk Maz.', 'M-Maz');
        return name;
    }

    private decorate() {
        for (const station of this.stationCoord.stations) {
            station.code = StationCoordDecorator.getCodeFromName(station.name);
            station.shortName = StationCoordDecorator.generateShortName(station.name);
        }
    }
}
