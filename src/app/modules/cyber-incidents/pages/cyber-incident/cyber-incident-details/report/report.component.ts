import { Component, OnInit,ChangeDetectorRef,ElementRef,ViewChild,OnDestroy, Renderer2} from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { AnnualPlanByAuditorComponent } from 'src/app/modules/internal-audit/loaders/annual-plan-by-auditor/annual-plan-by-auditor.component';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { CyberReportStore } from 'src/app/stores/cyber-incident/cyber-incident-report';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit,OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('conclusion') conclusion: ElementRef;
  AuthStore=AuthStore;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  AppStore=AppStore;
  SubMenuItemStore=SubMenuItemStore;
  NoDataItemStore=NoDataItemStore;
  CyberIncidentStore=CyberIncidentStore;
  CyberReportStore=CyberReportStore;
  deleteEventSubscription:any;
  reactionDisposer: IReactionDisposer;
  accordionIntialStorage:any=[];
  selectedItemId=null;
  defaultItemType:AnnualPlanByAuditorComponent;
  commentObject = {
    values: null,
    type: null
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
    itemType:''
  };
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    file_name:null,
    file_type:'',
    created_at: "",
    component: "",
    componentId: null,
  };
  previewSubscriptionEvent:any;
  commentSubscriptionEvent:any;
  constructor(
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cyberIncidentService:CyberIncidentService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      //this.setNoDataText();
      this.setSubMenuItems()
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {   
          case "generate_report":
            this.generateReport();
            break;
          case "export_to_excel":
            this._cyberIncidentService.exportToPdf(CyberIncidentStore?.incidentId);
          break;
          case "delete":
            this.deleteReportConfirm(2)
            break;
          case "search":
            CyberReportStore.searchText   = SubMenuItemStore.searchText;
            break;	
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      console.log(NoDataItemStore.clikedNoDataItem)
      if(NoDataItemStore.clikedNoDataItem){
       
        // Open Report Generate Function
        this.generateReport()
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });
    this.previewSubscriptionEvent = this._eventEmitterService.cyberIncidentFilePreview.subscribe(res => {
      this.closePreviewModal();
    })

    this.commentSubscriptionEvent = this._eventEmitterService.cyberIncidentReportConclusionModal.subscribe(res => {
      this.closeFormModal();
    })
   
    this.getReport()
  }

 

  setSubMenuItems(){
    console.log(CyberReportStore.CyberReportDetails)
    console.log(CyberReportStore.loaded)
    var subMenuItems=[]
    if(CyberReportStore.loaded && CyberReportStore.CyberReportDetails){
      subMenuItems=[{activityName: '', submenuItem: {type: 'export_to_excel'}}]
    //   subMenuItems.push(
    //       {activityName: '', submenuItem: {type: 'delete'}},
    // )
  }
  else if(!CyberReportStore.CyberReportDetails && !CyberReportStore.loaded){
    subMenuItems.push(
      {activityName: '', submenuItem: {type: 'generate_report'}});
  }
 
  subMenuItems.push(
    {activityName: '', submenuItem: {type: 'close',path: "../" }}),
    
  this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
}

getReport(){
 
  this._cyberIncidentService.getReport().subscribe(res=>{
    CyberReportStore.loaded=true;
    if(res?.data?.length)
    {
       this.getReportDetails();
    }
    else
    {
      this.setNoDataText()
    }

    this._utilityService.detectChanges(this._cdr);
  })
}
getReportDetails()
{
  this._cyberIncidentService.getReportDetails().subscribe(res=>{
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

scrollbyIndex(index) {

  document.getElementById(index).scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
}

modalControl(status: boolean) {
  console.log(status)
  switch (this.popupObject.type) {
    case '': this.deleteSummary(status);
      break;
    case 'Confirm': this.generateSummary(status);
      break;
  }
}

generateSummary(status: boolean) {
  if (status) {
    CyberReportStore.clearCyberReport();
    this._cyberIncidentService.generateReport().subscribe(resp => {
      setTimeout(() => {
        this.getReport()
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
deleteSummary(status: boolean) {
    

  if (status && this.popupObject.id) {
      this._cyberIncidentService.deleteReport(this.popupObject.id).subscribe(resp => {
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
getArrayFormatedString(type,items){
      
  return this._helperService.getArraySeperatedString(',',type,items);
}
clearPopupObject() {
  this.popupObject.id = null;
  this.popupObject.type = '';
  this.popupObject.title = '';
  this.popupObject.subtitle = '';
  this.popupObject.itemType='';
}

getCreatedByProcessDetails(users, created?:string){
  let userDetails: any = {};
  if(users){
    userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
    userDetails['last_name'] = users?.last_name;
    userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
    userDetails['email'] = users?.email;
    userDetails['mobile'] = users?.mobile;
    userDetails['id'] = users?.id;
    // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
    userDetails['department'] = users?.department?.title?users?.department?.title:users?.department;
    userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
    userDetails['created_at'] = created? created:null;
    userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
  }
  console.log(userDetails)
return userDetails;

}
setNoDataText(){
  
  NoDataItemStore.setNoDataItems({title: "report_nodata_title",  buttonText: 'generate_report'});
}

createImageUrl(type, token) {
  if (type == 'document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
  else
    return this._cyberIncidentService.getThumbnailPreview(type, token);
}

viewBrochureItem(type, documents, documentFile) {

  switch (type) {
    case "document-version":
      this._documentFileService
        .getFilePreview(type, documents.document_id, documentFile.id)
        .subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            documents.title
          );
          this.openPreviewModal(type, resp, documentFile, documents);
        }),
        (error) => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage(
              "Error",
              "Permission Denied"
            );
          } else {
            this._utilityService.showErrorMessage(
              "Error",
              "Unable to generate Preview"
            );
          }
        };
      break;

    case 'cyber_incident':
      this._cyberIncidentService.getPreview('cyber_incident', documents.cyber_incident_id, documentFile).subscribe(res => {
        var resp: any = this._utilityService.getDownLoadLink(res, documents.title);
        this.openPreviewModal(type, resp, documents, documentFile);
      }), (error => {
        if (error.status == 403) {
          this._utilityService.showErrorMessage('error', 'permission_denied');
        }
        else {
          this.openPreviewModal(type, null, documents, documentFile);
        }
      });
      break;

      case "corrective-action":
        this._cyberIncidentService.getPreview(type, documents.cyber_incident_corrective_action_id, documents.id).subscribe(res => {
          var resp: any = this._utilityService.getDownLoadLink(res, documents.title);
          this.openPreviewModal(type, resp, documents, documents);
        }), (error => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage('Error', 'permission_denied');
          }
          else {
            this._utilityService.showErrorMessage('Error', 'unable_to_generate_preview');
          }
        });
        break;

    default:
      break;
  }


}
checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
}
downloadDocumentFile(type, document, docs?) {
  event.stopPropagation();
  switch (type) {
    case "cyber_incident":
      this._cyberIncidentService.downloadFile(
        document.cyber_incident_id,
        type,
        document.id,
        null,
        document.title,
        document
      );
      break;
    case "corrective-action":
      this._cyberIncidentService.downloadFile(document.cyber_incident_corrective_action_id, 'corrective-action', null, document.id, null, document);
      break;
    case "document-version":
      this._documentFileService.downloadFile(
        type,
        document.document_id,
        docs.id,
        null,
        document.title,
        docs
      );
      break;
  }
}

  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type;

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = documentFiles.id;
      
      this.previewObject.uploaded_user = document?.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }
  closePreviewModal($event?) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }
  
  editReport(data) {
    this.commentObject.type = 'Add';
    this.commentObject.values = data; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();

  }
  closeFormModal() {
    setTimeout(() => {
      $(this.conclusion.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this._renderer2.removeClass(this.conclusion.nativeElement, 'show');
    this._renderer2.setStyle(this.conclusion.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.conclusion.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.conclusion.nativeElement, 'overflow', 'none');
    this.commentObject.type = null;
    this.commentObject.type = '';
  }

  openFormModal() {
    setTimeout(() => {
      $(this.conclusion.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.conclusion.nativeElement, 'show');
    this._renderer2.setStyle(this.conclusion.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.conclusion.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.conclusion.nativeElement, 'overflow', 'auto')
  }
  
  removeDot(data){
    return data.split('-')[0];
  }
ngOnDestroy(){
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  this.previewSubscriptionEvent.unsubscribe();
  this.commentSubscriptionEvent.unsubscribe();
  CyberReportStore.clearCyberReport();
  this.deleteEventSubscription.unsubscribe();
  //this.clearPopupObject();
  this.selectedItemId=null;
  this.defaultItemType=null;
}

}
