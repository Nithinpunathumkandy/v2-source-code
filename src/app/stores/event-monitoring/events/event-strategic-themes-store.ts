import { observable, action, computed } from "mobx-angular";
import { EventObjective,EventTheme,ThemeObjective,EvenetObjectiveDetails } from "src/app/core/models/event-monitoring/events/event-objective";
class Store {
@observable
 private  _eventObjectives: EventObjective[] = [];
 @observable
 eventObjectiveLoaded: boolean = false;
 @observable
 _eventTheme: EventTheme[] = [];
 @observable
 _themeObjective: ThemeObjective[] = [];

 @observable
 _eventObjectiveDetails: EvenetObjectiveDetails = null;

 @observable
 _selectedEventObjectId: number;

 @action
 setEventObjectives(response:any) {

     this._eventObjectives = response;
     this.eventObjectiveLoaded=true;
 }

 @action
 setEventTheme(response:any){
    this._eventTheme=response.data
    //this.eventThemeloaded=true;
}

@action
setThemeObjectives(data:ThemeObjective[]){
    this._themeObjective = data
    // this.strategicAlignmentLoaded = true
}

@action
setSingleEventObjectiveDetails(data:any){
    this._eventObjectiveDetails = data.event_strategic_theme
    //console.log(this._eventObjectiveDetails)
    // this.strategicAlignmentLoaded = true
}
@action
setselectedEventObjectId(id)
{
    this._selectedEventObjectId=id;
}
 @computed
 get allEventObjctives(): EventObjective[] {
     return this._eventObjectives.slice();
 }

 @action
 unsetEventObjectives()
 {
    this._eventObjectives=[];
    this._eventObjectiveDetails=null;
    this._selectedEventObjectId=null;
    this.eventObjectiveLoaded=false;
 }
}
 export const StrategicThemesStore = new Store();