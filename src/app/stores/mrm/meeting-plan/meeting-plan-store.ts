
import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { ActionPlan } from "src/app/core/models/mrm/dashboard/mrm-dashboard";
import { MeetingPlanPaginationResponse, IndividualMeetingPlan } from 'src/app/core/models/mrm/meeting-plan/meeting-plan';

//import { Image } from "src/app/core/models/image.model";
class Store {
    @observable
    private _meetingPlan: IndividualMeetingPlan[] = [];

    @observable
    private _meetingPlanAgendas=[]

    @observable
    loaded: boolean = false;

    @observable
    private _individualMeetingPlanDetails: IndividualMeetingPlan;

    @observable
    currentPage: number = 1;

    @observable
    meetingPlanId: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    itemsPerPage: number = 15;

    @observable
    orderItem: string = '';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    editListCancelFlag: string = 'list';

    @observable
    preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    private _actionPlan: ActionPlan[]=[];

    searchText: string;

    @observable
    category: any;

    @observable
    venue: any;

    @observable
    meeting: any;

    @observable
    msTypes = [];

    @observable
    departments = [];

    @observable
    organizations = [];

    @observable
    divisions = [];

    @observable
    sections = [];

    @observable
    subSections = [];

    @observable
    processes = [];

    @observable
    issues = [];

    @observable
    users = [];

    @observable
    objectiveToDisplay: any = [];

    @observable
    meetingType = [];

    newMeetingAgenda: any = [];

    selectedMeeting = null;

    updateItem = null;

    @observable
    selectedCriteriaList = [];

    criteriaToDisplay: any = [];

    @observable
    selectedObjectivelist = [];

    @observable
    selectedRiskList = [];

    @observable
    criteria_form_modal: boolean = false;

    @observable
    objectives_form_modal: boolean = false;

    @observable
    agenda_form_modal: boolean = false;

    @observable
    date_update_modal_form:boolean = false;

    @observable
    cancel_modal_form: boolean =false;

    @observable
    selecetdMeetingPlanId: number = null;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }
    @action
    setDocumentDetails(details: Image, url: string) {

        this._documentDetails.push(details);
        this.preview_url = url;

    }

    @action
    addSelectedObjective(objective, objectiveToDisplay) {
        this.selectedObjectivelist = objective;
        this.objectiveToDisplay = objectiveToDisplay;
    }

    @action
    unSelectObjective() {
        this.selectedObjectivelist = [];
        this.objectiveToDisplay = [];
    }

    @action
    addSelectedCriteria(criteria, criteriaToDisplay) {
        this.selectedCriteriaList = criteria;
        this.criteriaToDisplay = criteriaToDisplay;
    }

    @action
    unSelectCriteria() {
        this.selectedCriteriaList = [];
        this.criteriaToDisplay = [];
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    setIndividualMeetingPlanDetails(details: IndividualMeetingPlan) {
        this.individualLoaded = true;
        this._individualMeetingPlanDetails = details;
        this.updateMeetingPlan(details);
    }

    @action
    unsetIndividualMeetingPlanDetails() {
        this.individualLoaded = false;
        this._individualMeetingPlanDetails = null;
    }

    @action
    updateMeetingPlan(meetingPlan: IndividualMeetingPlan) {
        const meetingPlans: IndividualMeetingPlan[] = this._meetingPlan.slice();
        const index: number = meetingPlans.findIndex(e => e.id == meetingPlan.id);
    }


    @action
    setMeetingPlan(response: MeetingPlanPaginationResponse) {

        this._meetingPlan = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetMeetingPlan(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._meetingPlan = [];
        this.itemsPerPage = null;
    }

    @action
    setAllMeetingPlan(meetingPlan: IndividualMeetingPlan[]) {

        this._meetingPlan = meetingPlan;
        this.loaded = true;

    }

    @computed
    get allItems(): IndividualMeetingPlan[] {

        return this._meetingPlan.slice();
    }
    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action
    unsetDocumentDetails(token?: string) {

        var b_pos = this._documentDetails.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._documentDetails[b_pos].hasOwnProperty('is_new')) {
                this._documentDetails.splice(b_pos, 1);
            }
            else {
                this._documentDetails[b_pos]['is_deleted'] = true;
            }
        }

    }
    @action
    setMeetingPlanId(id: number) {
        this.meetingPlanId = id;
    }

    @action
    unsetMeetingPlanId() {

        this.meetingPlanId = null;
    }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    @action
    addSelectedRisk(issues) {
        this.selectedRiskList = issues;
    }

    @computed
    get individualMeetingPlanDetails(): IndividualMeetingPlan {
        return this._individualMeetingPlanDetails;
    }

    @action
    setActionPlan(res: ActionPlan[]) {
        this._actionPlan = res;
    }

    @action
    unsetActionPlan() {
        this._actionPlan = [];
    }

    @computed
    get actionPlan():ActionPlan[]{
        return this._actionPlan.slice()
    }
    @action
    unsetSelectedRisk() {
        this.selectedRiskList = [];
    }

    @action
    removeAgenda(item) {
        //MeetingPlanStore.meetingPlanAgendas.splice(position, 1);
        const index = MeetingPlanStore._meetingPlanAgendas.indexOf(item);
        if (index >= 0) MeetingPlanStore._meetingPlanAgendas.splice(index, 1)
            }
    
    @action
    setMeetingPlanAgenda(agendas){
       
        this._meetingPlanAgendas.push(agendas)
        console.log(this._meetingPlanAgendas)
    }

    @action
    clearMeetingPlanAgendas(){
        this._meetingPlanAgendas=[]
    }

    @computed
    get meetingPlanAgendas(){
        return this._meetingPlanAgendas.slice();
    }
    
}

export const MeetingPlanStore = new Store();

