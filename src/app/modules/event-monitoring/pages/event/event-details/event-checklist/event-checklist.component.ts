import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventChecklistStore } from 'src/app/stores/event-monitoring/events/event-checklist-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventChecklistService } from 'src/app/core/services/event-monitoring/event-monitoring-closure/event-checklist.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

declare var $: any;
@Component({
  selector: 'app-event-checklist',
  templateUrl: './event-checklist.component.html',
  styleUrls: ['./event-checklist.component.scss']
})
export class EventChecklistComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal', { static: true }) deleteModal: ElementRef;
  @ViewChild('checklistModal', { static: true }) checklistModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  reactionDisposer: IReactionDisposer;

  AppStore = AppStore
  AuthStore = AuthStore
  EventsStore = EventsStore
  EventChecklistStore = EventChecklistStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  selectedIndex:number = 0;  
  selectedChecklistId:number=null
  selectedType:string=null

  checklistObject = {
    id: null,
    type: null,
    value: null,
    values: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  eventChecklistSubscription: Subscription
  popupControlEventSubscription: Subscription

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventChecklist: EventChecklistService,
    private _eventEmitterService: EventEmitterService,
    private _eventFileService: EventFileServiceService,
    private _documentFileService: DocumentFileService,    
    private _imageService: ImageServiceService,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = this.getSubmenus()

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_checklist' });

      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewChecklist();
            break;
          case "edit_modal":
            this.openNewChecklist();
            break;
          case "delete":
            //this.delete();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.openNewChecklist()
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    this.eventChecklistSubscription = this._eventEmitterService.eventChecklistModal.subscribe(item => {      
      this.closeFormModal();
      this.pageChange(1)
    })

    //for deleting using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteChecklist(item);
    })

    this.pageChange(1)

  }

  getSubmenus(){
    var subMenuItems = [            
      { activityName: "CREATE_EVENT_CHECKLIST_DETAIL", submenuItem: { type: 'new_modal',path:'' } },
      { activityName: null, submenuItem: { type: 'close', path: '../' } },
    ];

    // if(EventChecklistStore.allItems.length==0){
    //   subMenuItems.splice(0, 0, { activityName: "CREATE_EVENT_CHECKLIST_DETAIL", submenuItem: { type: 'new_modal',path:'' } })
    // }else{
    //   //subMenuItems.splice(1, 0, { activityName: "UPDATE_EVENT_CHECKLIST_DETAIL", submenuItem: { type: 'delete',path:'' } })
    //   subMenuItems.splice(0, 0, { activityName: "UPDATE_EVENT_CHECKLIST_DETAIL", submenuItem: { type: 'edit_modal',path:'' } })
    // }

    return subMenuItems
  }

  pageChange(newPage: number = null) {
    if (newPage) EventChecklistStore.setCurrentPage(newPage);
    this._eventChecklist.getItems().subscribe(res => {
      //this.selectedChecklistId=res.data[0].id
      if(this.selectedType == 'Edit'){
        this.getDetails(this.selectedChecklistId)
      }else if(res?.data?.length > 0){
        this.getDetails(res.data[0].id)
      } 
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getDetails(id){
    this._eventChecklist.getDetails(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  edit() {  
    this.checklistObject.type = 'Edit';
    this.selectedType='Edit'
    this._utilityService.detectChanges(this._cdr);
    this.openNewchecklistModal();
  }

  editIndividualChecklist(id){
    this.selectedChecklistId=id
    this.checklistObject.type = 'Edit';
    this.selectedType='Edit'
    this._eventChecklist.getDetails(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
      this.openNewchecklistModal();
    })
  }

  //setting necessary data and opening the delete popup
  delete(id) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Checklist?';
    this.popupObject.subtitle = 'event_checklist_delete';
    $(this.deleteModal.nativeElement).modal('show');
  }

  //here we're deleting the particular item
  deleteChecklist(status: boolean) {
    if (status) {
      this._eventChecklist.delete(this.popupObject.id).subscribe(resp => {
        if (resp) {
          this._utilityService.detectChanges(this._cdr);
          this.pageChange()
          this.clearPopupObject();
        }
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.deleteModal.nativeElement).modal('hide');
    }, 250);
  }

  //need to clear the object when we're closing the delete popup
  clearPopupObject() {
    this.popupObject.id = null;
  }

  gotoDetails(id) {
    this._router.navigateByUrl(`event-monitoring/events/${EventsStore.selectedEventId}/checklist/${id}`)
  }

  //this is for opening add task  
  openNewChecklist() {
    this.checklistObject.type = 'Add';
    this.selectedType='Add'
    this._utilityService.detectChanges(this._cdr);
    this.openNewchecklistModal();
  }

  //it will open add modal
  openNewchecklistModal() {
    setTimeout(() => {
      $(this.checklistModal.nativeElement).modal('show');
    }, 100);
  }

  //it will close add/edit  modal
  closeFormModal() {
    $(this.checklistModal.nativeElement).modal('hide');
    this.checklistObject.type = null;
  }

  //it'll open/close the accordia based on the click 
  getAccordian(index) {
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else
      this.selectedIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  createPreviewUrl(type, token) {
    return this._eventFileService.getThumbnailPreview(type, token)
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

viewBrochureItem(type, documents, documentFile,checklistId?) {

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

    case 'event-checklist':
      this._eventFileService.getFilePreview('event-checklist', EventsStore.selectedEventId,checklistId, documentFile).subscribe(res => {
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
    case "event-checklist":
      this._eventFileService.downloadFile(
        type,
        EventsStore.selectedEventId,
        document.event_checklist_detail_id,
        document.id,
        null,        
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
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.eventChecklistSubscription.unsubscribe()
    EventChecklistStore.unsetEventChecklist()
    this.popupControlEventSubscription.unsubscribe()
  }

}
