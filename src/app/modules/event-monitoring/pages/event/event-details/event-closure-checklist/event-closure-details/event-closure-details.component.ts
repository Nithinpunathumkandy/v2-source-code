import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventClosureService } from 'src/app/core/services/event-monitoring/event-closure/event-closure.service';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventClosureStore } from 'src/app/stores/event-monitoring/event-closure-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-event-closure-details',
  templateUrl: './event-closure-details.component.html',
  styleUrls: ['./event-closure-details.component.scss']
})
export class EventClosureDetailsComponent implements OnInit , OnDestroy {

  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  popupObject = {
		id: null,
		title: '',
		type: '',
		subtitle: ''
	};

  userMatch: boolean = false;

  reactionDisposer: IReactionDisposer;
  taskId:number
  AppStore=AppStore
  AuthStore=AuthStore
  EventClosureStore = EventClosureStore
  selectedIndex:number = 0;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  
  workflowHistoryOpened=false;
  workflowModalOpened: boolean=false;
  popupControlEventSubscription: any;
  workflowHistorySubscription: any
  workflowSubscription:any

  commentFormObject={
    type: '',
    title:''
  }

  constructor(
    private _eventClosureService: EventClosureService,
    private route:ActivatedRoute,
    private _router:Router,
    private _utilityService:UtilityService,
    private _renderer2: Renderer2,
    private _cdr:ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _eventFileService: EventFileServiceService,
    private _imageService: ImageServiceService,
    private _sanitizer: DomSanitizer,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['id']; // (+) converts string 'id' to a number                        
      EventClosureStore.closureId=this.taskId
    });

    this.reactionDisposer = autorun(() => {
      //this.setSubmenus()            
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case 'submit':
            SubMenuItemStore.submitClicked = true;
            this.submitApproveWorkflow("submit");
            break;
          case 'approve':
            this.submitApproveWorkflow("approve");
            break;      
          case 'revert':
            this.revertRejectWorkflow("revert");
            break;
          case 'reject':
            this.revertRejectWorkflow("reject");
            break;
          case "history":
            this.openHistoryPopup();
            break;
          case "workflow":
            this.openWorkflowPopup();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    if (EventsStore.selectedEventId) {
      this.getDetails(this.taskId)
    } else {
      this._router.navigateByUrl('event-monitoring/events');
    }

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {      
      this.modalControl(item);
    })

    this.workflowSubscription = this._eventEmitterService.closureWorkflowCommentModal.subscribe(item => {      
      this.closeWorkflowComment();
    })

    this.workflowHistorySubscription = this._eventEmitterService.closureWorkflowHistory.subscribe(element=>{
      this.closeHistoryPopup();
    })
  }

  getDetails(id){
    this._eventClosureService.getItem(id).subscribe(res => {
      this.setSubmenus()
      this._utilityService.detectChanges(this._cdr)
    })
  }

  setSubmenus(){
    this.currentUserCheck();
    var subMenuItems=[];
     subMenuItems = [        
      {activityName:'', submenuItem: {type: 'workflow',title : ''}},
      {activityName:'', submenuItem: {type: 'history',title : ''}},      
    ];
    if(EventClosureStore?.routeMainListing)
    {
      subMenuItems.push({ activityName: null, submenuItem: { type: 'close', path: '/event-monitoring/event-closures' } })
    }
    else
    {
      subMenuItems.push({ activityName: null, submenuItem: { type: 'close', path: '../' } })
    }

    if(EventClosureStore.indivitualEventClosure?.next_review_user_level==1&&EventClosureStore.indivitualEventClosure?.submitted_by==null){
      subMenuItems.splice(0, 0, {activityName:'',submenuItem:{type:'submit',title : ''}},)
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
       
      this._utilityService.detectChanges(this._cdr);
    }

    if (this.userMatch && EventClosureStore.indivitualEventClosure?.submitted_by!=null && EventClosureStore.indivitualEventClosure?.next_review_user_level) {
      subMenuItems.push(
        { activityName: null, submenuItem: { type: 'approve',title:'' } },
        { activityName: null, submenuItem: { type: 'revert',title:'' } },
        { activityName: null, submenuItem: { type: 'reject',title:'' } },
      )
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    this._utilityService.detectChanges(this._cdr);
  }

  //checking loggedin user and workflow level user is same or not
  currentUserCheck() {
    if (EventClosureStore.indivitualEventClosure) {
      if (EventClosureStore.indivitualEventClosure.workflow_items && EventClosureStore.indivitualEventClosure.workflow_items.length > 0)
      EventClosureStore.indivitualEventClosure.workflow_items.forEach(items => {
          if (items.level == EventClosureStore.indivitualEventClosure.next_review_user_level) {
            this.userMatch = items.users.some((user) =>
              user.id == AuthStore?.user?.id)
          }
        })
    }
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

  openWorkflowPopup() {
    this._eventClosureService.getWorkflow(this.taskId).subscribe(res => {
    this.workflowModalOpened = true;
    this._utilityService.detectChanges(this._cdr);
    $(this.workflowModal.nativeElement).modal('show');
    })
  }

  closeWorkflowPopup() {
    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
  }

  revertRejectWorkflow(type) {
    this.commentFormObject.title=type
    this.commentFormObject.type="open"
    EventClosureStore.workflowType = type;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  closeWorkflowComment() {
    this.commentFormObject.type = ''
    $(this.commentModal.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    this._utilityService.detectChanges(this._cdr)
  }

  openHistoryPopup() {
    this.workflowHistoryOpened = true;
    this._utilityService.detectChanges(this._cdr);
    $(this.workflowHistory.nativeElement).modal('show');   
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  submitApproveWorkflow(type){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = type;
    this.popupObject.subtitle = `event_closure_${type}_message`;
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

   // modal control event
   modalControl(status: boolean) {    
    switch (this.popupObject.title) {      
      case 'submit': this.submitAccepted(status)
      break
      case 'approve': this.approveAccepted(status)
      break;
    }
  }

  submitAccepted(status){
    if(status){
      this._eventClosureService.submitClosures(EventClosureStore.closureId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getDetails(this.taskId)
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      },
      (error)=>{
        SubMenuItemStore.submitClicked = false;
        this.clearDeleteObject();
      })
      
    }else{
      this.clearDeleteObject();
      SubMenuItemStore.submitClicked = false;
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
   }

   approveAccepted(status){
    if(status){
      this._eventClosureService.approveClosures(EventClosureStore.closureId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getDetails(this.taskId)
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      },
      (error)=>{
        SubMenuItemStore.submitClicked = false;
        this.clearDeleteObject();
      })
      
    }else{
      this.clearDeleteObject();
      SubMenuItemStore.submitClicked = false;
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
   }

   clearDeleteObject(){
    this.popupObject.id = null;
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    EventClosureStore.unsetIndivitualEventClosure()
    this.popupControlEventSubscription.unsubscribe()
    this.workflowSubscription.unsubscribe()
    this.workflowHistorySubscription.unsubscribe()
  }

}
