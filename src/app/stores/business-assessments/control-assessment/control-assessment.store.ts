import { observable, action, computed } from "mobx-angular";
import {controlAssessment,ControlAssessmentPaginationResponse,ControlAssessmentDetails} from 'src/app/core/models/business-assessments/control-assessment/control-assessment'
class Store{

    @observable
    private controlAssessment: controlAssessment[] = [];

    @observable
    loaded: boolean = false;

    @observable
    details_loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'business_assessments.reference_code';

    @observable
    private controlAssessmentDetails: ControlAssessmentDetails;

    formType:string;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    docDetails:any

    @observable
    totalItems: number = null;

    @observable
    searchText: string;

    @observable
    docversionId: number = null;

    
    @observable
    _actionPlanHistoryData:History[]= [];

    actionPlanUpdateModal:boolean=false;
    actionPlanStatusUpdateModal:boolean=false;
    actionPlanStatusHistoryModal:boolean=false;
    
    @observable
    historyOrderBy: 'asc' | 'desc' = 'desc';

    @observable
    historyOrderItem: string = '';

    @observable
    historyCurrentPage: number = 1;

    @observable
    historyItemsPerPage: number = null;

    @observable
    historyTotalItems: number = null;

    @observable
    actionPlanHistoryLoaded: boolean = false;

    selected: number;

    @action
    setSelected(value:number){
        this.selected = value;
    }

    get selectedItem():number{
        return this.selected;
    }

   
    @action
    setControlAssessment(response: ControlAssessmentPaginationResponse) {
        this.controlAssessment = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    unsetControlAssessment() {
        this.controlAssessment = [];
        this.loaded = false;
    }

    @action
    setControlAsessmentDetails(details:ControlAssessmentDetails) {
        this.details_loaded = true;
        this.controlAssessmentDetails = details;
    }

    @action
    unsetControlAsessmentDetails() {
        this.controlAssessmentDetails = null;
        this.details_loaded = false;
    }
    @action
    unsetDocumentId()
    {
        this.docDetails=null;
        
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

   @action
   setDocumentVersionId(docVersionId:number)
   {
    this.docversionId=docVersionId;
   }

   @action
   setDocument(docDetails:any)
   {
    this.docDetails=docDetails;
   }


}

export const ControlAssessmentStore = new Store()