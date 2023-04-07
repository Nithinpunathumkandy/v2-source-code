import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditPlanScheduleService } from 'src/app/core/services/internal-audit/audit-plan-schedule/audit-plan-schedule.service';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { AuditCheckListService } from 'src/app/core/services/masters/internal-audit/audit-check-list/audit-check-list.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuditPlanScheduleMasterStore } from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { AuditCheckListMasterStore } from 'src/app/stores/masters/internal-audit/audit-check-list-store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mstype-checklist-modal',
  templateUrl: './mstype-checklist-modal.component.html',
  styleUrls: ['./mstype-checklist-modal.component.scss']
})
export class MstypeChecklistModalComponent implements OnInit,OnDestroy  {

  @ViewChild('checklistNewPopup', { static: true }) checklistNewPopup: ElementRef;
  @Input('source') CommonChecklistSource: any;
  AuditCheckListStore = AuditCheckListMasterStore;
  AuditableItemMasterStore = AuditableItemMasterStore;
  AuditPlanScheduleMasterStore = AuditPlanScheduleMasterStore;
  checkListArray = [];
  AppStore = AppStore;
  searchTerm;
  newChecklistAddEvent: any;
  form: FormGroup;
  AuthStore = AuthStore;
  MsTypeStore = MsTypeStore;
  
  allChecklists: boolean = false;
  checklistEmptyList = "No Checklists To Show";
  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService:HelperServiceService,
    private _auditableItemService: AuditableItemService,
    private _auditPlanScheduleService: AuditPlanScheduleService,
    private _auditCheckListService: AuditCheckListService,
    private _msTypeService: MstypesService,
    ) { }

  ngOnInit(): void {


    this.form = new FormGroup({});
    this.getMsTypes();
    // calling checklist api
    this.pageChange(1);
    if (this.CommonChecklistSource.type == 'auditableItem') {
      AuditPlanScheduleMasterStore.checkListArray = [];
      AuditPlanScheduleMasterStore.checkListArray = JSON.parse(JSON.stringify(AuditableItemMasterStore.checklistToDisplay));
    } else {
      AuditPlanScheduleMasterStore.checkListArray = [];
      AuditPlanScheduleMasterStore.checkListArray = JSON.parse(JSON.stringify(AuditPlanScheduleMasterStore.checklistToDisplay));
    }
    // add new checklist modal event calling

    this.newChecklistAddEvent = this._eventEmitterService.newChecklistAddModal.subscribe(res => {
      this.closeChild();
    })
  }



  getClauses(ms_type_ids){
    this._auditPlanScheduleService.getClausesByMstypes(ms_type_ids).subscribe()
  }


  getMsTypes() {
    this._msTypeService.getItems(false, "?access_all=true").subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  searchMsType(event) {
    this._msTypeService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditCheckListMasterStore.setCurrentPage(newPage);
    this._auditCheckListService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AuditCheckListMasterStore.loaded) {
        if (AuditPlanScheduleMasterStore.checkListArray.length > 0) {
          AuditCheckListMasterStore.allItems.forEach(element => {
            AuditPlanScheduleMasterStore.checkListArray.forEach(item => {
              if (element.id == item.id) {
                element['is_enabled'] = true;
              }
            });
          });
        } else {
          AuditPlanScheduleMasterStore.checkListArray = [];
        }
        this._utilityService.detectChanges(this._cdr);
      }
    });
  }

  searchInCheckList() {
    AuditCheckListMasterStore.setCurrentPage(1);
    if (this.searchTerm) {
      this._auditCheckListService.getItems(false, `&q=${this.searchTerm}`).subscribe(res => {
        if(res.data.length == 0 ){
          this.checklistEmptyList = "Your search did not match any checklists. Please make sure you typed the checklist name correctly, and then try again.";
        }
        if(AuditPlanScheduleMasterStore.checkListArray.length>0){
          AuditPlanScheduleMasterStore.checkListArray.forEach(element => {
            res.data.forEach(item => {
              if(element.id==item.id){
                item['is_enabled'] = true;
              } else{
                item['is_enabled'] = false;
              }
            });
          });
        }
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.pageChange();
    }
  }

  clearSearchBar() {
    this.searchTerm = null;
    this.pageChange();
  }


  


  selectCheckList(event, checklists, index,clause_number?) {
    var pos = AuditPlanScheduleMasterStore.checkListArray.findIndex(e=>e.id == checklists.id);
    if(pos != -1)
        AuditPlanScheduleMasterStore.checkListArray.splice(pos,1);
    else
    {
      let passParams = {
          ...checklists,
          'clause_number':clause_number

      }
      console.log(passParams)
      AuditPlanScheduleMasterStore.checkListArray.push(passParams);
    }
       
  }
  checkSelectedStatus(id: number){
    var pos = AuditPlanScheduleMasterStore.checkListArray.findIndex(e => e.id == id);
    if(pos != -1) return true;
    else return false;
  }

  checkAll(event) { 
    if (event.target.checked) {
      this.allChecklists = true;
      for(let i of AuditCheckListMasterStore.allItems){
        var pos = AuditPlanScheduleMasterStore.checkListArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          AuditPlanScheduleMasterStore.checkListArray.push(i);}          
      }
    } else {
      this.allChecklists = false;
      for(let i of AuditCheckListMasterStore.allItems){
        var pos = AuditPlanScheduleMasterStore.checkListArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          AuditPlanScheduleMasterStore.checkListArray.splice(pos,1);}    
      }
    }

  }


  addNewCheckList() {

    setTimeout(() => {
      $(this.checklistNewPopup.nativeElement).modal('show');
      this._renderer2.setStyle(this.checklistNewPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);
  }

  closeChild() {
    $(this.checklistNewPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    this.pageChange(1);// refresh the data
  }

  // getSelectedChecklists() {
  //   if (AuditCheckListMasterStore.allItems.length > 0) {
  //     for (let i of AuditCheckListMasterStore.allItems) {
  //       var pos = AuditPlanScheduleMasterStore.checkListArray.findIndex(e => e.id == i.id);
  //       if (i['is_enabled'] == true && pos == -1) {
  //         AuditPlanScheduleMasterStore.checkListArray.push(i);
  //       }
  //       else if (i['is_enabled'] == false && pos != -1) {
  //         AuditPlanScheduleMasterStore.checkListArray.splice(pos, 1);
  //       }
  //     }
  //   }
  // }

  save(close: boolean = false) {

   

    if (this.CommonChecklistSource.type == 'auditableItem') {

      this._auditableItemService.selectRequiredCheckList(AuditPlanScheduleMasterStore.checkListArray);
      this._utilityService.showSuccessMessage('CheckList Selected', 'The selected checklist has been added successfully to the auditable item');
      if (close) this.cancel();

    } else {
      this._auditPlanScheduleService.selectRequiredCheckList(AuditPlanScheduleMasterStore.checkListArray);
      this._utilityService.showSuccessMessage('CheckList Selected', 'The selected checklist has been added successfully to the audit schedule');
      if (close) this.cancel();
    }
  }

  cancel() {
    this._eventEmitterService.dismissAddCheckListModal();
    AuditPlanScheduleMasterStore.checkListArray = [];
    // this._eventEmitterService.dismissNewChecklistAddModal();
  }

  ngOnDestroy() {

    AuditPlanScheduleMasterStore.clearMsTypeClauses();
    this.newChecklistAddEvent.unsubscribe();
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


}
