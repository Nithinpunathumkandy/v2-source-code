import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditPlanWorkflowService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan-workflow/am-audit-plan-workflow.service';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { AmAuditableItemService } from 'src/app/core/services/audit-management/am-audit-plan/am-auditable-item/am-auditable-item.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditPlanWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan-workflow.store';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AmAuditableItemStore } from 'src/app/stores/audit-management/am-audit-plan/am-auditable-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;

@Component({
  selector: 'app-am-auditable-item',
  templateUrl: './am-auditable-item.component.html',
  styleUrls: ['./am-auditable-item.component.scss']
})
export class AmAuditableItemComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  AmAuditableItemStore = AmAuditableItemStore;
  AmAuditPlanStore = AmAuditPlansStore;
  AppStore = AppStore;
  NoDataItemStore = NoDataItemStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  processList = [];
  riskList = [];
  objectiveList = [];
  departmentList=[];
  processDeleted = [];
  riskDeleted = [];
  objectiveDeleted = [];
  departmentDeleted=[];
  currentTab = 'process';
  searchText;
  workflowEventSubscription: any;
  historyEventSubscription: any;
  workflowCommentEventSubscription: any;
  workflowModalOpened = false;
  workflowHistoryOpened = false;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  AmAuditPlanWorkflowStore = AmAuditPlanWorkflowStore;

  constructor(
    private _auditableItemService: AmAuditableItemService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _auditPlanWorkflowService: AmAuditPlanWorkflowService,
    private _renderer2: Renderer2,
    private _auditPlansService: AmAuditPlanService,
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_auditable_item' });
    if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900, 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_CREATE')) {
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }

    this.reactionDisposer = autorun(() => {
      if (AmAuditableItemStore.auditableItems?.length > 0) {
        if (AmAuditPlansStore?.individualAuditPlanDetails?.is_workflow_enabled) {


          if (AmAuditPlansStore?.individualAuditPlanDetails?.submitted_by == null && AmAuditPlansStore?.individualAuditPlanDetails?.workflow_items?.length > 0 && AmAuditPlansStore?.individualAuditPlanDetails?.created_by?.id==AuthStore.user.id) {
            var subMenuItems = [
              { activityName: null, submenuItem: { type: 'submit' } },

              { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'refresh' } },
              { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' } },
              { activityName: null, submenuItem: { type: 'workflow' } },
              { activityName: null, submenuItem: { type: 'history' } },
              { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_UPDATE', submenuItem: { type: 'edit_modal' } },
              { activityName: 'EXPORT_AUDITABLE_ITEM', submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans' } },

            ]
          }
          else {
            if (this.isUser() && AmAuditPlansStore?.individualAuditPlanDetails?.submitted_by != null) {
              if (AmAuditPlansStore?.individualAuditPlanDetails?.next_review_user_level == AmAuditPlanWorkflowStore?.workflowDetails[AmAuditPlanWorkflowStore?.workflowDetails?.length - 1]?.level) {
                subMenuItems = [
                  { activityName: null, submenuItem: { type: 'approve' } },
                  { activityName: null, submenuItem: { type: 'revert' } },

                  { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'refresh' } },
                  { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' } },
                  { activityName: null, submenuItem: { type: 'workflow' } },
                  { activityName: null, submenuItem: { type: 'history' } },
                  // { activityName: 'UPDATE_AUDITABLE_ITEM', submenuItem: { type: 'edit_modal' } },
                  { activityName: 'EXPORT_AUDITABLE_ITEM', submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans' } },
                ]
              }
              else if (AmAuditPlansStore?.individualAuditPlanDetails?.next_review_user_level != null && (AmAuditPlansStore?.individualAuditPlanDetails?.next_review_user_level != AmAuditPlanWorkflowStore?.workflowDetails[AmAuditPlanWorkflowStore?.workflowDetails?.length - 1]?.level)) {
                subMenuItems = [
                  { activityName: null, submenuItem: { type: 'review_submit' } },
                  { activityName: null, submenuItem: { type: 'revert' } },

                  { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'refresh' } },
                  { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' } },
                  { activityName: null, submenuItem: { type: 'workflow' } },
                  { activityName: null, submenuItem: { type: 'history' } },
                  // { activityName: 'UPDATE_AUDITABLE_ITEM', submenuItem: { type: 'edit_modal' } },
                  { activityName: 'EXPORT_AUDITABLE_ITEM', submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans' } },
                ]
              }
              else {
                if(AmAuditPlansStore.individualAuditPlanDetails?.am_annual_plan_auditable_item_status?.type=='auditable-item-approved'){
                  subMenuItems = [
                    { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'refresh' } },
                    { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' } },
                    { activityName: null, submenuItem: { type: 'workflow' } },
                    { activityName: null, submenuItem: { type: 'history' } },
                    { activityName: 'EXPORT_AUDITABLE_ITEM', submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans' } },
                  ]
                }
                else{
                  subMenuItems = [
                    { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'refresh' } },
                    { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' } },
                    { activityName: null, submenuItem: { type: 'workflow' } },
                    { activityName: null, submenuItem: { type: 'history' } },
                    { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_UPDATE', submenuItem: { type: 'edit_modal' } },
                    { activityName: 'EXPORT_AUDITABLE_ITEM', submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans' } },
                  ]
                }
               
              }
            }
            else {
              var subMenuItems = [
                { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'refresh' } },
                { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' } },
                { activityName: null, submenuItem: { type: 'workflow' } },
                { activityName: null, submenuItem: { type: 'history' } },
                { activityName: 'EXPORT_AUDITABLE_ITEM', submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans' } },
              ]
            }
          }
        }
        else {

          var subMenuItems = [
            { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'refresh' } },
            { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' } },
            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: null, submenuItem: { type: 'history' } },
            { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_UPDATE', submenuItem: { type: 'edit_modal' } },
            { activityName: 'EXPORT_AUDITABLE_ITEM', submenuItem: { type: 'export_to_excel' } },
            { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans' } },
          ]

        }

      }


      else {
        if(AmAuditPlansStore?.individualAuditPlanDetails?.submitted_by != null){
          var subMenuItems = [

            { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'refresh' } },
            { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' } },
            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: null, submenuItem: { type: 'history' } },
            { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans' } },
  
          ]
        }
        else{
          var subMenuItems = [

            { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'refresh' } },
            { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_LIST', submenuItem: { type: 'search' } },
            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: null, submenuItem: { type: 'history' } },
            { activityName: 'AM_ANNUAL_PLAN_AUDITABLE_ITEM_UPDATE', submenuItem: { type: 'new_modal' } },
            { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans' } },
  
          ]
        }
       
      }




      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.openAuditableItemModal();
            }, 1000);
            break;
          case "edit_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.openAuditableItemModal();
            }, 1000);
            break;

          case 'refresh':
            this.getAuditableItems(1);
            break

          case "export_to_excel":
            this._auditableItemService.exportToExcel();
            break;

          case "search":
            AmAuditableItemStore.searchText = SubMenuItemStore.searchText;

            this.getAuditableItems(1);
            break;

          case 'submit':

            this.submitConfirm();
            break
          case 'approve':

            this.approveAuditPlan();
            break
          case 'review_submit':

            this.approveAuditPlan(true);
            break
          case 'revert':

            this.revertAuditPlan();
            break
          case 'workflow':

            this.openWorkflowPopup();
            break;
          case 'history':

            this.openHistoryPopup();
            break;


          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewAuditableItem();
        this._utilityService.detectChanges(this._cdr);
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    this.workflowEventSubscription = this._eventEmitterService.amAuditPlanWorkflow.subscribe(item => {
      this.closeWorkflowPopup();
    })

    this.historyEventSubscription = this._eventEmitterService.amAuditPlanHistory.subscribe(item => {
      this.closeHistoryPopup();
    })

    this.workflowCommentEventSubscription = this._eventEmitterService.auditPlanWorkflowCommentModal.subscribe(item => {
      this.closeCommentForm();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.getAuditableItems(1);
    this.getWorkflow();

  }

  getWorkflow() {
    this._auditPlanWorkflowService.getItems(AmAuditPlansStore.auditPlanId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  isUser() {
    if (AmAuditPlanWorkflowStore?.loaded) {
      for (let i of AmAuditPlansStore.individualAuditPlanDetails?.workflow_items) {
        if (i.level == AmAuditPlansStore.individualAuditPlanDetails?.next_review_user_level) {
          var pos = i.users.findIndex(e => e.id == AuthStore.user?.id)
          if (pos != -1)
            return true;
          else
            return false
        }
      }
    }
    else {
      return false;
    }

  }

  addNewAuditableItem() {
    this.openAuditableItemModal();
    this._utilityService.detectChanges(this._cdr);
  }

  getAuditableItems(newPage: number = null) {
    AmAuditableItemStore.loaded = false;
    if (newPage) AmAuditableItemStore.setCurrentPage(newPage);
    this._auditableItemService.getAuditableItems().subscribe(res => {


      this._utilityService.detectChanges(this._cdr);
    })
  }


  setInitialData(){
    this.processList=[];
    this.riskList=[];
    this.objectiveList=[];
    this.departmentList=[];
    this._auditableItemService.getAllItems().subscribe(res=>{
      for(let i of res){
        if(i.type=='Process' && i.process_id){
          this.processList.push(i.process_id)
        }
        else if(i.type=='Risk' && i.risk_id){
          this.riskList.push(i.risk_id)
        }
        else if(i.type=='Department' && i.department_id){
          this.departmentList.push(i.department_id)
        }
        else if(i.strategic_objective_id){
          this.objectiveList.push(i.strategic_objective_id)
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getProcesses(newPage: number = null) {
    this.searchText='';
    this.currentTab = 'process';
    if (newPage) AmAuditableItemStore.setProcessCurrentPage(newPage);
    this._auditableItemService.getProcesses().subscribe(res => {
      if (res['data']?.length > 0) {
        for (let i of res['data']) {
          if (i.is_selected) {
            let pos = this.processList.findIndex(e => e == i.id);
            let pos2 = this.processDeleted.findIndex(e => e == i.id);
            if (pos == -1 && pos2 == -1) {
              this.processList.push(i.id);
            }
          }


        }

      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRisks(newPage: number = null) {
    this.searchText='';
    this.currentTab = 'risk';
    if (newPage) AmAuditableItemStore.setRiskCurrentPage(newPage);
    this._auditableItemService.getRisks().subscribe(res => {
      if (res['data']?.length > 0) {
        for (let i of res['data']) {
          if (i.is_selected) {
            let pos = this.riskList.findIndex(e => e == i.id);
            let pos2 = this.riskDeleted.findIndex(e => e == i.id);
            if (pos == -1 && pos2 == -1) {
              this.riskList.push(i.id);
            }
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getDepartments(newPage: number = null) {
    this.searchText='';
    this.currentTab = 'department';
    if (newPage) AmAuditableItemStore.setDepartmentCurrentPage(newPage);
    this._auditableItemService.getDepartments().subscribe(res => {
      if (res['data']?.length > 0) {
        for (let i of res['data']) {
          if (i.is_selected) {
            let pos = this.departmentList.findIndex(e => e == i.id);
            let pos2 = this.departmentDeleted.findIndex(e => e == i.id);
            if (pos == -1 && pos2 == -1) {
              this.departmentList.push(i.id);
            }
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStrategicObjectives(newPage: number = null) {
    this.searchText='';
    this.currentTab = 'objective';

    if (newPage) AmAuditableItemStore.setObjectiveCurrentPage(newPage);
    this._auditableItemService.getStrategicObjectives().subscribe(res => {
      if (res['data']?.length > 0) {
        for (let i of res['data']) {
          if (i.is_selected) {
            let pos = this.objectiveList.findIndex(e => e == i.id);
            let pos2 = this.objectiveDeleted.findIndex(e => e == i.id);
            if (pos == -1 && pos2 == -1) {
              this.objectiveList.push(i.id);
            }
          }


        }

      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  addToProcessList(id, index) {
    let pos = this.processList.findIndex(e => e == id);
    if (pos != -1) {
      this.processList.splice(pos, 1);
      this.processDeleted.push(id);
    }

    else {
      this.processList.push(id);
      let pos2 = this.processDeleted.findIndex(e => e == id);
      if (pos2 != -1) {
        this.processDeleted.splice(pos2, 1)
      }
      }
  }

  addAllProcessToList(event) {
    if (event.target.checked) {
      for (let i of AmAuditableItemStore.processes) {
        let pos = this.processList.findIndex(e => e == i.id);
        if (pos == -1) {
          this.processList.push(i.id)
        }
      }
    }
    else{
      this.processList = [];
    }

  }

  addToDepartmentList(id, index) {
    let pos = this.departmentList.findIndex(e => e == id);
    if (pos != -1) {
      this.departmentList.splice(pos, 1);
      this.departmentDeleted.push(id);
    }

    else {
      this.departmentList.push(id);
      let pos2 = this.departmentDeleted.findIndex(e => e == id);
      if (pos2 != -1) {
        this.departmentDeleted.splice(pos2, 1)
      }
      }
  }

  addAllDepartmentToList(event) {
    if (event.target.checked) {
      for (let i of AmAuditableItemStore.departments) {
        let pos = this.departmentList.findIndex(e => e == i.id);
        if (pos == -1) {
          this.departmentList.push(i.id)
        }
      }
    }
    else{
      this.departmentList = [];
    }

  }

  addAllRiskToList(event) {
    if (event.target.checked) {
      for (let i of AmAuditableItemStore.risks) {
        let pos = this.riskList.findIndex(e => e == i.id);
        if (pos == -1) {
          this.riskList.push(i.id)
        }
      }
    }
    else{
      this.riskList=[];
    }
  }

  addAllObjectiveToList(event) {
    if (event.target.checked) {
      for (let i of AmAuditableItemStore.objectives) {
        let pos = this.objectiveList.findIndex(e => e == i.id);
        if (pos == -1) {
          this.objectiveList.push(i.id)
        }
      }
    }
    else{
      this.objectiveList=[];
    }
  }

  addToRiskList(id, index) {
    let pos = this.riskList.findIndex(e => e == id);
    if (pos != -1) {
      this.riskList.splice(pos, 1);
      this.riskDeleted.push(id);
    }

    else {
      this.riskList.push(id);
      let pos2 = this.riskDeleted.findIndex(e => e == id);
      if (pos2 != -1) {
        this.riskDeleted.splice(pos2, 1)
      }
    }
  }

  addToObjectiveList(id, index) {
    let pos = this.objectiveList.findIndex(e => e == id);
    if (pos != -1) {
      this.objectiveList.splice(pos, 1);
      this.objectiveDeleted.push(id);
    }
 
    else {
      this.objectiveList.push(id);
      let pos2 = this.objectiveDeleted.findIndex(e => e == id);
      if (pos2 != -1) {
        this.objectiveDeleted.splice(pos2, 1)
      }
   }
  }

  isProcessSelected(id) {
    let pos = this.processList.findIndex(e => e == id);
    if (pos != -1) {
      return true
    }
    else
      return false;
  }

  isRiskSelected(id) {
    let pos = this.riskList.findIndex(e => e == id);
    if (pos != -1) {
      return true
    }
    else
      return false;
  }

  isObjectiveSelected(id) {
    let pos = this.objectiveList.findIndex(e => e == id);
    if (pos != -1) {
      return true
    }
    else
      return false;
  }

  isDepartmentSelected(id) {
    let pos = this.departmentList.findIndex(e => e == id);
    if (pos != -1) {
      return true
    }
    else
      return false;
  }

  getAuditableData() {

    let data = {
      'process_ids': [],
      'risk_ids': [],
      'strategic_objective_ids': [],
      'department_ids':[]

    };
    for (let i of this.processList) {
      data.process_ids.push(i);
    }
    for (let i of this.riskList) {
      data.risk_ids.push(i)
    }

    for (let i of this.objectiveList) {
      data.strategic_objective_ids.push(i);
    }
    for (let i of this.departmentList) {
      data.department_ids.push(i)
    }

    return data;

  }


  

  save(close: boolean = false) {

    // this.formErrors = null;
    AppStore.enableLoading();
    let save;
    if (AmAuditableItemStore.auditableItems?.length == 0)
      save = this._auditableItemService.saveAuditableItem(this.AmAuditPlanStore.auditPlanId, this.getAuditableData());
    else
      save = this._auditableItemService.updateAuditableItem(this.AmAuditPlanStore.auditPlanId, this.getAuditableData());

    save.subscribe((res: any) => {
      AppStore.disableLoading();
      this.getAuditPlan();
      // this.closeFormModal();
      this._utilityService.detectChanges(this._cdr)
      if (close) this.closeAuditableItemModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        // this.formErrors = err.error.errors;
        this.closeAuditableItemModal();
      }
      else if (err.status == 500 || err.status == 403) {
        this.closeAuditableItemModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }

  openAuditableItemModal() {
    this.setInitialData();
    this.currentTab='process';
    this.getProcesses(1);
    
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 500);

  }

  closeAuditableItemModal() {
    this.processList = [];
    this.riskList=[];
    this.departmentList=[];
    this.objectiveList=[];
    AmAuditableItemStore.unsetAuditableItemDatas();
    this.currentTab = 'process';
    this.searchText=null;
    $(this.formModal.nativeElement).modal('hide');
  }
  clear() {
    this.searchText = ''
    // this.pageChange(1);
  }
    searchItem(e) {
    let params = '';
    if(this.currentTab=='process'){
      AmAuditableItemStore.setProcessCurrentPage(1);
      this._auditableItemService.getProcesses(false, `q=${this.searchText}` + (params ? params : '')).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    if(this.currentTab=='risk'){
      AmAuditableItemStore.setRiskCurrentPage(1);
      this._auditableItemService.getRisks(false, `q=${this.searchText}` + (params ? params : '')).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    if(this.currentTab=='department'){
      AmAuditableItemStore.setDepartmentCurrentPage(1);
    this._auditableItemService.getDepartments(false, `q=${this.searchText}` + (params ? params : '')).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    if(this.currentTab=='objective'){
      AmAuditableItemStore.setObjectiveCurrentPage(1);
    this._auditableItemService.getStrategicObjectives(false, `q=${this.searchText}` + (params ? params : '')).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
   
  }

  checkFrequency(selected, item_id, frequency_id) {
    if(AmAuditPlansStore.individualAuditPlanDetails?.am_annual_plan_auditable_item_status?.type!='auditable-item-approved' && AmAuditPlansStore.individualAuditPlanDetails?.submitted_by==null){
      if (selected) {
        this._auditableItemService.uncheckFrequency(item_id, frequency_id).subscribe(res => {
          this.getAuditPlan();
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else {
        this._auditableItemService.checkFrequency(item_id, frequency_id).subscribe(res => {
          this.getAuditPlan();
          this._utilityService.detectChanges(this._cdr);
        })
      }
    }
   
  }

  

  getAuditPlan() {
    this._auditPlansService.getItem(AmAuditPlansStore.auditPlanId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }


  modalControl(status: boolean) {
    switch (this.deleteObject.type) {

      case 'Confirm': this.confirmSubmit(status)
        break;
    }
  }

  submitConfirm() {

    this.deleteObject.type = 'Confirm';
    this.deleteObject.subtitle = 'am_auditable_item_submit_confirm';

    $(this.deletePopup.nativeElement).modal('show');
  }

  confirmSubmit(status) {
    if (status && SubMenuItemStore.submitClicked == false) {
      SubMenuItemStore.submitClicked = true;
      this.submitForReview();
      this.clearDeleteObject();
      this._utilityService.detectChanges(this._cdr);
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  submitForReview() {
    this._auditPlanWorkflowService.submitAuditPlan(AmAuditPlansStore.auditPlanId).subscribe(res => {
      this._auditPlansService.getItem(AmAuditPlansStore.auditPlanId).subscribe((res) => {
        SubMenuItemStore.submitClicked = false;
        this._utilityService.detectChanges(this._cdr);
      })
   
    })
   
  }

  openWorkflowPopup() {
    this._auditPlanWorkflowService.getItems(AmAuditPlansStore.auditPlanId).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }
  // Once audit plan is approved, will get more privillage

  approveAuditPlan(type?) {
    if (type) {
      AmAuditPlanWorkflowStore.type = 'submit';
    }
    else
      AmAuditPlanWorkflowStore.type = 'approve';
    AmAuditPlanWorkflowStore.approveText = 'am_auditable_item_approve_text';
    AmAuditPlanWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  
  }

  closeCommentForm() {
    AmAuditPlanWorkflowStore.type = '';
    AmAuditPlanWorkflowStore.approveText = '';
    AmAuditPlanWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

    this._utilityService.detectChanges(this._cdr)
  }

  revertAuditPlan() {
    AmAuditPlanWorkflowStore.type = 'revert';
    AmAuditPlanWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  openHistoryPopup() {
    AmAuditPlanWorkflowStore.setCurrentPage(1);
    this._auditPlanWorkflowService.getHistory(AmAuditPlansStore.auditPlanId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });



  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  closeWorkflowPopup() {

    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }

  setAuditPlanSort(type) {
    this._auditableItemService.sortAuditableItemList(type);
    this.getAuditableItems();
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.workflowEventSubscription.unsubscribe();
    this.historyEventSubscription.unsubscribe();
    this.workflowCommentEventSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    AmAuditableItemStore.searchText = null;
    SubMenuItemStore.searchText = null;
    NoDataItemStore.unsetNoDataItems();

  }



}
