import { action, computed, observable } from "mobx";
import { AppFeedbackKey } from "../core/models/masters/general/app-feedback-key";

class Store {
    @observable
    private _appFeedbackKeys: AppFeedbackKey[] = [];

    @observable
    private _appFeedbackSmiley= [];
    
    @action
    setAppFeedbackKey(response) {
        this._appFeedbackKeys = response.data;
    }

    @action
    setAppFeedbackSmiley(response) {
        this._appFeedbackSmiley = response.data;
    }

    @computed
    get feedbackKey(): AppFeedbackKey[] {  
        return this._appFeedbackKeys.slice();
    }

    @computed
    get feedbackSmiley() {  
        return this._appFeedbackSmiley.slice();
    }
}

export const FeedbackStore = new Store();