import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MasterModules, MasterSubModules, SubModulesSearchResult } from "src/app/core/models/masters/masters-menu";

class Store {

    @observable
    private _menuItems: MasterModules[] = [];

    @observable
    loaded: boolean = false;

    @observable
    searchResults: SubModulesSearchResult[] = [];

    @action
    setMenuItems(items: MasterModules[]){
        this.loaded = true;
        this._menuItems = items;
    }

    get masterMenu(): MasterModules[]{
        return this._menuItems.slice();
    }

    masterSubMenu(moduleId: number): MasterSubModules[]{
        let pos = this._menuItems.findIndex(e=>e.id == moduleId);
        if(pos != -1) return this._menuItems[pos].modules;
        else return [];
    }

    @action
    setSearchResults(items: SubModulesSearchResult[]){
        this.searchResults = items;
    }

    get searchSubModulesResults(): SubModulesSearchResult[]{
        return this.searchResults.slice();
    }

}

export const MasterMenuStore = new Store();