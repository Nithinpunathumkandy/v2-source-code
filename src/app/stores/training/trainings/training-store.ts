import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { action, computed, observable } from 'mobx';
import { IndividualTrainings, Trainings, TrainingsPaginationResponse } from 'src/app/core/models/training/trainings/trainings.model';

class Store{
    @observable
    private _trainings:Trainings[] = [];

    @observable
    private _trainingDetails:IndividualTrainings;

    @observable
    loaded: boolean = false;

    @observable
    id: number = null;

    @observable
    organisationObj = null;

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

    @observable
    orderItem: string = 'trainings.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    lastCreatedTrainingId: number = null;

    @observable
    training_id: number = null;

    @observable
    training_select_form_modal:boolean=false;

    @observable
    saveSelected: boolean = false;

    @observable
    selectedTrainingForMapping: Trainings[]=[]


    addSelectedTrainings(issues){
        this.selectedTrainingForMapping = issues;
    }

    @computed
    get trainingsList(): Trainings[] {
    return this._trainings.slice();
    }

    gettrainingById(id: number): Trainings {
        return this._trainings.slice().find(e => e.id == id);
    }
    @computed
    get trainingDetails(): IndividualTrainings {
    return this._trainingDetails;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setTrainings(response: TrainingsPaginationResponse){
        this._trainings = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @computed
    get allItems(): Trainings[] {
        
        return this._trainings.slice();
    }

    @action
    setIndividualTrainings(details) {
        this.individual_training_loaded = true;
        this._trainingDetails=details;
    }

    unsetIndividualTrainings(){
        this.individual_training_loaded = false;
        this._trainingDetails = null;
    }

}

export const TrainingsStore = new Store();