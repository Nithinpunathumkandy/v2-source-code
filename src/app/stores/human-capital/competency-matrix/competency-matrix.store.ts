import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import {CompetencyMatrix} from 'src/app/core/models/human-capital/competency-matrix/competency-matrix';



class Store {

    @observable
    private _competencyMatrix: CompetencyMatrix;

    @observable matrixLoaded:boolean = false;

    @action
    setCompetencyMatrix(response: CompetencyMatrix) {

        this._competencyMatrix = response;
        this.matrixLoaded = true;
    }

    @action
    unsetCompetencyMatrix() {

        this._competencyMatrix = null;
        this.matrixLoaded = false;
    }

    @computed
    get competencyMatrix(): CompetencyMatrix {

        return this._competencyMatrix;
    }

}

export const CompetencyMatrixStore = new Store();