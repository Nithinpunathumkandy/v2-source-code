import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from "src/app/stores/app.store";
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { RiskRatingService } from 'src/app/core/services/masters/external-audit/risk-rating/risk-rating.service';
import { ProcessCategoryMasterStore } from 'src/app/stores/masters/bpm/prcoess-category.master.store';
import { ProcessCategoriesService } from 'src/app/core/services/masters/bpm/process-categories/process-categories.service';
import { ProcessGroupsMasterStore } from 'src/app/stores/masters/bpm/process-groups-master.store';
import { ProcessGroupsService } from 'src/app/core/services/masters/bpm/process-groups/process-groups.service';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { FormGroup } from '@angular/forms';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-import-process-modal',
  templateUrl: './import-process-modal.component.html',
  styleUrls: ['./import-process-modal.component.scss']
})
export class ImportProcessModalComponent implements OnInit {
  @Input('source') CommonImportProcessSource: any;

  AppStore = AppStore;
  ProcessStore = ProcessStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  ProcessCategoryMasterStore = ProcessCategoryMasterStore;
  ProcessGroupsMasterStore = ProcessGroupsMasterStore;
  processArray=[];
  riskRatingId;
  processCategoryId;
  processGroupId;
  formErrors;
  searchTerm;
  form: FormGroup;
  allProcesses:boolean = false;

  importProcessEmptyList = "No Processes To Show";
  constructor(private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _auditableItemSerice: AuditableItemService,
    private _processGroupService: ProcessGroupsService,
    private _router:Router,
    private _helperService:HelperServiceService,
    private _auditProgramService: AuditProgramService,
    private _riskRatingService: RiskRatingService,
    private _processCategoryService: ProcessCategoriesService,
    private _processService: ProcessService,) { }

  ngOnInit(): void {

    this.form = new FormGroup({});
    // calling process api
    this.pageChange(1);

    // calling other apis
    this.getRiskRating();
    this.getProcessCategories();
    this.getProcessGroup();

    // make array empty for new entry
    this.processArray = [];
  }

  // page change event
  pageChange(newPage: number = null) {
    let params = "";
    params= `&auditable_item=true`;
    if (newPage) ProcessStore.setCurrentPage(newPage);
    this._processService
      .getAllItems(false,params)
      .subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
  }

  // for getting audit risk rating
  getRiskRating() {

    this._riskRatingService.getAllItems().subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })

  }

  // getting process category
  getProcessCategories(){
    this._processCategoryService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // getting process group
  getProcessGroup(){
    this._processGroupService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // search process category
  searcProcessCategory(e){
    this._processCategoryService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // search process group
  searcProcessGroup(e){
    this._processGroupService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }



  // process sort function
  sortProcesses() {
    var params = '';
    if (this.riskRatingId) {
      if (params)
        params = params + `&risk_rating_ids=${this.riskRatingId}&auditable_item=true`;
      else
        params = `&risk_rating_ids=${this.riskRatingId}&auditable_item=true`;
    }

    if (this.processCategoryId) {
      if (params)
        params = params + `&process_category_ids=${this.processCategoryId}&auditable_item=true`;
      else
        params = `&process_category_ids=${this.processCategoryId}&auditable_item=true`;
    }

    if (this.processGroupId) {
      if (params)
        params = params + `&process_group_ids=${this.processGroupId}&auditable_item=true`;
      else
        params = `&process_group_ids=${this.processGroupId}&auditable_item=true`;
    }

    // go back to initial state when no filters applied
    if(this.processGroupId==null&& this.processCategoryId==null && this.riskRatingId==null){
      this.pageChange(1);
    } else {
    this._processService.getAllItems(false, params).subscribe(res => {
      if(res.data.length == 0){
        this.importProcessEmptyList = "Your search did not match any processes. Please make sure you typed the Process name correctly, and then try again.";
      }
      this._utilityService.detectChanges(this._cdr);
    });
   }
  }


  // search process function
  searchProcess(){
    ProcessStore.setCurrentPage(1);
    let params = "";
    params= `&auditable_item=true`;
    if (this.searchTerm) {
      this._processService.getAllItems(false, `&q=${this.searchTerm}`+params).subscribe(res => {
        if(res.data.length == 0){
          this.importProcessEmptyList = "Your search did not match any processes. Please make sure you typed the Process name correctly, and then try again.";
        }
        this._utilityService.detectChanges(this._cdr);
      });
    } else{
      this.pageChange();
    }
  }

  clearSearchBar(){
    this.searchTerm = '';
    this.pageChange();
  }

  // process selecting function
  selectProcessses(event,process, index) {
    var pos = this.processArray.findIndex(e=>e.id == process.id);
    if(pos != -1)
        this.processArray.splice(pos,1);
    else
        this.processArray.push(process);
  }



  // for checking all checkox
  checkAll(event) {
    if (event.target.checked) {
      this.allProcesses = true;
      for(let i of ProcessStore.processList){
        var pos = this.processArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.processArray.push(i);}          
      }
    } else {
      this.allProcesses = false;
      for(let i of ProcessStore.processList){
        var pos = this.processArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.processArray.splice(pos,1);}    
      }
    }

  }

  checkSelectedStatus(id: number){
    var pos = this.processArray.findIndex(e => e.id == id);
    if(pos != -1) return true;
    else return false;
  }



  // close modal function
  closeModal(){
    this._eventEmitterService.dismissImportProcessModal();
    this._eventEmitterService.dismissNewImportProcessModal();
    this.processArray = [];
    this.pageChange(1);// calling for redreshing the list
  }

  // cancel function
  cancel() {
    
    AppStore.disableLoading();
    this.closeModal();
  }


  // getSelectedProcessses(){
  //   if (ProcessStore.processList.length>0){
  //   for (let i of ProcessStore.processList){
  //     if(i['is_enabled']==true){
  //       this.processArray.push(i);} else {
  //         var pos = this.processArray.findIndex(e => e.id == i.id);
  //         if (pos != -1)
  //           this.processArray.splice(pos, 1);
      
  //       }
  //   }
  // }
  
  // }

  // processing data for save function
  processSaveData(){
    
    if (this.processArray.length>0){
      var ProcessArray=[];
      for (let i of this.processArray){
        ProcessArray.push(i.id);
      }
      var items= {

        "process_ids": ProcessArray
      }
     return items;
    }
  }

  // save function
  save(close: boolean = false){
   

    if(this.processArray.length == 0){
      this._utilityService.showErrorMessage('Error!','Please Select One Process Atleast');
    } else {

    this.formErrors = null;
    if (this.processArray.length>0) {
      let save;
      AppStore.enableLoading();
  
      if(this.CommonImportProcessSource.type=='Process'){

        save = this._auditProgramService.saveImportedProcesses(this.CommonImportProcessSource.values.id,this.processSaveData())
      } else {
        save = this._auditableItemSerice.saveImportProcess(this.processSaveData());}
      
      save.subscribe((res: any) => {
       
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if(this.CommonImportProcessSource.type=='Process'){
          this._router.navigateByUrl("/internal-audit/audit-programs/"+this.CommonImportProcessSource.values.id+"/auditable-items");
        } else {
        this._router.navigateByUrl("/internal-audit/auditable-items");}
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
   }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
