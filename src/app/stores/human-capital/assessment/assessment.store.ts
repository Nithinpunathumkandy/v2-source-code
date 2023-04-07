import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Assessment,AssessmentResult, AssessmentPaginationResponse, Result, UserAssessment, LastAssessment } from 'src/app/core/models/human-capital/assessment/assessment';
import { CompetencyMasterStore } from 'src/app/stores/masters/human-capital/competency-master.store';

class Store {

  @observable
  private _assessment_list: Assessment[] = [];


  @observable
  currentPage: number = 1;

  @observable
  itemsPerPage: number = null;

  @observable
  totalItems: number = null;

  @observable
  orderBy: 'asc' | 'desc' = 'desc';

  @observable
  orderItem: string = 'assessment-date';

  @observable
  assessment_loaded: boolean = false;

  @observable
  result_loaded: boolean = false;

  @observable
  total_result_loaded: boolean = false;

  @observable
  result: any[] = [];

  @observable
  answered: any[] = [];

  @observable
  assessment_started: boolean = false;

  @observable
  user_selected: boolean = false;

  @observable
  total_score: number = 0;

  @observable
  currentDate = new Date();

  @observable
  assessmentResult:AssessmentResult = null;

  @observable
  assessmentId:number=null;

  @observable
  userAssessments:UserAssessment[]=[];

  @observable
  user_assessment_loaded: boolean = false;
  
  @observable
  searchText: string;

  @action
  setAssessments(response: AssessmentPaginationResponse) {

    this._assessment_list = response.data;
    this.currentPage = response.current_page;
    this.itemsPerPage = response.per_page;
    this.totalItems = response.total;
    this.assessment_loaded = true;
  }

  @action
  unsetAssessments() {

    this._assessment_list = [];
    this.assessment_loaded = false;
  }

  @action
  setUserAssessments(response:UserAssessment[]){
    this.userAssessments=response;
    this.user_assessment_loaded = true;
  }

  @action
  unsetUserAssessments(){
    this.userAssessments=[];
    this.user_assessment_loaded = false;
  }

  @action
  setResult(response:AssessmentResult){
    this.total_result_loaded=true;
    this.assessmentResult = response;
    
  }

  @action
  setCurrentPage(current_page: number) {
    this.currentPage = current_page;
  }

  @action
  setOrderBy(order_by: 'asc' | 'desc') {
    this.orderBy = order_by;
  }

  get totalResult(){
    return this.assessmentResult;
  }

  @action
  setAssessmentResult(gIndex,index, competency) {
    if(!this.result[gIndex]){
      this.result[gIndex]=[];
    }
    this.result[gIndex][index]=[];
    let answer_duplicated=false;
    this.result[gIndex][index] = competency;
    this.result_loaded = true;
    for(let i=0;i<this.answered.length;i++){
      if(this.answered[i].competency_id==competency.competency_id){
        this.answered[i]=competency;
        answer_duplicated=true;
      }
    }
   
    if(!answer_duplicated)
      this.answered.push(competency);
  }

  getByCompetency(group){
    let total=0;
    for(let i of this.result){

        for (let j of i){
          if(j.competency_id==group.competency_id)
            total=total+j.score;
        }
      
    }
    return total;

  }

  @action
  unsetAssessmentResult() {
    this.result = [];
    this.answered=[];
    AssessmentStore.total_score = 0;
  }

  @action
  setAssessmentStarted() {

    this.assessment_started = true;
  }

  @action
  unsetAssessmentStarted() {
    this.assessment_started = false;
  }

  @action
  setUserSelected() {

    this.user_selected = true;
  }

  @action
  unsetUserSelected() {
    this.user_selected = false;
  }

  @action
  setResultArray() {
    for(let i=0;i<CompetencyMasterStore.competencies.length;i++){
      this.result[i]={ competency_id: null, score: null };
    }
  }
  



  @computed
  get assessments(): Assessment[] {

    return this._assessment_list;
  }

  @computed
  get userAssessment(): UserAssessment[]{
    return this.userAssessments['details'];
  }

  @computed
  get lastAssessment(): LastAssessment{
    return this.userAssessments['last_assessment'];
  }








}

export const AssessmentStore = new Store();