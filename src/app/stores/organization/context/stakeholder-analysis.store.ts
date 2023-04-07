import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { StakeholdersList, NeedsExpectationsList, StakeNeedsExpectations } from 'src/app/core/models/organization/context/stakeholder-analysis';

class Store {

    @observable
    private _stakeholderDetailsList: StakeholdersList[] = [];

    @observable
    loaded: boolean = false;

    private _needsExpectationsList: StakeNeedsExpectations[] = [];

    @action // Set Stakeholder Details
    setStakeholdersDetails(stakeholderDetails: StakeholdersList[]){
        this._stakeholderDetailsList = stakeholderDetails;
        this.loaded = true
    }

    // Returns Stakeholder Details
    get getStakeholderDetails(): StakeholdersList[]{
        return this._stakeholderDetailsList.slice();
    }

    @action // Set Needs and Expectations
    setNeedsExpectationsList(needsExpectaions: StakeNeedsExpectations[]){
        this._needsExpectationsList = needsExpectaions;
    }

    // Return Needs and Expectations
    get getNeedsExpectations(): StakeNeedsExpectations[]{
        return this._needsExpectationsList;
    }

    @action // Clear all Data
    unsetDetails(){
        this._stakeholderDetailsList = [];
        this.loaded = false;
        this.unsetNeedsExpectations();
    }
    
    @action
    unsetNeedsExpectations(){
        this._needsExpectationsList = null;
    }
}

export const StakeholderAnalysisStore = new Store();