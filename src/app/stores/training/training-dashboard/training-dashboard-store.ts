
import { observable, action, computed } from "mobx-angular";
import { Training, TrainingAttendies, TrainingBarCompetency, TrainingBarCompetencyGroup, TrainingBarDepartment, TrainingBarYears, TrainingCount, TrainingPaginationResponse, TrainingPieStatus } from "src/app/core/models/training/training-dashboard/training-dashboard";
class Store {


    @observable
    private _training: Training[] = [];

    @observable
    private _secondTraining: Training[] = [];

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    trainingStatus: string = null;

    @observable
    private _trainingCount: TrainingCount;

    @observable
    private _trainingAttendies: TrainingAttendies;

    @observable
    private _trainingPieStatus: TrainingPieStatus[] = [];

    @observable
    private _trainingBarCompetency: TrainingBarCompetency[] = [];

    @observable
    private _trainingBarCompetencyGroup: TrainingBarCompetencyGroup[] = [];

    @observable
    private _trainingBarDepartment: TrainingBarDepartment[] = [];

    @observable
    private _trainingBarYears: TrainingBarYears[] = [];

    @observable
    dashboardLoaded: boolean = false;

    @observable
    dashboardParam: string = null;


    @action
    setTraining(response: TrainingPaginationResponse) {
        this._training = response.data; 
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
    }

    @action
    setSecondTraining(response: TrainingPaginationResponse) {
        this._secondTraining = response.data; 
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
    }

    @action
    setTrainingCount(response: TrainingCount) {
        this._trainingCount = response; 
    }

    @action
    setTrainingAttendies(response: TrainingAttendies) {
        this._trainingAttendies = response; 
    }

    @action
    setTrainingPieStatus(response: TrainingPieStatus[]) {
        this._trainingPieStatus = response; 
    }

    @action
    setTrainingBarCompetency(response: TrainingBarCompetency[]) {
        this._trainingBarCompetency = response; 
    }

    @action
    setTrainingBarCompetencyGroup(response: TrainingBarCompetencyGroup[]) {
        this._trainingBarCompetencyGroup = response; 
    }

    @action
    setTrainingBarDepartment(response: TrainingBarDepartment[]) {
        this._trainingBarDepartment = response; 
    }

    @action
    setTrainingBarYears(response: TrainingBarYears[]) {
        this._trainingBarYears = response; 
    }

    @computed
    get Training():Training[]{
        return this._training;
    }

    @computed
    get secondTraining():Training[]{
        return this._secondTraining;
    }

    @computed
    get TrainingAttendies():TrainingAttendies{
        return this._trainingAttendies;
    }

    @computed
    get TrainingCount():TrainingCount{
        return this._trainingCount;
    }

    @computed
    get TrainingPieStatus():TrainingPieStatus[]{
        return this._trainingPieStatus;
    }

    @computed
    get TrainingBarCompetency():TrainingBarCompetency[]{
        return this._trainingBarCompetency;
    }

    @computed
    get TrainingBarCompetencyGroup():TrainingBarCompetencyGroup[]{
        return this._trainingBarCompetencyGroup;
    }

    @computed
    get TrainingBarDepartment():TrainingBarDepartment[]{
        return this._trainingBarDepartment;
    }

    @computed
    get TrainingBarYears():TrainingBarYears[]{
        return this._trainingBarYears;
    }

    @action
    setDashboardParam(param:string){
        this.dashboardParam = param
    }

    @computed
    get dashboardParameter(){
        return this.dashboardParam;
    }

    @action
    unsetDashboardParam() {
        this.dashboardParam = null;
    }

}

export const TrainingDashboardStore = new Store();