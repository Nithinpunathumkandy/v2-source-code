import { action, computed, observable } from 'mobx';
import { IndividualJsoObservation, jsoObservations, jsoObservationsPaginationResponse, UnsafeAction } from 'src/app/core/models/jso/jso-observations/jso-observations.model';
import { JsoCount, jsoNumberOfObservations, jsoObservationCategories, jsoOpenClosed, jsoParticipationPerDepartment, jsoPositiveNegativeCount } from 'src/app/core/models/masters/jso/jso-dashboard';

class Store{
    @observable
    private _jsoCount:JsoCount;

    @observable
    private _jsoPositiveNegative:jsoPositiveNegativeCount [] = [];

    @observable
    private _jsoOpenClose:jsoOpenClosed [] = [];

    @observable
    private _jsoNumberOfObservations:jsoNumberOfObservations [] = [];

    @observable
    private _jsoParticipationPerDepartment:jsoParticipationPerDepartment [] = [];

    @observable
    private _jsoObservationCategories:jsoObservationCategories [] = [];

    @observable
    _jsoCountLoaded: boolean = false;

    @observable
    jsoPositiveNegative_loaded: boolean = false;

    @observable
    openclose_loaded: boolean = false;

    @observable
    number_observations_loaded: boolean = false;

    @observable
    participation_department_loaded: boolean = false;

    @observable
    observation_categories_loaded: boolean = false;

    @computed
    get jsoCount(): JsoCount {
    return this._jsoCount;
    }

    @computed
    get jsoPositiveNegative(): jsoPositiveNegativeCount[] {
    return this._jsoPositiveNegative;
    }

    @computed
    get jsoOpenClose(): jsoOpenClosed[] {
    return this._jsoOpenClose;
    }

    @computed
    get jsoNumberOfObservations(): jsoNumberOfObservations[] {
    return this._jsoNumberOfObservations;
    }

    @computed
    get jsoParticipationPerDepartment(): jsoParticipationPerDepartment[] {
    return this._jsoParticipationPerDepartment;
    }

    @computed
    get jsoObservationCategories(): jsoObservationCategories[] {
    return this._jsoObservationCategories;
    }

    @action
    setJSOCount(response: JsoCount){
        this._jsoCount = response;
        this._jsoCountLoaded = true;
    }

    @action
    setJSOPositiveNegativeCount(response) {
        this.jsoPositiveNegative_loaded = true;
        this._jsoPositiveNegative=response;
    }

    @action
    setJSOOpenClose(response) {
        this.openclose_loaded = true;
        this._jsoOpenClose=response;
    }

    @action
    setNumberOfObservations(response) {
        this.number_observations_loaded = true;
        this._jsoNumberOfObservations=response;
    }

    @action
    setParticipationPerDepartment(response) {
        this.participation_department_loaded = true;
        this._jsoParticipationPerDepartment=response;
    }

    @action
    setObservationCategories(response) {
        this.observation_categories_loaded = true;
        this._jsoObservationCategories=response;
    }
}

export const JsoDashboardStore = new Store();