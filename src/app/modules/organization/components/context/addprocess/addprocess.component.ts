import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { Processes } from "src/app/core/models/bpm/process/processes";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { AppStore } from "src/app/stores/app.store";

import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";

import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import{ RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';

import { ProcessCategoriesService } from "src/app/core/services/masters/bpm/process-categories/process-categories.service";
import { ProcessCategoryMasterStore } from "src/app/stores/masters/bpm/prcoess-category.master.store";

import { ProcessGroupsService } from "src/app/core/services/masters/bpm/process-groups/process-groups.service";
import { ProcessGroupsMasterStore } from "src/app/stores/masters/bpm/process-groups-master.store";

import { ProcessService } from "src/app/core/services/bpm/process/process.service";
import { ProcessStore } from "src/app/stores/bpm/process/processes.store";
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-addprocess',
  templateUrl: './addprocess.component.html',
  styleUrls: ['./addprocess.component.scss']
})
export class AddprocessComponent implements OnInit {
  @Input('processModalTitle')processModalTitle: any; 
  @Input('title') title:boolean=false;
  
  reactionDisposer: IReactionDisposer;
  ProcessesStore = ProcessStore;
  selectedProcesses:Processes[] = [];
  RisksStore = RisksStore;
  AppStore = AppStore;
  DepartmentStore = DepartmentMasterStore;
  RiskratingMasterStore = RiskRatingMasterStore;
  ProcessCategoryMasterStore = ProcessCategoryMasterStore;
  ProcessGroupsMasterStore = ProcessGroupsMasterStore;

  department_ids = null;
  issueRatingsId = null;
  process_category_id = null;
  process_group_id = null;
  searchTerm = null;
  processEmptyList = "no_processes";
  checkSelectAll: boolean = false;
  loader:boolean = false;
  constructor(private _processesService: ProcessService, private _utilityService: UtilityService,
    private _helperService:HelperServiceService,
     private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService,
     private _departmentService: DepartmentService, private _ristRatingsService: RiskRatingService,
     private _processCategoryService: ProcessCategoriesService, private _processGroupService: ProcessGroupsService) { }

  ngOnInit(): void {
    //this.pageChange(1);
    this._ristRatingsService.getItems().subscribe(res=>{
    });
    this.selectedProcesses = JSON.parse(JSON.stringify(ProcessStore.selectedProcessesList));
    this.loader = false;
    // this.getProcessCategories();
    if(this.processModalTitle?.department_id)
    {
      this.department_ids=this.processModalTitle?.department_id;
    }
    this.pageChange(1);
    this.getProcessGroups();
  }

  pageChange(currentPage){
    this.checkSelectAll = false;
    if(currentPage) ProcessStore.currentPage = currentPage; 
    this._processesService.getAllItems(false,this.generateSortParams()).subscribe(res=>{
      setTimeout(() => {
        document.getElementById('selectall')['checked'] = false;
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    });
  }

  selectProcesses(processes){
    var pos = this.selectedProcesses.findIndex(e=>e.id == processes.id);
    if(pos != -1)
        this.selectedProcesses.splice(pos,1);
    else
        this.selectedProcesses.push(processes);
  }

  save(close: boolean = false){
    ProcessStore.saveSelected = true;
    this.loader = true;
    this._processesService.selectRequiredProcesses(this.selectedProcesses);
    let title = this.processModalTitle?.component ? this.processModalTitle?.component : 'item'
    if(this.selectedProcesses.length > 0) this._utilityService.showSuccessMessage('processes_selected',"mapped_success");
    setTimeout(() => {
      this.loader = false;
      this._utilityService.detectChanges(this._cdr);
    }, 2000);
    if(close) this.cancel();
  }

  cancel(){
    ProcessStore.setCurrentPage(1);
    if(ProcessStore.saveSelected){
      this._eventEmitterService.dismissProcessesModal();
    }
    else{
      ProcessStore.saveSelected = false;
      this._eventEmitterService.dismissProcessesModal();
    }
    
    
  }

  searchDepartment(e){
    this._departmentService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDepartment(){
    this._departmentService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchProcessCategories(e){
    this._processCategoryService.getItems(false,'q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getProcessCategories(){
    this._processCategoryService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getProcessGroups(){
    this._processGroupService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchProcessGroups(e){
    this._processGroupService.getItems(false,'q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  sortProcesses(){
    var params = this.generateSortParams();
    this._processesService.getAllItems(false,params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchProcesses(){
    // if(this.searchTerm){
      ProcessStore.setCurrentPage(1);
      var searchParams = this.generateSortParams();
      this._processesService.getAllItems(false,searchParams).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    // }
  }

  setProcessSort(type) {
    // ProcessStore.setCurrentPage(1);
    this._processesService.sortProcessList(type,this.generateSortParams());
    this.pageChange(1)

  }

  generateSortParams(){
    var params = '';
    if(this.department_ids) params = `&department_ids=${this.department_ids}`;
    if(this.issueRatingsId){
      // if(params)
        params = params + `&risk_rating_ids=${this.issueRatingsId}`;
      // else
      //   params = `?risk_rating_ids=${this.issueRatingsId}`;
    }
    if(this.process_category_id){
      // if(params)
        params = params + `&process_category_ids=${this.process_category_id}`;
      // else
      //   params = `?process-categories=${this.process_category_id}`;
    }
    if(this.process_group_id){
      // if(params)
        params = params + `&process_group_ids=${this.process_group_id}`;
      // else
      //   params = `?process_group_ids=${this.process_group_id}`;
    }
    if(this.searchTerm){
      ProcessStore.currentPage = 1;
      params = params + `&q=${this.searchTerm}`;
    }
    if(RisksStore.currentRiskPage =='treatment'){
      params=params+'&exclude='+this.getIds(this.selectedProcesses);
    }

      // params = params ? params + `&q=${this.searchTerm}` : `?q=${this.searchTerm}`
    return params;
  }

  getIds(process){
    // console.log(process);
    let ids=[];
    for(let i of process){
      ids.push(i.id);
    }
    // console.log(ids);
    return ids;
  }

  checkProcessesPresent(processes){
    var pos = this.selectedProcesses.findIndex(e=>e.id == processes.id);
    if(pos != -1)
        return true;
    else
        return false;
  }

  selectAll(event){
    // if(event.target.checked){
    //   this.selectedProcesses = ProcessStore.processList;
    // }
    // else{
    //   this.selectedProcesses = [];
    // }
    if (event.target.checked) {
      this.checkSelectAll = true;
      for(let i of ProcessStore.processList){
        // this.selectCriteria(i,false)
        var pos = this.selectedProcesses.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedProcesses.push(i);}          
      }
    } else {
      this.checkSelectAll = false;
      for(let i of ProcessStore.processList){
        // this.selectCriteria(i);
        var pos = this.selectedProcesses.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedProcesses.splice(pos,1);}    
      }
    }
  }

  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  clear(){
    this.searchTerm = null;
  }

  ratingsSelected(){
    console.log(this.issueRatingsId);
  }

}
