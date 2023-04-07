import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-event-closure-report',
  templateUrl: './event-closure-report.component.html',
  styleUrls: ['./event-closure-report.component.scss']
})
export class EventClosureReportComponent implements OnInit , OnDestroy {

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  reactionDisposer: IReactionDisposer;
  EventsStore = EventsStore
  AppStore=AppStore
  AuthStore=AuthStore  
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore
  emptyMessage="No documents added";
  dataId:string=null

  constructor(
    private _eventsService: EventsService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _sanitizer: DomSanitizer,
    private _eventFileService: EventFileServiceService,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _helperService: HelperServiceService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [        
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      setTimeout(() => {
        NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_lesson_learnt' });
      }, 300);

      if (NoDataItemStore.clikedNoDataItem) {        
        NoDataItemStore.unSetClickedNoDataItem();
      }

      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          
          case "export_to_excel":
          this._eventsService.exportToExcelFile();
          break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    this.getEventDetails(EventsStore.selectedEventId)
    console.log(this.EventsStore?.eventDetails?.event_scopes)
  }

  getEventDetails(id){
    this._eventsService.getItem(id).subscribe(res=>{
      // this.filterArray()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // filterArray(){
  //   EventsStore?.eventDetails?.event_scopes.forEach(element => {
  //     if(element.type=='scope'){
  //       EventsStore.scopeArray.push(element)
  //     }else if(element.type=='exclusion'){
  //       EventsStore.exclusionArray.push(element)
  //     }else{
  //       EventsStore.assumptionsArray.push(element)
  //     }
  //   });
  // }

  getGrandTotalBudget(){
    let total = 0
    if(EventsStore.eventDetails?.event_budgets.length > 0){
      EventsStore.eventDetails?.event_budgets.map(data=>{
        total = Number(total) + Number(data.amount)
      })
    }
    return total.toFixed(2)
  }

  getTotalActualCost(){
    let total = 0
    if(EventsStore.eventDetails?.event_budgets.length > 0){
      for(let data of EventsStore.eventDetails?.event_budgets){
          total = total + Number(data.actual_amount)
      }
    }
    return total.toFixed(2)
  }

  changeValues(department) {
    if (department.length >0) {
      return this._helperService.getArrayProcessed(department, 'title').toString();
    }
    else {
      return 'NA';
    }
  }

  //user popup box objects
  getUser(users, created?: string) {
    let userDetail: any = {};
    userDetail['first_name'] = users?.first_name;
    userDetail['last_name'] = users?.last_name;
    if(created){
      userDetail['designation'] = users?.designation;
    }else{
      userDetail['designation'] = users?.designation?.title;
    }    
    userDetail['image_token'] = users?.image?.token;
    userDetail['email'] = users?.email;
    userDetail['mobile'] = users?.mobile;
    userDetail['id'] = users?.id;
    userDetail['department'] = users?.department;
    userDetail['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetail['created_at'] = created ? created : null;
    return userDetail;
  }

  createPreviewUrl(type, token) {
    return this._eventFileService.getThumbnailPreview(type, token)
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  // Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._eventFileService.getThumbnailPreview(type, token);
  }

  
// extension check function
checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
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

    case 'event-file':
      this._eventFileService.getFilePreview('event-file', documents.incident_id, documentFile).subscribe(res => {
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

    default:
      break;
  }


}

downloadDocumentFile(type, document, docs?) {
  event.stopPropagation();
  switch (type) {
    case "event-file":
      this._eventFileService.downloadFile(
        type,
        document.incident_id,
        document.id,
        null,
        document.title,
        document
      );
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
      this.previewObject.componentId = documentFiles.incident_id;
      
      this.previewObject.uploaded_user = EventsStore.eventDetails.created_by;
      this.previewObject.created_at = document.created_at;
      // $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  getArrayProcessed(arrayType) {
    if (typeof arrayType === 'object') {
      return this._helperService.getArrayProcessed(arrayType, 'title').toString();
    }
    else {
      return arrayType;
    }
  }

  checkRiskType(objectType) {
    if (typeof objectType === 'object') {
      let e;
      e = this._helperService.getArrayProcessed(objectType, 'is_external').toString();
      if (e === "1") {
        return "External";
      }
      let i = this._helperService.getArrayProcessed(objectType, 'is_internal').toString();
      if (i === "1") {
        return "Internal"
      }
      else {
        return "External,Internal"
      }
    }
    else {
      return objectType;
    }
  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
    return userDetial;
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


  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    EventsStore.exclusionArray=[]
    EventsStore.scopeArray=[]
    EventsStore.assumptionsArray=[]
  }

}
