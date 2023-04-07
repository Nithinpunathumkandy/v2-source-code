import { action, computed, observable } from 'mobx';
import { ProfileTraining, ProfileTrainingPaginationResponse } from 'src/app/core/models/my-profile/profile/profile-training';

class Store{
    @observable
    private _profileTraining

    @observable
    private _profileIndividualTraining:ProfileTraining;

    @observable
    loaded: boolean = false;

    @observable
    individual_training_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @computed
    get profileTraining() {
      //  console.log("train",this._profileTraining)
    //    return this._profileTraining.slice();
    return this._profileTraining;
    }

    @computed
    get profileIndividualTraining(): ProfileTraining {
    //    return this._profileTraining.slice();
    return this._profileIndividualTraining;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setProfileTraining(response: ProfileTrainingPaginationResponse){
        this._profileTraining = response;
        // this.currentPage = response.current_page;
        // this.itemsPerPage = response.per_page;
        // this.totalItems = response.total;
        this.loaded = true;
        // this.from = response.from;
    }

    @action
    setIndividualProfileTraining(details) {
        this.individual_training_loaded = true;
        this._profileIndividualTraining=details;
    }

    unsetIndividualProfileTraining(){
        this.individual_training_loaded = false;
        this._profileIndividualTraining = null;
    }
    
}

export const ProfileTrainingStore = new Store();