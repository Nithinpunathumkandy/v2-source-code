import { action, observable, computed } from "mobx-angular";
import { Milestone, MilestoneHistory } from 'src/app/core/models/project-monitoring/project-monitoring.modal';
class Store {
    @observable
    _milestones : Milestone[] = [];

    @observable
    _milestoneHistory : MilestoneHistory[] = []

    @observable
    mileStonesLoaded = false;

    @action
    setMilestones(mileSStones:Milestone[]){
        this._milestones = mileSStones
        this.mileStonesLoaded = true
    }

    @action
    setMileStoneHistory(data:MilestoneHistory[]){
        this._milestoneHistory = data;  
    }

    get milesstonesHistory(){
        return this._milestoneHistory
    }

    get milesstones(){
        return this._milestones
    }
}
export const ProjectMilestoneStore = new Store();