import { Component, OnInit,ChangeDetectorRef, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import {CompetencyMatrixService} from 'src/app/core/services/human-capital/competency-matrix/competency-matrix.service'
import {CompetencyMatrixStore} from 'src/app/stores/human-capital/competency-matrix/competency-matrix.store'
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { autorun, IReactionDisposer } from 'mobx';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

declare var $: any;
@Component({
  selector: 'app-competency-matrix',
  templateUrl: './competency-matrix.component.html',
  styleUrls: ['./competency-matrix.component.scss']
})
export class CompetencyMatrixComponent implements OnInit,OnDestroy {
  @ViewChild('trainingDetails', { static: true }) trainingDetails: ElementRef;
  DesignationMasterStore = DesignationMasterStore;
  designation = null;
  UsersStore=UsersStore;
  AuthStore = AuthStore;
  CompetencyMatrixStore = CompetencyMatrixStore;
  reactionDisposer : IReactionDisposer;
  AppStore = AppStore;
  matrixTrainingObject = {
    type:null,
    values: null,
    competency_id: null,
    user_id: null
  }

  modalEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _designationService:DesignationService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _usersService:UsersService,
    private _humanCapitalService: HumanCapitalService,
    private _competencyMatrixService:CompetencyMatrixService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({title: "competency_matrix_message"});
     
    });
    this.getDesignation(true);
    SubMenuItemStore.makeEmpty();

    this.modalEventSubscription = this._eventEmitterService.trainingMatrixDetails.subscribe(res => {
      this.closeFormModal();
    });

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.trainingDetails.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.trainingDetails.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.trainingDetails.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.trainingDetails.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.trainingDetails.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.trainingDetails.nativeElement,'overflow','auto');
      }
    })
  }

  findCompetencyGroupIndex(groupId: number) {
    let pos = CompetencyMatrixStore.competencyMatrix?.competencies.findIndex(e => e.competency_group_id==groupId)
    return pos
  }

  closeFormModal(){
    $(this.trainingDetails.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._renderer2.setStyle(this.trainingDetails.nativeElement, 'display', 'none');
    this._utilityService.detectChanges(this._cdr);
  }

  columnClass(index) {
    let m = index;
    if(m>=0){
      let className = 'column';
      className = className+(m+1);
      return className
    }
  }

  getDesignation(initial:boolean=false) {
   
    this._designationService.getItems(false,'access_all=true&is_full_list=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(initial){
        this.designation = res['data'][0].id;
        this.listUsers(this.designation)
      }
      else if(this.designation==null){
        NoDataItemStore.setNoDataItems({title: "competency_matrix_message"});
      }
     
    });
  }

  searchDesignation(e) {
    this._designationService.getItems(false,'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  listUsers(event){
    CompetencyMatrixStore.unsetCompetencyMatrix();
    NoDataItemStore.setNoDataItems({title: "competency_matrix_empty_list"});
    if(event){
      this.listCompetencies(event);
      this._usersService.getItemByDesignation(event).subscribe(res=>{
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 200);
        
      })
    }
  }

  setTraining(marks , user_id){
    this.matrixTrainingObject.user_id = user_id
    this.matrixTrainingObject.competency_id = marks.competency_id
    this._competencyMatrixService.getTrainingMatrixDetails(this.matrixTrainingObject.user_id,this.matrixTrainingObject.competency_id).subscribe((res)=>{
      this._utilityService.detectChanges(this._cdr)
    });
    $(this.trainingDetails.nativeElement).modal('show');
    this._renderer2.setStyle(this.trainingDetails.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.trainingDetails.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.trainingDetails.nativeElement,'overflow','auto');
    this._utilityService.detectChanges(this._cdr);
  }

  listCompetencies(id){
    this._designationService.getCompetencies(id).subscribe(res=>{
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 200);
    })

    this._competencyMatrixService.getCompetencyMatrix(id).subscribe(res=>{
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 200);
    })
  }

  
  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  competencyPresent(group_id, competency_id, mark_index) {
    if (CompetencyMatrixStore.competencyMatrix.competencies[mark_index].id == competency_id && CompetencyMatrixStore.competencyMatrix.competencies[mark_index].competency_group_id == group_id)
      return true;
    else
      return false;
  }

  ngOnDestroy(){
    CompetencyMatrixStore.unsetCompetencyMatrix();
    SubMenuItemStore.makeEmpty();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.modalEventSubscription.unsubscribe();
  }

}
