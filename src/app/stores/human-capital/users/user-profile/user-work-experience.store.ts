import { observable, action, computed } from "mobx-angular";
import { Experience } from 'src/app/core/models/human-capital/users/user-work-experience';

class Store {

    @observable
    private _userExperience: Experience[] = [];
    
    @observable
    user_experience_loaded: boolean = false;

    @action
    setExperience(settings: Experience[]) {
        this.user_experience_loaded = true;
        this._userExperience = settings;
    }

    @action
    getExperinceById(id: number): Experience {
        return this._userExperience.slice().find(e => e.id == id);
    }

    @computed
    get workExperience(): Experience[] {

        return this._userExperience.slice();
    }



}

export const UserWorkExperienceStore = new Store();