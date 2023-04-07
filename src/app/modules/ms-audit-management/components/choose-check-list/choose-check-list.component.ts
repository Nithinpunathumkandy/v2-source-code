import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditChecklistGroupService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-cheklist-group/ms-audit-cheklist-group.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { MsAuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit-check-list/ms-audit-check-list.service';
import { AuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-check-list/audit-check-list.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuditChecklistGroupMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-checklist-group-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { AuditCheckListStore } from 'src/app/stores/ms-audit-management/audit-check-list/audit-check-list.store';
import { MsAuditCheckListStore } from 'src/app/stores/ms-audit-management/ms-audit-check-list/ms-audit-check-list.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';

@Component({
  selector: 'app-choose-check-list',
  templateUrl: './choose-check-list.component.html',
  styleUrls: ['./choose-check-list.component.scss']
})
export class ChooseCheckListComponent implements OnInit {
  @Input('source') checkListPopupSource : any;
  MsAuditCheckListStore = MsAuditCheckListStore;
  AuditChecklistGroupMasterStore = AuditChecklistGroupMasterStore;
  DepartmentMasterStore=DepartmentMasterStore;
  NoDataItemStore=NoDataItemStore;
  AppStore = AppStore
  selectedCheckListIds: any = [];
  form: FormGroup;
  formErrors: any;
  is_all : boolean = false

  constructor(private  _eventEmitterService : EventEmitterService,
    private _msAuditCheckLIstService : MsAuditCheckListService,
    private _cdr: ChangeDetectorRef,private _helperService: HelperServiceService,
    private _utilityService: UtilityService,private _auditService : AuditCheckListService,
    private _auditChecklistGroupService: AuditChecklistGroupService,
    private _formBuilder: FormBuilder,
    private _departmentService: DepartmentService,
    ) { }

  ngOnInit(): void { 
    this.form = this._formBuilder.group ({
       title : null,
       department_ids:[[]]
    })
    this.pageChange(1);
    this.getCheckGroupList();
    this.setInitialData()
  }

  getCheckGroupList(){
    this._auditChecklistGroupService.getItems(false, null).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  searchDepartment(event) {
    this._departmentService.getItems(true,'?q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  checkAll(event){
    if(MsAuditCheckListStore.msAuditChecckLists.length > 0){
      for(let data of MsAuditCheckListStore.msAuditChecckLists){
        if(event.target.checked){
          this.selectedCheckListIds.push(data.id)
          data.is_selected = 1
        }else {
          this.selectedCheckListIds = [];
          data.is_selected = 0
        }
      }
    }
  }

  getDepartment() {
    this._departmentService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  checkedItems(id:number){
    if(MsAuditCheckListStore.msAuditChecckLists.length > 0){
      // for(let data of MsAuditCheckListStore.msAuditChecckLists){
        let pos = this.selectedCheckListIds?.findIndex(e=>e == id)
        if(pos != -1)
          return true;
        else 
          return false;
      // }
    }
  }

  searchChecklistGroup(e) {
    this._auditChecklistGroupService.getItems(false,'?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setInitialData(){
    this.selectedCheckListIds = [];
    this.selectedCheckListIds = this.checkListPopupSource.slectedIds
    // if(MsAuditCheckListStore.msAuditChecckLists.length > 0){
    //   for(let data of MsAuditCheckListStore.msAuditChecckLists ){
    //     if(data.is_selected == 1){
    //       this.selectedCheckListIds.push(data.id)
    //     }
    //   }
    // }
  }


  pageChange(newPage: number = null) {
    if (newPage) MsAuditCheckListStore.setCurrentPage(newPage)
    let params = '&ms_audit_id='+MsAuditStore.selectedMsAuditId
    params = params+'&list=true'
    // params = params+'&is_all=true'
    if(this.form.value.department_ids.length)
    {
      params=params+'&department_ids='+this.getById(this.form.value.department_ids);
    }
    if(this.form.value.title)
      params = params + '&checklist_group_ids='+this.form.value.title
    this._msAuditCheckLIstService.getItems(false,params).subscribe(
      
      () => setTimeout(() => this.setSubNoData(),100)
      );
  }

  setSubNoData()
  {
    if(MsAuditCheckListStore.msAuditChecckLists.length==0)
    {
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
    }
    
  }

  searchCheckList(event){
    if(event.target.value){
      MsAuditCheckListStore.searchText = event.target.value
      this.pageChange();
    }else {
      MsAuditCheckListStore.searchText = ''
     this.pageChange(1);
    }

  }

  getById(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push(i.id);
    }
    return item;

  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean = false) {
    let saveData = {
      checklist_ids : this.selectedCheckListIds,
      process_id : AuditCheckListStore.selectedProcessId
    }
    let save;
    AppStore.enableLoading();
  
    if (this.checkListPopupSource.type == 'Edit') {
       save = this._auditService.updateCheckList(saveData,this.checkListPopupSource.values.id);
    } else {
      // delete this.form.value.id
      save = this._auditService.saveCheckList(saveData);
    }
  
    save.subscribe((res: any) => {
      if (this.checkListPopupSource.type != 'Edit') {
        // this.resetForm();
      }
      this.selectedCheckListIds =  []
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.cancel();
    }, (err: HttpErrorResponse) => {
      this.selectedCheckListIds =  []
      if (err.status == 422) {
        // this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
  
    });
  
  }

  changeCheckList(list,index){
   if(this.selectedCheckListIds.length > 0){
     let pos = this.selectedCheckListIds.findIndex(e => e == list.id)
     if(pos != -1){
       this.selectedCheckListIds.splice(pos,1)
       MsAuditCheckListStore.msAuditChecckLists[index].is_selected = 0

     }else {
       this.selectedCheckListIds.push(list.id)
       MsAuditCheckListStore.msAuditChecckLists[index].is_selected = 1
     }
   }else {
     this.selectedCheckListIds.push(list.id)
     MsAuditCheckListStore.msAuditChecckLists[index].is_selected = 1

   }
  }

  checkedCheckList(list){
   let pos = this.selectedCheckListIds.findIndex(e => e == list.id)
   if (pos != -1) 
   return true;
   else return false;
  }

  cancel(){
    this._eventEmitterService.dismissAuditChooseCheckListModal()
  }

  ngOnDestroy(){
    MsAuditCheckListStore.searchText = ''
    this.selectedCheckListIds =  []
  }

}
