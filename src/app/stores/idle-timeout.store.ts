import { observable, action } from 'mobx-angular';
import { User } from '../core/models/user.model';
import { computed } from 'mobx';

class Store {
    @observable
    userDetails: User;

    @action
    setUser(user: User) {
        this.userDetails = user;
    }

    @computed
    get getUser():User{
        return this.userDetails;
    }

}

export const IdleTimeoutStore = new Store();