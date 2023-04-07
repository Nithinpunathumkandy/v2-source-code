  import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, ViewChild,OnDestroy } from '@angular/core';
  import { autorun, IReactionDisposer } from 'mobx';
  import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
  import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
  import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
  import { AuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-check-list/audit-check-list.service';
  import { MsAuditService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit.service';
  import { UtilityService } from 'src/app/shared/services/utility.service';
  import { AppStore } from 'src/app/stores/app.store';
  import { AuthStore } from 'src/app/stores/auth.store';
  import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
  import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
  import { AuditCheckListStore } from 'src/app/stores/ms-audit-management/audit-check-list/audit-check-list.store';
  import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
  import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';

  declare var $:any;
  @Component({
    selector: 'app-audit-check-list',
    templateUrl: './audit-check-list.component.html',
    styleUrls: ['./audit-check-list.component.scss']
  })
  export class AuditCheckListComponent implements OnInit,OnDestroy {
    @ViewChild('addAnswer') addAnswer : ElementRef;
    @ViewChild('viewAnswers') viewAnswers : ElementRef;
    @ViewChild('chooseChecklist') chooseChecklist : ElementRef;
    @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
    @ViewChild('formModal') formModal: ElementRef;

    msAuditChecklistObject = {
      values: null,
      type: null,
      component : 'audit'
    };
    addAnswerPopup = {
      type : null,
      value : null
    }

    viewAnswerPopup = {
      type : null,
      value : null
    }

    chooseCheckListObject = {
      type : null,
      value : null,
      slectedIds : []
    }
    popupObject = {
      type: '',
      title: '',
      id: null,
      subtitle: ''
    };

    reactionDisposer: IReactionDisposer;
    controlChooseCheckListSubscriptionEvent: any;
    controlAddAnswerSubscriptionEvent: any;
    AuditCheckListStore =AuditCheckListStore;
    AppStore = AppStore;
    AuthStore = AuthStore;
    MsAuditStore = MsAuditStore;
    popupControlEventSubscription: any;
    controlMsAuditCheckListSubscriptionEvent: any;
    selectedIndex: any = null;
    selectedIndexMsType:any=null;
    MsAuditSchedulesStore=MsAuditSchedulesStore;
  

    constructor(
      private _utilityService: UtilityService,   
      private _cdr: ChangeDetectorRef,
      private _helperService: HelperServiceService,
      private _eventEmitterService : EventEmitterService,
      private _auditService : AuditCheckListService,
      private _renderer2: Renderer2,
      private _msAuditService: MsAuditService,
      private _msAuditSchedulesService: MsAuditSchedulesService
      ) { }

    ngOnInit(): void {
    this.reactionDisposer = autorun(() => {    
      //this.setSubMenu();

        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "new_modal":
              this.getDetails()
              break;
            case "search":
              AuditCheckListStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1); 
              break;
              case 'refresh':
                AuditCheckListStore.loaded = false
                this.pageChange(1); 
                break
              case "user_grid_system":
                if(SubMenuItemStore.userGridSystem){
                }
                break;
            default:
              break;
          }
          // Don't forget to unset clicked item immediately after using it
          SubMenuItemStore.unSetClickedSubMenuItem();
        } 
        if(NoDataItemStore.clikedNoDataItem){
          //this.getDetails();
          this.selectedIndex = null
          NoDataItemStore.unSetClickedNoDataItem();
        }
      });
        this.controlChooseCheckListSubscriptionEvent = this._eventEmitterService.msAuditChooseCheckList.subscribe(res => {
          this.closeCheckListModal();
          this.pageChange(1)

        })

      this.controlMsAuditCheckListSubscriptionEvent = this._eventEmitterService.msAuditCheckList.subscribe(res => {
        this.closeCheckListFormModal();
        this.pageChange(1)
      })

      this.controlAddAnswerSubscriptionEvent = this._eventEmitterService.msAuditAddAnswerCheckList.subscribe(res => {
        this.closeFormModal();
        this.pageChange(1)
      })

      this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
      //this.pageChange(this.selectedChecklistId)
      this.getMsAudit();
    }

      setSubMenu(){
        let subMenuItems=[];
         if(this.isAuditors()||this.isAuditLeader() || AuthStore.isRoleChecking('super-admin')){
          // subMenuItems = [
          //   {activityName: "MS_AUDIT_CHECKLIST_LIST", submenuItem: {type: 'search'}},
          //   {activityName: "MS_AUDIT_CHECKLIST_LIST", submenuItem: {type: 'refresh'}},
          //   // {activityName:  "CREATE_MS_AUDIT_CHECKLIST", submenuItem: {type: 'new_modal'}},
          //   // { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
          // ]
          if(MsAuditStore?.individualMsAuditDetails?.ms_audit_plan?.ms_auditschedules.length)
          {
          
            NoDataItemStore.setNoDataItems({title:"ms_audit_no_data_checklist",});
          }
          else
          {
            NoDataItemStore.setNoDataItems({title:"ms_audit_no_data_checklist", subtitle: null,buttonText: null});
          }
          if(MsAuditStore?.individualMsAuditDetails?.ms_audit_plan?.ms_auditschedules.length)
          {
            subMenuItems = [
              {activityName: "MS_AUDIT_CHECKLIST_LIST", submenuItem: {type: 'search'}},
              {activityName: "MS_AUDIT_CHECKLIST_LIST", submenuItem: {type: 'refresh'}},
              //{activityName:  "CREATE_MS_AUDIT_CHECKLIST", submenuItem: {type: 'new_modal'}},
              { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
            ]
          }
          else
          {
            subMenuItems = [
              {activityName: "MS_AUDIT_CHECKLIST_LIST", submenuItem: {type: 'search'}},
              {activityName: "MS_AUDIT_CHECKLIST_LIST", submenuItem: {type: 'refresh'}},
              //{activityName:  "CREATE_MS_AUDIT_CHECKLIST", submenuItem: {type: 'new_modal'}},
              { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
            ]
          }
          
         }else{
          subMenuItems = [
            {activityName: "MS_AUDIT_CHECKLIST_LIST", submenuItem: {type: 'search'}},
            {activityName: "MS_AUDIT_CHECKLIST_LIST", submenuItem: {type: 'refresh'}},
            { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
          ]
          NoDataItemStore.setNoDataItems({title:"ms_audit_no_data_checklist", subtitle: null,buttonText: null});

        }
        
        if(!AuthStore.getActivityPermission(3700,"CREATE_MS_AUDIT_CHECKLIST")){
          NoDataItemStore.deleteObject('subtitle');
          NoDataItemStore.deleteObject('buttonText');
        }
        this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      }
      getMsAudit()
      {
        this._msAuditService.getItem(MsAuditStore.msAuditId).subscribe
          (res=>{
          //this.selectedScheduleId=res?.ms_audit_plan?.ms_auditschedules[0].id;
          if(res?.ms_audit_plan?.ms_auditschedules.length)
          {
            MsAuditSchedulesStore.setMsAuditSchedulesId(res?.ms_audit_plan?.ms_auditschedules[0].id);
            this.getDetails();
            this.pageChange(1);
            
          }
          this.setSubMenu();
        });
      }

      readMore(index,type,event)
      {
        event.stopPropagation();
        if(type=="more")
        {
          this.selectedIndex=index
        }
        else{
          this.selectedIndex=null;
        }
        
      }

      readMoreMsType(index,type,event)
      {
        event.stopPropagation();
        if(type=="more")
        {
          this.selectedIndexMsType=index
        }
        else{
          this.selectedIndexMsType=null;
        }
        
      }
      
    isAuditors(){
      
      if(MsAuditStore.individualMsAuditDetails?.auditors?.length>0){
        if(MsAuditStore.individualMsAuditDetails?.auditors?.find(element=>element?.id==AuthStore.user?.id)){
          return true;
        }else {
          return false;
        }
      }else{
        return false;
      }
    }

    isAuditLeader(){
      
      if(MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.lead_auditor?.id==AuthStore.user?.id){
        return true;
      }else{
        return false;
      }
    }

    addAnswerCheck(){
      if(this.isAuditors()){
        return false;
      }else if(this.isAuditLeader()){
        return false;
      }else{
        return true;
      }
    }

    getScheduleDetails(id)
    {
      MsAuditSchedulesStore.setMsAuditSchedulesId(id);
      this.getDetails();
      this.pageChange(1)
    }

    answerAdd(event,data){
      event.stopPropagation();
      this._auditService.getCheckListDetails(data.id).subscribe(res=>{
        AuditCheckListStore.is_view_answer = data.is_view_answer
        this.addAnswerPopup.type = 'Add';
        this.addAnswerPopup.value = res;
        this._utilityService.detectChanges(this._cdr);
        this.openFormModel();
      })
    }
    
    openFormModel(){
        $(this.addAnswer.nativeElement).modal('show');
        this._renderer2.setStyle(this.addAnswer.nativeElement, 'display', 'block');
        this._renderer2.setStyle(this.addAnswer.nativeElement, 'z-index', 99999);
        this._renderer2.setStyle(this.addAnswer.nativeElement, 'overflow', 'auto');
        this._utilityService.detectChanges(this._cdr);
    }

    closeFormModal(){
      $(this.addAnswer.nativeElement).modal('hide');
      this.addAnswerPopup.type = null;
      this._renderer2.setStyle(this.addAnswer.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.addAnswer.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.addAnswer.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }

    viewAnswer(data){
      this._auditService.getCheckListDetails(data.id).subscribe(res=>{
      this.viewAnswerPopup.type = 'Add';
      this.viewAnswerPopup.value = res;
      this._utilityService.detectChanges(this._cdr);
      this.openViewFormModel();
      })
    }

    openViewFormModel(){
      $(this.viewAnswers.nativeElement).modal('show');
      this._renderer2.setStyle(this.viewAnswers.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.viewAnswers.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.viewAnswers.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }

    closeViewFormModal(){
      $(this.viewAnswers.nativeElement).modal('hide');
      this.viewAnswerPopup.type = null;
      this._renderer2.setStyle(this.viewAnswers.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.viewAnswers.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.viewAnswers.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }

    chooseCheckList(){
      this.chooseCheckListObject.type = 'Add';
      this.chooseCheckListObject.value = null;
      this._utilityService.detectChanges(this._cdr);
      this.openCheckListModel();
    }

    openCheckListModel(){
      setTimeout(() => {
        $(this.chooseChecklist.nativeElement).modal('show');
        this._renderer2.setStyle(this.chooseChecklist.nativeElement,'display','block');
        this._renderer2.setStyle(this.chooseChecklist.nativeElement,'overflow','auto');
        this._renderer2.setStyle(this.chooseChecklist.nativeElement,'z-index',99999);
        this._utilityService.detectChanges(this._cdr);

      }, 100);
    }

    closeCheckListModal(){
      $(this.chooseChecklist.nativeElement).modal('hide');
      this.chooseCheckListObject.type = null;
      this.chooseCheckListObject.slectedIds = []
      this._renderer2.setStyle(this.chooseChecklist.nativeElement, 'display', 'none');
      this._renderer2.setStyle(this.chooseChecklist.nativeElement, 'z-index', 9);
      this._renderer2.setStyle(this.chooseChecklist.nativeElement, 'overflow', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }
    
    pageChange(newPage: number = null) {
      if (newPage) AuditCheckListStore.setCurrentPage(newPage);
        this._auditService.getItems(false).subscribe((res) => {
          setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)});
    
      }
    

    sortTitle(type: string) {
      this._auditService.sortProjects(type, SubMenuItemStore.searchText);
      this.pageChange()
    }

    deleteCheckList(id:number){
      event.stopPropagation();
        this.popupObject.type = 'are_you_sure';
        this.popupObject.id = id;
        this.popupObject.title = 'are_you_sure';
        this.popupObject.subtitle = 'ms_audit_checklist_delete_message';
        this._utilityService.detectChanges(this._cdr);
        $(this.confirmationPopUp.nativeElement).modal('show');
    }

    // modal control event
    modalControl(status: boolean) {
        switch (this.popupObject.type) {
          case 'are_you_sure': this.deleteProject(status)
            break;
        }
    }
    // delete function call
    deleteProject(status: boolean) {
      if (status && this.popupObject.id) {
        this._auditService.deleteCheckList(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.pageChange(1)
          this.clearPopupObject();
        });
      }
      else {
        this.clearPopupObject();
      }
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
  
    }

    clearPopupObject() {
      this.popupObject.id = null;
    }

    // addNewItem() {
    //   console.log(MsAuditSchedulesStore.individualMsAuditSchedulesDetails)
      
    // }

    getDetails(){
      this._msAuditSchedulesService.getItem(MsAuditSchedulesStore?.msAuditSchedulesId).subscribe(res => {
      //   this.msAuditChecklistObject.type = 'Add';
      // this.msAuditChecklistObject.values = MsAuditSchedulesStore.individualMsAuditSchedulesDetails; // for clearing the value
      // this._utilityService.detectChanges(this._cdr);
      // this.openFormModal();
      this._utilityService.detectChanges(this._cdr);
      });
    }
  
    openFormModal() {
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 50);
      this._utilityService.detectChanges(this._cdr);
    }
  
    closeCheckListFormModal() {
      $(this.formModal.nativeElement).modal('hide');
      this.msAuditChecklistObject.type = null;
      this._utilityService.detectChanges(this._cdr);
    }
    selectedIndexChange(index,id:number){
      AuditCheckListStore.checkListLoaded = false;
      this.chooseCheckListObject.slectedIds = []
      if(this.selectedIndex == index){
        this.selectedIndex = null;
        AuditCheckListStore.setselectedProcessId();
      } else{
        this.selectedIndex = index;
        AuditCheckListStore.setselectedProcessId(index, id)
        this._utilityService.detectChanges(this._cdr);
        this.getCheckLists(id)
      }
    }

    getCheckLists(id:number){
      let params = '?process_id='+id
      this._auditService.getCheckListList(params).subscribe((res) => {
        if(res['data'].length > 0){
          for(let ids of res['data']){
            if(ids.checklist_id){
              this.chooseCheckListObject.slectedIds.push(ids.checklist_id)
            }
          }
        }
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)})
    }

    ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      AuditCheckListStore.loaded = false;
      this.controlChooseCheckListSubscriptionEvent.unsubscribe();
      this.controlAddAnswerSubscriptionEvent.unsubscribe();
      this.controlMsAuditCheckListSubscriptionEvent.unsubscribe();
      this.popupControlEventSubscription.unsubscribe();
      AuditCheckListStore.unsetselectedProcessId();
      MsAuditSchedulesStore.unSetMsAuditSchedules();
      MsAuditSchedulesStore.unsetIndividualMsAuditSchedulesDetails();
    }

  }
