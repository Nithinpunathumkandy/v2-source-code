import { observable, action, computed } from "mobx-angular";

class Store {

    @observable
    _formData: any[] = [] 

    @observable
    _mileStone: any[] = [] 

    @observable
    induvalData = null;

    @observable
    is_mileStoneReq: boolean = true;

    @observable
    is_actionPlan : boolean = false;


    @action
    setInitiativeFormData(data){
      this._formData.push(data)
    }

    @action
    setMileStoneFormData(data){
      this._mileStone.push(data)
    }

    @action
    setInduvalItems(data){
      this.induvalData = data
    }

    get induvalInitiativeData(){
      return this.induvalData
    }

    get initiativeData(){
    return this._formData
    }

    get initiativeMileStoneData(){
      return this._mileStone
      }
}
export const InitiativeStore = new Store();
