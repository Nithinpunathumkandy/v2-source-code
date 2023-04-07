import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { UserJob } from 'src/app/core/models/human-capital/users/user-job';
import { Image } from "src/app/core/models/image.model";
import { User } from 'src/app/core/models/user.model';
import { Qualification } from 'src/app/core/models/human-capital/users/user-qualification';
class Store {
    @observable
    private _userQualification: Qualification[] = [];
    @observable
    user_qualification_loaded: boolean = false;

    @action
    setQualification(settings: Qualification[]) {
        this.user_qualification_loaded = true;
        this._userQualification = settings;
    }

    @action
    getQualificationById(id: number): Qualification {
        return this._userQualification.slice().find(e => e.id == id);
    }

    @computed
    get qualification(): Qualification[] {

        return this._userQualification;
    }

}

export const UserQualificationStore = new Store();