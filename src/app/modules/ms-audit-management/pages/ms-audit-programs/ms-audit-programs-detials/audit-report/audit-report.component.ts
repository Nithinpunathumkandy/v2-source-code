import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { element } from 'protractor';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditProgramReportService } from 'src/app/core/services/ms-audit-management/audit-program-report/audit-program-report.service';
import { AuditReportService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-report/audit-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditProgramReportStore } from 'src/app/stores/ms-audit-management/audit-program-report/audit-program-report.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-audit-program-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.scss']
})
export class AuditProgramReportComponent implements OnInit {


  @ViewChild('agendaForm') agendaForm: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('reportUpdateForm') reportUpdateForm: ElementRef;
  

  AuditProgramReportStore=AuditProgramReportStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  AppStore=AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;

  accordionIntialStorage:any=[]

  defaultItemType=null;
  selectedItemId=null;
  selectedFindingId=null;
  showAgendaFormModal:boolean=false;
  showReportUpdateModal:boolean=false;
  agendaObject={
    type:'add',
    values:null
  }
  reportObject={
    values:null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
    itemType:''
  };


  agendaFormSubscription:any
  deleteEventSubscription: any;
  auditReportFormSubscription:any;
  agendaNoData: boolean=true;

  constructor(
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _auditReportService:AuditProgramReportService
  ) { }



  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {

      this.setSubMenuItems()
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {   
          case "generate_summary":
            this.generateReport();
            break;
          case "delete":
            this.deleteReportConfirm(AuditProgramReportStore.AuditReportDetails.id)
            break;
          case "search":
            AuditProgramReportStore.searchText   = SubMenuItemStore.searchText;
            break;	
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){

        if(this.agendaNoData && AuthStore.getActivityPermission(4100,'CREATE_MS_AUDIT_REPORT_AGENDA')){
          this.agendaObject.type='add'
         this.openAgendaForm()
        }else{
        // Open Report Generate Function
        if(AuthStore.getActivityPermission(1600,'CREATE_MS_AUDIT_ANNUAL_SUMMARY_REPORT'))
        this.generateReport()
        }

        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    this.agendaFormSubscription=this._eventEmitterService.auditReportAgendaModal.subscribe(res=>{
      this.closeAgendaForm()
      this.getReport( AuditProgramReportStore.reportId)
    })

    this.auditReportFormSubscription=this._eventEmitterService.auditProgramReportModal.subscribe(res=>{
      this.closeReportUpdateModal()
      this.getReport(AuditProgramReportStore.reportId)
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.getReport(AuditProgramReportStore.reportId)
  }

  setNoDataText(){
    if(this.agendaNoData)
    NoDataItemStore.setNoDataItems({title: "agenda_nodata_title", subtitle: 'agenda_nodata_subtitle', buttonText: 'create_agenda'});
    else
    NoDataItemStore.setNoDataItems({title: "report_nodata_title", subtitle: 'report_nodata_subtitle', buttonText: 'generate_report'});
  }

  setSubMenuItems(){
    var subMenuItems=[]

    if(AuditProgramReportStore.loaded && AuditProgramReportStore.AuditReportDetails){
      subMenuItems.push(
          {activityName: 'DELETE_MS_AUDIT_ANNUAL_SUMMARY_REPORT', submenuItem: {type: 'delete'}},
    )
  }
  else if(!AuditProgramReportStore.AuditReportDetails && AuditProgramReportStore.loaded){
    subMenuItems.push(
      {activityName: 'CREATE_MS_AUDIT_ANNUAL_SUMMARY_REPORT', submenuItem: {type: 'generate_summary'}},
)
  }
  this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
}

  getReport(id:number){
    this._auditReportService.getReport().subscribe(res=>{

      if(Array.isArray(res)){
        this.agendaNoData=false
        this.setNoDataText()
      }
      else{
        // this.setInitialAccordionStatus(res)
        AuditProgramReportStore.reportId = res?.id
        res?.ms_audit_program_report_content?.forEach(element => {
          if(element.type=='general-information'){
            element?.ms_audit_program_report_content_childrens?.forEach(innerElement => {
                if(innerElement?.audit_agenda?.agenda?.length==0){
                  this.agendaNoData=true;
                  this.setNoDataText()
                }
                else{
                  this.agendaNoData=false;
                }
              
            });
          }
        });
      }

    
      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setInitialAccordionStatus(reportData){
    // let accordionIntialStorage=[]

    reportData.ms_audit_audit_report_content.forEach(element => {

      let accordionObject={
        id:element.id,
        is_accordion_open:false,
        title:element.title
      }

      this.accordionIntialStorage.push(accordionObject)
      // accordionIntialStorage[0].is_accordion_open =false
      
    });

  }

  setAccordionStatus(index){

    this.accordionIntialStorage[index].is_accordion_active=!this.accordionIntialStorage[index].is_accordion_active

    // this.accordionIntialStorage.find(
    //   element=>{
    //     element.id==reportResponseData 
    //   }
    // ).map(element['is_accordion_active']=)

  }

  setSelectedReportItem(reportItemData){

  
    if (reportItemData.id == this.selectedItemId)
    this.selectedItemId = null;
  else {
    this.selectedItemId = reportItemData.id;
    // AssessmentsStore.currentAssessment = docId;
  }
  this.scrollbyIndex(reportItemData.type)

  }


  setSelectedFinding(findingItemData){
    
    if (findingItemData.id == this.selectedFindingId)
    this.selectedFindingId = null;
  else {
    this.selectedFindingId = findingItemData.id;
  }
  }

  setType(type,itemId){
    if(this.selectedItemId==itemId)
    this.selectedItemId=null
    else
    this.selectedItemId=itemId
    this.scrollbyIndex(type)
    if(this.defaultItemType==type)
    this.defaultItemType=null
    else
    this.defaultItemType=type
  }

  // setClass(itemId){  
  //   console.log(itemId)
  //   console.log(this.selectedItemId)

  //   let classParams=''

  //   if(this.selectedItemId==null){
  //     console.log("NO ITEM SELECTED , Default State")
  //     classParams='drop-detail-sec panel-collapse collapse in show'
  //   }
  //   else if(this.selectedItemId==itemId){
  //     console.log("an item is selected and showing details based on that");
  //     classParams='drop-detail-sec panel-collapse collapse in show'
  //   }
  //   else{
  //     console.log("All other cases ,like to show data of no matched id");
  //     classParams='drop-detail-sec panel-collapse collapse'
      
  //   }
    

  //   return classParams
  // }

  scrollbyIndex(index) {

    document.getElementById(index).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  editAgenda(agendaData){
    this.agendaObject.type='edit'
    this.agendaObject.values={
          title:agendaData.title,
          id:agendaData.id,
          ms_type_id:agendaData.ms_type_id,
          start_time:agendaData.start_time,
          team_id:agendaData.team_id
        }
        setTimeout(() => {
              this.openAgendaForm()
            }, 200);

  }

  addAgenda(){
    this.agendaObject.type='add'
    this.agendaObject.values=null
    setTimeout(() => {
      this.openAgendaForm()
    }, 200);
  }


  editReport(reportData){
    this.reportObject.values={
      id:reportData.id,
      description:reportData.description,
    }
    setTimeout(() => {
      this.openReportUpdateModal()
    }, 200);
  }

  openAgendaForm() {
    this.showAgendaFormModal = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.agendaForm.nativeElement).modal('show');
  }

  closeAgendaForm() {
    this.showAgendaFormModal = false;
    $(this.agendaForm.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }

  

  openReportUpdateModal() {
    this.showReportUpdateModal = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.reportUpdateForm.nativeElement).modal('show');
  }

  closeReportUpdateModal() {
    this.showReportUpdateModal = false;
    $(this.reportUpdateForm.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }
  
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteSummary(status);
        break;
      case 'Confirm': this.generateSummary(status);
        break;
    }
  }

  deleteSummary(status: boolean) {
  
    if (status && this.popupObject.id) {

      if(this.popupObject.itemType=='agenda'){
        this._auditReportService.deleteReportAgenda(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this.getReport(AuditProgramReportStore.reportId)
            this._utilityService.detectChanges(this._cdr);
            
          }, 500);
          this.closeConfirmationPopup();
          this.clearPopupObject();
        }
          
        );
      }
      else{
        this._auditReportService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this.getReport(AuditProgramReportStore.reportId)
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
      
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  generateSummary(status: boolean) {
    if (status) {
      AuditProgramReportStore.clearAuditReport();
      this._auditReportService.generateReport().subscribe(resp => {
        AuditProgramReportStore.reportId = resp?.id

        setTimeout(() => {
          
          this.getReport(resp?.id)
        this._utilityService.detectChanges(this._cdr);
      }, 200);
      this.closeConfirmationPopup();
      this.clearPopupObject();
      });
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

  deleteAgendaConfirm(id: number) {
    this.popupObject.id = id;
    this.popupObject.type='';
    this.popupObject.itemType='agenda'
    this.popupObject.title = 'delete_report_agenda_tite';
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

  getCreatedByProcessDetails(users, created?:string){
    let userDetail: any = {};
    userDetail['first_name'] = users?.first_name;
    userDetail['last_name'] = users?.last_name;
    userDetail['designation'] = users?.designation?.title?users.designation.title:users.designation;
    userDetail['image_token'] = users?.image?.token ? users?.image?.token : users?.image_token;
    userDetail['email'] = users?.email;
    userDetail['mobile'] = users?.mobile;
    userDetail['id'] = users?.id;
    userDetail['department'] = users?.department;
    userDetail['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetail['created_at'] = created? created:null;
    return userDetail;

  }

 

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditProgramReportStore.clearAuditReport();
    this.deleteEventSubscription.unsubscribe();
    this.agendaFormSubscription.unsubscribe();
    this.clearPopupObject();
    this.selectedItemId=null;
    this.defaultItemType=null;
  }

}
