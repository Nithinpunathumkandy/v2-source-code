import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditPlanReportService } from 'src/app/core/services/ms-audit-management/audit-plan-report/audit-plan-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditPlanReportStore } from 'src/app/stores/ms-audit-management/ms-audit-plan-report/ms-audit-plan-report.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-audit-plan-report',
  templateUrl: './audit-plan-report.component.html',
  styleUrls: ['./audit-plan-report.component.scss']
})
export class AuditPlanReportComponent implements OnInit,OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  deleteEventSubscription: any;
  NoDataItemStore=NoDataItemStore;
  AuditPlanReportStore=AuditPlanReportStore;
  MsAuditPlansStore=MsAuditPlansStore;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
    itemType:''
  };
  dataId:string=null;
  emptyMessage="No Schedules Added";
  constructor(
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _auditPlanReportService:AuditPlanReportService
  ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {   
          case "export_to_excel":
            this._auditPlanReportService.exportToPdf(MsAuditPlansStore.msAuditPlansId);
          break;
          // case "delete":
          //   this.deleteReportConfirm(MsAuditPlansStore.msAuditPlansId)
          //   break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){

        
        if(AuthStore.getActivityPermission(1600,'CREATE_MS_AUDIT_ANNUAL_SUMMARY_REPORT'))
        this.generateReport()
        

        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    //this.getReport()
    this.generateSummary();
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteSummary(status);
        break;
      // case 'Confirm': this.generateSummary(status);
      //   break;
    }
  }

  generateSummary() {
    //if (status) {
      AuditPlanReportStore.clearAuditPlanReport();
      this._auditPlanReportService.generateReport().subscribe(resp => {
        setTimeout(() => {
          this.getReport()
        this._utilityService.detectChanges(this._cdr);
      }, 200);
      // this.closeConfirmationPopup();
      // this.clearPopupObject();
      });
    // }
    // else {
    //   this.closeConfirmationPopup();
    //   this.clearPopupObject();
    // }
  }

  setNoDataText(){
    NoDataItemStore.setNoDataItems({title: "report_nodata_title", subtitle: 'report_nodata_subtitle', buttonText: 'generate_report'});
  }

  setSubMenuItems(){
    var subMenuItems=[];

    if(AuditPlanReportStore.loaded && AuditPlanReportStore.AuditPlanReportDetails){
     
      subMenuItems=
          [ {activityName: '', submenuItem: {type: 'export_to_excel'}},
            //{activityName: 'DELETE_MS_AUDIT_ANNUAL_SUMMARY_REPORT', submenuItem: {type: 'delete'}}
          ]
    
   }
 
  subMenuItems.push({activityName: null, submenuItem: {type: 'close', path:MsAuditPlansStore.path, title : ''}})
  this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
}

getReport(){
  this._auditPlanReportService.getReport().subscribe(res=>{

    this.setSubMenuItems()
    
    this._utilityService.detectChanges(this._cdr);
  })
}

getNoDataSource(type){
  let noDataSource = {
    noData: this.emptyMessage, border: false, imageAlign: type
  }
  return noDataSource;
}

deleteSummary(status: boolean) {
    

  if (status && this.popupObject.id) {

      this._auditPlanReportService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.getReport()
          this._utilityService.detectChanges(this._cdr);
          
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      },(err=>{
        if(err.status == 405)
        {
          this.closeConfirmationPopup();
          this.clearPopupObject();
        }
      })
      );
  
    
  }
  else {
    this.closeConfirmationPopup();
    this.clearPopupObject();
  }
}

generateReport() {
  this.popupObject.type='Confirm';
  this.popupObject.title = 'generate_report';
  this.popupObject.subtitle = 'generate_report_subtitle';
  this._utilityService.detectChanges(this._cdr);
  $(this.confirmationPopUp.nativeElement).modal('show');
}

deleteReportConfirm(id: number) {
  this.popupObject.id = id;
  this.popupObject.type='';
  this.popupObject.title = 'delete_audit_report_title';
  this.popupObject.subtitle = 'common_delete_subtitle';
  this._utilityService.detectChanges(this._cdr);
  $(this.confirmationPopUp.nativeElement).modal('show');
}

closeConfirmationPopup(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
  this.clearPopupObject();
}

clearPopupObject() {
  this.popupObject.id = null;
  this.popupObject.type = '';
  this.popupObject.title = '';
  this.popupObject.subtitle = '';
  this.popupObject.itemType='';
}

getEmployeePopupDetails(users, auth?: string,present?:number) { //user popup

  let userDetails: any = {};
  if (users) {
    userDetails['first_name'] = users?.first_name ? users?.first_name : users?.name;
    userDetails['last_name'] = users?.last_name;
    userDetails['image_token'] = users?.image?.token ? users?.image.token : users?.image_token ? users?.image_token : null;
    userDetails['email'] = users?.email;
    userDetails['mobile'] = users?.mobile;
    userDetails['id'] = users?.id;
    // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
    userDetails['department'] = users?.department;
    userDetails['status_id'] = users?.status_id ? users?.status_id : users?.status.id;
    // userDetails['created_at'] =auth? new Date():null;
    userDetails['designation'] = users?.designation?.title
    userDetails['present'] = present;
  }
  return userDetails;
}
getCreatedByPopupDetails(users, created?:string){
  //console.log(created)
  let userDetial: any = {};
  userDetial['first_name'] = users?.first_name;
  userDetial['last_name'] = users?.last_name;
  userDetial['designation'] = users?.designation?users?.designation?.title:null;
  userDetial['image_token'] = users?.image?.token;
  userDetial['email'] = users?.email;
  userDetial['mobile'] = users?.mobile;
  userDetial['id'] = users?.id;
  userDetial['department'] = users?.department?users?.department?.title:null;
  userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
  userDetial['created_at'] = created? created:null;
  return userDetial;
}

getArrayFormatedString(type,items,languageSupport?){
  let item=[];
  if(languageSupport){
    for(let i of items){
      for(let j of i.language){
        item.push(j.pivot);
      }
    }
    items = item;
  }
  return this._helperService.getArraySeperatedString(',',type,items);
}
setClass(dataId){

  this.scrollbyIndex(dataId)

  if(this.dataId==dataId){
    this.dataId==null
  }
  else
  this.dataId=dataId
  this._utilityService.detectChanges(this._cdr)

}

scrollbyIndex(index) {

  document.getElementById(index).scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
}


ngOnDestroy(){
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  AuditPlanReportStore.clearAuditPlanReport();
  this.deleteEventSubscription.unsubscribe();
  this.clearPopupObject();
  
}

}
