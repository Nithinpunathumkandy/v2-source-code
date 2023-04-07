import { action, computed, observable } from 'mobx';
import { competencyArray, CompetencyDetail, ProfileCompetencies } from 'src/app/core/models/my-profile/profile/profile-competencies';

class Store{
    @observable
    private _profileCompetency:ProfileCompetencies;

    @observable
    private _individualCompetency:CompetencyDetail[];

    @observable
    private _competencyDetails:CompetencyDetail[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individual_competency_loaded: boolean = false;

    @computed
    get profileCompetency(): ProfileCompetencies{

       return this._profileCompetency;
    }

    @computed
    get competencyDetails(): CompetencyDetail[]{

       return this._competencyDetails;
    }

    @computed
    get Individualcompetencies(): CompetencyDetail[]{

       return this._individualCompetency;
    }

    @action
    setProfileCompetency(response){
        this._profileCompetency = response;
        this._competencyDetails = response.details;
        this.loaded = true;
    }

    @action
    setIndividualCompetency(details:CompetencyDetail[]) {
        this.individual_competency_loaded = true;
        this._individualCompetency=details;
    }

    unsetIndividualCompetency(){
        this.individual_competency_loaded = false;
        this._individualCompetency = null;
    }
}

export const ProfileCompetenciesStore = new Store();