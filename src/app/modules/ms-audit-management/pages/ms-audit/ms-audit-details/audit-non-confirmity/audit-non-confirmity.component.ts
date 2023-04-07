import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
import { AuditNonConfirmityService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.service';
import { MsAuditService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $:any;

@Component({
  selector: '',
  templateUrl: './audit-non-confirmity.component.html',
  styleUrls: ['./audit-non-confirmity.component.scss']
})
export class AuditNonConfirmityComponent implements OnInit,OnDestroy {
  @ViewChild('nonConformity') nonConformity : ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  reactionDisposer: IReactionDisposer;
  AuditNonConfirmityStore = AuditNonConfirmityStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsAuditSchedulesStore=MsAuditSchedulesStore;
  MsAuditStore=MsAuditStore;
  
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  nonConformityObject = {
    value : null,
    type : '',
    component : 'audit'
  }
  controlNonConiformitySubscriptionEvent: any;
  popupControlEventSubscription: any;
  selectedIndex:number;

  constructor(   private _utilityService: UtilityService,   
    private _cdr: ChangeDetectorRef,
    private _router:Router,
    private _helperService: HelperServiceService,
    private _eventEmitterService : EventEmitterService,
    private _auditNonConfirmityService : AuditNonConfirmityService,
    private _msAuditSchedulesService: MsAuditSchedulesService,
    private _msAuditService: MsAuditService,
    private _renderer2: Renderer2,) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {  
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.getScheduleDetailsInfo(true);
            break;
          // case "template":
          //   this._projectService.generateTemplate();
          //   break;
          // case "export_to_excel":
          //   this._projectService.exportToExcel();
          //   break;
          //   case "import":
          //     this._projectService.importToExcel();
          //     break;
          case "search":
            AuditNonConfirmityStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1); 
            break;
            case 'refresh':
              AuditNonConfirmityStore.loaded = false
              this.pageChange(1); 
              break
            case "user_grid_system":
              if(SubMenuItemStore.userGridSystem){
                // this.gridView = true
              }
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.getScheduleDetailsInfo(true);
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.controlNonConiformitySubscriptionEvent = this._eventEmitterService.msAuditNonConformity.subscribe(res => {
      this.closeNonConfirmityModal();
      this.pageChange(1)
   })
   this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
  })
  //this.pageChange(1)
  this.getMsAudit();
  }

  setSubmenu(){

    let subMenuItems=[];

     if(this.isAuditors()||this.isAuditLeader() || AuthStore.isRoleChecking('super-admin')){
      
        if(MsAuditStore?.individualMsAuditDetails?.ms_audit_plan?.ms_auditschedules.length && MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_status?.type=='audited')
          {
            NoDataItemStore.setNoDataItems({title:"ms_audit_no_data_findings", subtitle: 'common_nodata_subtitle',buttonText: 'add_new_findings'});
          }
          else
          {
            NoDataItemStore.setNoDataItems({title:"ms_audit_no_data_findings", subtitle: 'common_nodata_subtitle',buttonText: null});
          }
          if(MsAuditStore?.individualMsAuditDetails?.ms_audit_plan?.ms_auditschedules.length && 
            MsAuditSchedulesStore.individualMsAuditSchedulesDetails?.schedule_status?.type=='audited')
          {
            subMenuItems = [
              {activityName: "MS_AUDIT_FINDING_LIST", submenuItem: {type: 'search'}},
              {activityName: "MS_AUDIT_FINDING_LIST", submenuItem: {type: 'refresh'}},
              {activityName:  "CREATE_MS_AUDIT_FINDING", submenuItem: {type: 'new_modal'}},
              { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
            ]
          }
          else
          {
            subMenuItems = [
              {activityName: "MS_AUDIT_FINDING_LIST", submenuItem: {type: 'search'}},
              {activityName: "MS_AUDIT_FINDING_LIST", submenuItem: {type: 'refresh'}},
              //{activityName:  "CREATE_MS_AUDIT_FINDING", submenuItem: {type: 'new_modal'}},
              { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
            ]
          }
    }else{
      subMenuItems = [
        {activityName: "MS_AUDIT_FINDING_LIST", submenuItem: {type: 'search'}},
        {activityName: "MS_AUDIT_FINDING_LIST", submenuItem: {type: 'refresh'}},
        { activityName: null, submenuItem: { type: 'close', path: '/ms-audit-management/ms-audits' } }
      ]
      NoDataItemStore.setNoDataItems({title: "ms_audit_no_data_findings", subtitle: null,buttonText: null});
  
    }

    if(!AuthStore.getActivityPermission(3700,"CREATE_MS_AUDIT_FINDING")){
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
    this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
  }

  isAuditors(){
    if(MsAuditStore.individualMsAuditDetails?.auditors?.length>0){
      return MsAuditStore.individualMsAuditDetails?.auditors?.find(element=>element?.id==AuthStore.user?.id)
    }else{
      return false;
    }
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

  isResponsibleUsers(responsibleUserIds){
    let array=[];
    if(responsibleUserIds){
      array=responsibleUserIds.split(',');
      return array.find(element=>element==AuthStore.user?.id);
    }else{
      return false;
    }
  }

  getScheduleDetails(id)
  {
    MsAuditSchedulesStore.setMsAuditSchedulesId(id);
    this.getScheduleDetailsInfo(false);
    this.pageChange(1)
  }

  getScheduleDetailsInfo(val){
    this._msAuditSchedulesService.getItem(MsAuditSchedulesStore?.msAuditSchedulesId).subscribe(res => {
      if(val)
      {
        this.nonConformityObject.type = 'Add';
        this.nonConformityObject.value = null; // for clearing the value
        this.openNonConfirmityModal();
      }
      this.setSubmenu();
    this._utilityService.detectChanges(this._cdr);
    });
  }

  getMsAudit()
      {
        this._msAuditService.getItem(MsAuditStore.msAuditId).subscribe
          (res=>{
          //this.selectedScheduleId=res?.ms_audit_plan?.ms_auditschedules[0].id;
          if(res?.ms_audit_plan?.ms_auditschedules.length)
          {
            MsAuditSchedulesStore.setMsAuditSchedulesId(res?.ms_audit_plan?.ms_auditschedules[0].id);
            this.getScheduleDetailsInfo(false);
            this.pageChange(1);
            
          }
           
        });
      }

  
  isAuditLeader(){
    return MsAuditStore.individualMsAuditDetails?.ms_audit_plan?.lead_auditor?.id==AuthStore.user?.id;
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditNonConfirmityStore.setCurrentPage(newPage);
      this._auditNonConfirmityService.getItems(false,`&ms_audit_schedule_ids=${MsAuditSchedulesStore.msAuditSchedulesId}`).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._auditNonConfirmityService.sortList(type, null);
    this.pageChange();
  }

  

   openNonConfirmityModal(){
    setTimeout(() => {
      $(this.nonConformity.nativeElement).modal('show');
      this._renderer2.setStyle(this.nonConformity.nativeElement,'display','block');
      this._renderer2.setStyle(this.nonConformity.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.nonConformity.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);

    }, 100);
   }

   closeNonConfirmityModal(){
    $(this.nonConformity.nativeElement).modal('hide');
    this.nonConformityObject.type = null;
    this.nonConformityObject.value = null
    this._utilityService.detectChanges(this._cdr);
  }

  edit(id:number){
    event.stopPropagation();
    this._auditNonConfirmityService.getIndividualCheckList(id).subscribe(res=>{
      this.nonConformityObject.type = "Edit";
      this.nonConformityObject.value = res;
      this.openNonConfirmityModal();
      this._utilityService.detectChanges(this._cdr);

    })
  }
/*commented */
  // getDetails(id){
  //   AuditNonConfirmityStore.setmsAuditNonConfirmityId(id);
  //   this._router.navigateByUrl(`ms-audit-management/ms-audits/${MsAuditStore.msAuditId}/non-confirmity/${id}`);
  //   AuditNonConfirmityStore.setPath('non-confirmity');
  //   BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
  //   BreadCrumbMenuItemStore.makeEmpty();
  //   BreadCrumbMenuItemStore.addBreadCrumbMenu({
  //     name:"non_conformity",
  //     path:'non-confirmity'
  //   });
  // }

  getDetails(id){
    AuditNonConfirmityStore.setmsAuditNonConfirmityId(id);
    AuditNonConfirmityStore.nonConfirmityRedirect=true;
    this._router.navigateByUrl(`ms-audit-management/findings/${id}`);
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
          name:"non_conformity",
          path:'non-confirmity'
        });
  }



  deleteNonConfirmity(id:number){
    event.stopPropagation();
          this.popupObject.type = 'are_you_sure';
          this.popupObject.id = id;
          this.popupObject.title = 'are_you_sure';
          this.popupObject.subtitle = 'it_will_remove_the_non_conformity_from_the_audit';
          this._utilityService.detectChanges(this._cdr);
          $(this.confirmationPopUp.nativeElement).modal('show');
      
  }

      // modal control event
      modalControl(status: boolean) {
        switch (this.popupObject.type) {
          case 'are_you_sure': this.deleteNonConfirmityItem(status)
            break;
        }
    
      }
    
        // delete function call
        deleteNonConfirmityItem(status: boolean) {
          if (status && this.popupObject.id) {
            this._auditNonConfirmityService.deleteNonConfirmity(this.popupObject.id).subscribe(resp => {
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

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlNonConiformitySubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    MsAuditSchedulesStore.unSetMsAuditSchedules();
    MsAuditSchedulesStore.unsetIndividualMsAuditSchedulesDetails();
  }

}
