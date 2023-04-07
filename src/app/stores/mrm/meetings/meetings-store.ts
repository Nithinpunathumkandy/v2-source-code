import { action, computed, observable } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { IndividualMeetings, MeetingsPaginationResponse } from "src/app/core/models/mrm/meetings/meetings";

class Store{

    @observable
    private _individualMeetingsDetails: IndividualMeetings;

    @observable
    individualLoaded: boolean = false;

    @observable
    PlanInsideindividualLoaded: boolean = false;

    @observable
    editFlag: boolean = false;

    @observable
    mappedActionPlan=[];

    @observable
    meetingListCancelFlag:string = 'list';

    @observable
    meetingPlanInsideAddmeetingFlag: boolean = false;

    @observable
    meetingMomDetialLoaded: boolean = false;
    
    searchText: string;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = '';

    @observable
     _meetings: IndividualMeetings[] = [];// private _meetingPlan: MeetingPlan[] = [];

    @observable
    _minutesOfMeeting=[]

    @observable 
    loaded:boolean=false;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    currentPage: number = 1;

    updateItem = null;

    newMeetingsMom: any = [];

    selectedMeeting = null;

    @observable
    meetingsId: number = null;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    preview_url: string;

    @observable
    path: string = '../';

    @observable
    meeting_select_form_modal:boolean=false;

    @observable
    saveSelected: boolean = false;

    @observable
    selectedMeetingForMapping:IndividualMeetings[]=[]


    addSelectedMeetings(issues){
        this.selectedMeetingForMapping = issues;
    }

    @action
    setDocumentDetails(details: Image,url: string) {
        
            this._documentDetails.push(details);
            this.preview_url = url; 
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    unsetDocumentDetails(token?:string){
        
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

      @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMeetings(response: MeetingsPaginationResponse) {
        
        this._meetings = response.data;  
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetMeetings() {
        this._meetings = [];
        this.loaded = false;
        this.currentPage = null;
        this.itemsPerPage = null;
        this.totalItems = null;
    }

    @computed
    get allItems(): IndividualMeetings[] {
        
        return this._meetings.slice();
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setMeetingsId(id: number) {
        this.meetingsId = id;
    }

    @action
    setIndividualMeetingsDetails(details:IndividualMeetings) {
        this.individualLoaded = true;
        this._individualMeetingsDetails = details;
        this.PlanInsideindividualLoaded=true;
        this.meetingMomDetialLoaded=true;
        // this.updateMeetings(details);
    }

    @action
    unsetIndividualMeetingsDetails() {
        this.individualLoaded = false;
        this._individualMeetingsDetails = null;
        this.PlanInsideindividualLoaded=false;
    }

    // @action
    // updateMeetings(meetings: IndividualMeetings) {
    //     const meeting: IndividualMeetings[] = this._meetings.slice();
    //     const index: number = meeting.findIndex(e => e.id == meetings.id);
    // }

    @computed
    get individualMeetingsDetails(): IndividualMeetings {
        return this._individualMeetingsDetails;
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
    setmeetingPlaninsideMeetingAddFlag() {
        this.meetingPlanInsideAddmeetingFlag=true;
    }

    @action
    unsetmeetingPlaninsideMeetingAddFlag() {
        this.meetingPlanInsideAddmeetingFlag=false;
    }
   
    @action
    setPath( url: string) {
        this.path = url;
    }

    @action
    setMinutesOfMeeting(mom){
        this._minutesOfMeeting.push(mom)
    }

    @computed
    get minutesOfMeeting(){
        return this._minutesOfMeeting;
    }
    @action
    clearMOMs(){
        this._minutesOfMeeting=[];
    }

    @action
    setActionPlan(data) {
        
       this.mappedActionPlan.push(data);
    }

    @action
    clearMappedActionPlan(){
        this.mappedActionPlan=[];
    }
    

}
export const MeetingsStore = new Store();