import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ToastrService } from 'ngx-toastr';
import { indivitualEventClosure } from 'src/app/core/models/event-monitoring/event-closure';
import { EventClosureService } from 'src/app/core/services/event-monitoring/event-closure/event-closure.service';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { EventMilestoneService } from 'src/app/core/services/event-monitoring/event-milestone/event-milestone.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventClosureStore } from 'src/app/stores/event-monitoring/event-closure-store';
import { EventMilestoneStore } from 'src/app/stores/event-monitoring/event-milestone-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-event-closure-checklist',
  templateUrl: './event-closure-checklist.component.html',
  styleUrls: ['./event-closure-checklist.component.scss']
})
export class EventClosureChecklistComponent implements OnInit {
  @ViewChild('formModal', {static: true}) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  EventClosureStore = EventClosureStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  selectedIndex:number = 0;
  selectedType:string=null

  eventClosureObject = {
    id : null,
    type : null,
    value : null
  }

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

  percentageChecking:boolean=false
  buttonChecking:boolean=false

  popupControlEventSubscription: any;
  closureSubscriptionEvent: any = null;
  EventsStore=EventsStore;
  selectedChecklistId: number=null;
  constructor(
    private _eventClosureService: EventClosureService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _router:Router,
    private _eventMilestoneService : EventMilestoneService,
    private _toastr: ToastrService,
    private _eventFileService: EventFileServiceService,
    private _documentFileService: DocumentFileService,    
    private _imageService: ImageServiceService,
  ) { this.getMileStone()}

  ngOnInit(): void {    
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event_closure_checklist' })
    this.reactionDisposer = autorun(() => {  
       this.getSubmenu()
     if(!AuthStore.getActivityPermission(3200,'EVENT_CLOSURE_CHECKLIST_LIST')){
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
    //this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);    
    

     if (SubMenuItemStore.clikedSubMenuItem) {
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
          this.openNewEventClosureModal();
          break;
        case "search":
          EventClosureStore.searchText = SubMenuItemStore.searchText;
           this.pageChange(1); 
           break;
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    } 

      if(NoDataItemStore.clikedNoDataItem){
        this.openNewEventClosureModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.closureSubscriptionEvent = this._eventEmitterService.eventClosureModal.subscribe(item => {      
      // if(this.eventClosureObject.type == 'Edit'){
      //   this.getDetails(this.selectedChecklistId)
      // }
      this.pageChange(1)
      this.closeEventClosure()
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.pageChange(1);    
  }

  getSubmenu(){ 
    var subMenuItems=[];    
   if(this.buttonChecking){
      subMenuItems.push({activityName: null, submenuItem: {type: 'new_modal'}})
   }
   subMenuItems.push({activityName:null, submenuItem: {type: 'close', path: '../'}})
   //return subMenuItems
   this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
   this._utilityService.detectChanges(this._cdr);
  }

  getMileStone(){
    let tempArray=[]  
    this._eventMilestoneService.getAllItems().subscribe(res=>{
      this.buttonChecking=true
      res.forEach(element => {
        if(parseInt(element.completion)==100){
          tempArray.push(element)
        }
      });
      if(res.length >0){
        this.percentageChecking=(res.length==tempArray.length)
      }else{
        this.percentageChecking=false
      }
      this._utilityService.detectChanges(this._cdr);
    })    
  }

  pageChange(newPage:number = null){
    if (newPage) EventClosureStore.setCurrentPage(newPage);
    this._eventClosureService.getItems().subscribe(res=>{
      if(this.selectedType == 'Edit'){
        this.getDetails(this.selectedChecklistId)
      } else if(res?.data?.length > 0) {
        this.getDetails(res.data[0].id)
      }
      this.getSubmenu();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDetails(id){
    this._eventClosureService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  openNewEventClosureModal(){
    if(this.percentageChecking){
      this.eventClosureObject.type = 'Add';
      this.selectedType='Add'
    this.eventClosureObject.value = null; // for clearing the value
    this.eventClosureObject.id = null;
    this.openModal();
    }else{
      this._toastr.warning('warning', 'Milestone progress is not 100%');
    }    

  }

  gotoDetails(id){
    this._router.navigateByUrl(`event-monitoring/events/${EventsStore.selectedEventId}/closure-checklist/${id}`)
  }

  getEventClosure(id: number,event)  {
    event.stopPropagation()
    this._eventClosureService.getItem(id).subscribe(res=>{
      this.edit();      
      })
      this._utilityService.detectChanges(this._cdr);
  }

  editIndividualChecklist(id){
    this.selectedChecklistId=id
    this.eventClosureObject.type = 'Edit';
    this.selectedType='Edit'
    this._eventClosureService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
      this.openModal();
    })
  }

  edit()
  {  
    const singleEventClosure: indivitualEventClosure = EventClosureStore.indivitualEventClosure;   
    this.eventClosureObject.value = {
      
      id: singleEventClosure.id,
      actual_event_completion_date: singleEventClosure.actual_event_completion_date,
      checkList: singleEventClosure.checklist,

    }
    this.eventClosureObject.type = 'Edit';
    this.selectedType='Edit'
    this._utilityService.detectChanges(this._cdr);
    this.openModal();
  }

  //it'll open/close the accordia based on the click 
  getAccordian(index) {
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else
      this.selectedIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  closeEventClosure(){
 
    setTimeout(() => {
      this.eventClosureObject.type = null;
      this.eventClosureObject.value = null;
      $(this.formModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.formModal.nativeElement,'show');
      this._renderer2.setStyle(this.formModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  openModal(){
    setTimeout(() => {
      $(this.formModal?.nativeElement).modal('show');
    }, 100);
    // this._renderer2.addClass(this.formModal.nativeElement,'show');
    this._renderer2.setStyle(this.formModal?.nativeElement,'display','block');
    this._renderer2.setStyle(this.formModal?.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.formModal?.nativeElement,'z-index',99999);
  }

 

  //modal control event
  modalControl(status: boolean) {
      switch (this.popupObject.title) {
        case 'delete_event_closure': this.deleteEventClosure(status)
          break;
      }
  
    }

     // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_event_closure';
    this.popupObject.subtitle = 'event_closure_delete_message';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  //for popup object clearing
  clearPopupObject() {
      this.popupObject.id = null;
  }


  // delete function call
  deleteEventClosure(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventClosureService.deleteEventClosure(this.popupObject.id).subscribe(resp => {
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

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.closureSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();

  }
}
