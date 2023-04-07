import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';

import {Unit} from 'src/app/core/models/general/unit';



class Store {

   

    @observable
    loaded:boolean = false;

    @observable
    private _units:Unit[];

    @observable
    lastInsertedId: number = null;


    @action
    setUnits(response: Unit[]) {
        
        this._units = response;
        this.loaded = true;
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }
  

    @computed
    get units(): Unit[] {
        
        return this._units;
    }

    

   
  
}

export const UnitStore = new Store();