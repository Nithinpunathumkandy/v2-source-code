import { observable, action, computed } from "mobx-angular";
import { Assessments, AssessmentPaginationResponse, IndividualAssessment, Checklist } from 'src/app/core/models/business-assessments/assessments/assessments';
import { Image } from 'src/app/core/models/knowledge-hub/work-flow/workFlow';



class Store {
    @observable
    private _assessmentList: Assessments[] = [];

    @observable
    loaded: boolean = false;

    @observable
    checklist_loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'business_assessments.reference_code';

    @observable
    private _individualAssessmentDetails: IndividualAssessment;

    
    @observable
    private _savedAssessmentDetails: IndividualAssessment;

    @observable
    selected_preview_url: string;

    
    @observable
    document_preview_available = false;

    selectedSideMenu: any = 'private';

    @observable
    private _checklists: Checklist;

    @observable
    individual_assessment_loaded: boolean = false;

    @observable
    saved_assessment_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    assessmentId:number = null;

    @observable
    activeFile = null;

    @observable
    listStyle: string = 'grid';
    
    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    currentAssessment = null;

    
    @observable
    view_more: boolean = false;

    @observable
    currentIndex=null;

    @observable
    private _documentDetails: Image[] = [];

    @action
    setAssessmentDetails(response: AssessmentPaginationResponse) {
        this._assessmentList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetAssessmentDetails() {
        this._assessmentList = [];
        this.loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateAssessment(assessment: Assessments) {
        const assessments: Assessments[] = this._assessmentList.slice();
        const index: number = assessments.findIndex(e => e.id == assessment.id);
    }


    @computed
    get assessmentDetails(): Assessments[] {

        return this._assessmentList.slice();
    }

    getAssessmentById(id: number): IndividualAssessment {
        let assessmentList;

        assessmentList = this._assessmentList.slice().find(e => e.id == id);
        AssessmentsStore.setIndividualAssessmentDetails(assessmentList);
        return assessmentList;
    }

    @action
    setChecklist(details:Checklist) {
        this.checklist_loaded = true;
        this._checklists = details;
        // this.updateAssessment(details);
    }

    @action
    setIndividualAssessmentDetails(details:IndividualAssessment) {
        this.individual_assessment_loaded = true;
        this._individualAssessmentDetails = details;
        // this.updateAssessment(details);
    }

    @action
    setSavedAssessmentDetails(details:IndividualAssessment) {
        this.saved_assessment_loaded = true;
        this._savedAssessmentDetails = details;
        // this.updateAssessment(details);
    }

    unsetIndiviudalAssessmentDetails() {
        this._individualAssessmentDetails = null;
        this.individual_assessment_loaded = false;
    }

    unsetCheckList(){
        this.checklist_loaded = false;
        this._checklists = null;
    }

    setAssessmentId(id){
        this.assessmentId = id;
    }

    unsetAssessmentId(){
        this.assessmentId = null;
    }

    getCheckData(data){
        if(data){
          this.currentIndex=data;
          return true
        }
        
      }

      @action
      setSelectedImageDetails(imageDetails){
          
              this.selected_preview_url = imageDetails;
      }

      @action
      setChecklistImageDetails(details:Image, url: string, type: string,clause_number,id){
          details['clause_number'] = clause_number;
          details['checklist_id'] = id;
          if(type == 'logo'){
              this._imageDetails = details;
              this.preview_url = url;
          }
          else{
            //   console.log(clause_number);
              if(this._documentDetails.length>0){
                const index: number = this._documentDetails.findIndex(e => e.token == details.token);
                if(index==-1)
                this._documentDetails.push(details);
                
                  
              }
              else
              this._documentDetails.push(details);
              this.preview_url = url;
             
          }
      }

   
    @computed
    get individualAssessmentDetails(): IndividualAssessment {
        return this._individualAssessmentDetails;
    }

       
    @computed
    get savedAssessmentDetails(): IndividualAssessment {
        return this._savedAssessmentDetails;
    }

    @computed
    get checklists():Checklist{
        return this._checklists;
    }

    @action
    unsetProductImageDetails(){
        this.activeFile = null;      
    }

    @action
    setDocumentImageDetails(details:Image){   
            this.activeFile = details;   
    }

    get getDocumentImageDetails(): Image {
        return this._imageDetails;
    }

    


    @computed
    get getDocumentDetails(): Image[]{
        return this._documentDetails.slice();
    }

    @action
    clearChecklistDocuments(){
        this._documentDetails=[];
    }

    @action
    unsetChecklistImageDetails(type: string,token?:string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                this.preview_url = null;
            }
        }
        else{
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        }

       
    }

  



}

export const AssessmentsStore = new Store();