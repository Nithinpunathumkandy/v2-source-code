import { action, computed, observable } from "mobx";
import { TrainingMatrixDetails } from "src/app/core/models/human-capital/competency-matrix/training-matrix-details/training-matrix-details";

class Store {

    @observable
    private _trainingDetails: TrainingMatrixDetails;

    @observable trainingDetailsLoaded:boolean = false;

    @action
    setTrainingMatrixDetails(response: TrainingMatrixDetails) {

        this._trainingDetails = response;
        this.trainingDetailsLoaded = true;
    }

    @action
    unsetTrainingMatrixDetails() {

        this._trainingDetails = null
        this.trainingDetailsLoaded = false;
    }

    @computed
    get trainingMatrixDetails(): TrainingMatrixDetails {

        return this._trainingDetails;
    }

}

export const TrainingMatrixDetailsStore = new Store();