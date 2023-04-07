import { observable, action, computed } from "mobx-angular";
import {controlAssessmentCount} from 'src/app/core/models/business-assessments/control-assessment/control-assessment-dashboard'
class Store{
    @observable
    loaded:boolean=false
    @observable
    controlAssessmentCount:controlAssessmentCount;

    @action
    setControlCounts(counts: controlAssessmentCount) {
        this.controlAssessmentCount = counts;
        this.loaded = true;
    }


}

export const ControlAssessmentDashboardStore = new Store()