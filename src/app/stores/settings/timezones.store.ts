import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Timezones } from 'src/app/core/models/settings/timezones';

class Store {
    @observable
    private _timezones: Timezones[] = [];

    @observable
    loaded: boolean = false;

    @action
    setTimezones(timezones: Timezones[]) {
        this._timezones = timezones;
        this.loaded = true;
    }

  
    @computed
    get timezones(): Timezones[] {
        return this._timezones.slice();
    }


}

export const TimezonesStore = new Store();