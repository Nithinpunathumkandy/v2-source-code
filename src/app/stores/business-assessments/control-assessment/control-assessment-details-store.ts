import { observable, action, computed } from "mobx-angular";
import {controlAssessmentDetails,ControlAssessmentDetailsPaginationResponse} from 'src/app/core/models/business-assessments/control-assessment/control-assessment-inner-details'
class Store{

    @observable
    private controlAssessmentDetails: controlAssessmentDetails[] = [];

    @observable
    loaded: boolean = false;

    @observable
    details_loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'control_assessments.reference_code';

    @observable
    lastInsertedId:number;

    @observable
    assessmentDocumentVersionData:any;

    @observable
    controlId:number;

    @observable
    assessmentDocumentVersionId:number;

    @observable
    assessmentId:number;

    @observable
    private controlAssessmentInnerDetails: controlAssessmentDetails;

    formType:string;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    searchText: string;



    selected: number;

    @action
    setSelected(value:number){
        this.selected = value;
    }

    get selectedItem():number{
        return this.selected;
    }

   
    @action
    setControlAssessmentDetails(response: ControlAssessmentDetailsPaginationResponse) {
        this.controlAssessmentDetails = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }


    @action
    unsetControlAssessmentDetails() {
        this.controlAssessmentDetails = [];
        this.loaded = false;
    }

    @action
    setInnerControlAsessmentDetails(details:controlAssessmentDetails) {
        this.details_loaded = true;
        this.controlAssessmentInnerDetails = details;
    }

    @action
    unsetInnerControlAsessmentDetails() {
        this.controlAssessmentInnerDetails = null;
        this.details_loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setControlAssessmentId(id: number) {
        this.assessmentId = id;
    }

    @action
    setControlAssessmentDocumentversionId(id: number) {
        this.assessmentDocumentVersionId = id;
    }
    @action
    setControlAssessmentDocumentversionData(data: any) {
        this.assessmentDocumentVersionData = data;
    }

    @action
    setControlId(id: number) {
        this.controlId = id;
    }

    @action
    unSetControlAssessmentId() {
        this.assessmentId = null;
        this.controlId = null;
    }

    

    get listofControlAssessment():controlAssessmentDetails[]{
        return this.controlAssessmentDetails;
    }

    get indiviaulControlAssessment():controlAssessmentDetails{
        return this.controlAssessmentInnerDetails;
    }
   


}

export const ControlAssessmentDetailsStore = new Store()