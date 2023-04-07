import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventTaskStore } from 'src/app/stores/event-monitoring/events/event-task.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventTaskService } from 'src/app/core/services/event-monitoring/events/event-task/event-task.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { DomSanitizer } from '@angular/platform-browser';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

declare var $: any;
@Component({
  selector: 'app-event-task-details',
  templateUrl: './event-task-details.component.html',
  styleUrls: ['./event-task-details.component.scss']
})
export class EventTaskDetailsComponent implements OnInit, OnDestroy {

  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('taskFormModal', { static: true }) taskFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('percentageUpdateModal', { static: true }) percentageUpdateModal: ElementRef;
  @ViewChild('historyPopupModal', { static: true }) historyPopupModal: ElementRef;

  taskId: number
  form: FormGroup;
  formErrors: any;
  selectedIndex:number = null;
  AppStore = AppStore
  AuthStore = AuthStore
  EventsStore = EventsStore
  EventTaskStore = EventTaskStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  taskSubscription: Subscription
  historySubscription: Subscription
  deleteEventSubscription: Subscription
  taskPercentageSubscription: Subscription
  reactionDisposer: IReactionDisposer;

  taskObject = {
    id: null,
    type: null,
    value: null,
    event_task_id: null,
    values:null
  };

  popupObject = {
    event_id: null,
    position: null,
    type: '',
    subtitle: '',
    task_id: null,
    category: '', 
    title: '',
    id: null,    
  };

  percentageObject = {
    id: null,
    type: null,
    value: null,
    event_task_id: null,
    values:null
  };

  historyObject = {
    id: null,
    type: null,
    value: null,
    event_task_id: null,
    values:null
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  userRole:boolean=false
  subTaskId:number
  subTaskUserCheck:boolean=false

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _eventTaskService: EventTaskService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _eventFileService: EventFileServiceService,
    private _documentFileService: DocumentFileService,    
    private _imageService: ImageServiceService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['taskid']; // (+) converts string 'id' to a number 
      let eventId = +params['id'];                        
      EventTaskStore.taskId=this.taskId;
      EventsStore.selectedEventId = eventId;
    });
    if(EventsStore.selectedEventId){
      this.getTaskDetails(this.taskId)
    }else{
      this._router.navigateByUrl('event-monitoring/events');
    }
    
    this.form = this._formBuilder.group({
      percentage:[]
    })

    this.reactionDisposer = autorun(() => {
      var subMenuItems =[]
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'edit_modal' } },
        // { activityName: null, submenuItem: { type: 'delete' } },
      ];
        if(EventTaskStore?.routeMainListing)
      {
        subMenuItems.push({ activityName: null, submenuItem: { type: 'close', path: '/event-monitoring/event-tasks' } })
      }
      else
      {
        subMenuItems.push({ activityName: null, submenuItem: { type: 'close', path: '../' } })
      }

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      setTimeout(() => {
        NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_sub_task' });
      }, 300);

      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editSubTask(EventTaskStore.IndividualEventTaskDetails);
            break;
          case "delete":
            this.deleteTask(EventTaskStore.IndividualEventTaskDetails.id);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.openNewTask();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    
    //emitting data once closing form
    this.taskSubscription = this._eventEmitterService.eventTaskModal.subscribe(item => {      
      this.closeFormModal();
      this.getTaskDetails(this.taskId)
    })

    //emitting data once closing form
    this.taskPercentageSubscription = this._eventEmitterService.percentageModal.subscribe(item => {      
      this.closePercentageUpdateModal();
      this.getTaskDetails(this.taskId)
    })

    this.historySubscription = this._eventEmitterService.closeHistoryModal.subscribe(item => {      
      this.closeHistoryModal();      
    })

    //emitting data once closing form
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
  }

  //Getting details of the parent task
  getTaskDetails(id) {
    this._eventTaskService.getTaskDetails(id).subscribe(res => {
      this.workflow()
      this._utilityService.detectChanges(this._cdr)
    })
  }

  workflow(){
    this.userRole=false
    EventTaskStore.IndividualEventTaskDetails?.responsible_users.forEach(res=>{
      if(AuthStore.user?.id == res.id){
        this.userRole=true;
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  //this is for opening add task  
  openNewTask() {
    this.taskObject.type = 'Add';
    this.taskObject.value = EventTaskStore.IndividualEventTaskDetails?.task_phase?.type
    this.taskObject.id = EventTaskStore.IndividualEventTaskDetails?.task_phase?.id;
    this.taskObject.event_task_id = EventTaskStore.IndividualEventTaskDetails.id
    this._utilityService.detectChanges(this._cdr);
    this.openNewTaskFormModal();
  }

  //it will open add task modal
  openNewTaskFormModal() {
    setTimeout(() => {
      $(this.taskFormModal.nativeElement).modal('show');
    }, 100);
  }

  //it will close add/edit treatment modal
  closeFormModal() {
    $(this.taskFormModal.nativeElement).modal('hide');
    this.taskObject.type = null;
  }

  //opening form form updating percentage of the task
  updateTask(id) {
    this.popupObject.event_id = EventsStore.selectedEventId;
    this.popupObject.task_id = id;
    this.popupObject.type = 'submit';
    this.popupObject.category = 'update'
    this.popupObject.subtitle = "task_percentage_update_subtitle";
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  //It'll update the percentage of the task
  updateTaskPercentage(status) {    
    if (status && this.popupObject.event_id) {
      this._eventTaskService.updateTaskPercentage(this.popupObject.task_id,this.setSaveData()).subscribe(res => {
        this.getTaskDetails(this.taskId)
        this.resetForm()
        this._utilityService.detectChanges(this._cdr);        
      }, (err: HttpErrorResponse) => {        
        this._utilityService.detectChanges(this._cdr);
        if (err.status == 422) {
          this.formErrors = err.error.errors;          
          this._utilityService.detectChanges(this._cdr);
        }
      })      
    }        
    $(this.confirmationPopUp.nativeElement).modal('hide');    
  }

  editSubTask(res){
    this.taskObject.type = 'Edit';
    this.taskObject.value = EventTaskStore.IndividualEventTaskDetails?.task_phase?.type
    this.taskObject.id = EventTaskStore.IndividualEventTaskDetails?.task_phase?.id;
    //this.taskObject.value = EventTaskStore.taskPhaseType;
    //this.taskObject.id = EventTaskStore.taskPhaseId;
    this.taskObject.event_task_id = EventTaskStore.IndividualEventTaskDetails.id
    this.taskObject.values = {
      id: res.id,
      title: res.title,
      description: res.description,
      duration: res.duration,
      percentage: res.percentage,
      responsible_users: res.responsible_users,
      start_date: res.start_date,
      end_date: res.end_date,
      documents:res.documents
    }
    this._utilityService.detectChanges(this._cdr);
    this.openNewTaskFormModal();
  }

  updatePercentage(id){
    this.percentageObject.id=id
    this.percentageObject.type='open'
    this.percentageObject.values={
      percentage:EventTaskStore.IndividualEventTaskDetails?.percentage,
      event_task_status:EventTaskStore.IndividualEventTaskDetails?.event_task_status,
    }
    this.openUpdatePercentageModal()
  }

  openUpdatePercentageModal(){
    setTimeout(() => {
      $(this.percentageUpdateModal.nativeElement).modal('show');
    }, 100);
  }

  //it will close add/edit treatment modal
  closePercentageUpdateModal() {
    $(this.percentageUpdateModal.nativeElement).modal('hide');
    this.percentageObject.type = null;
  }

  historyModal(id){
    console.log(id)
    this.historyObject.id=id
    this.historyObject.type='open'
    this.openHistoryModal()
  }

  openHistoryModal(){
    setTimeout(() => {
      $(this.historyPopupModal.nativeElement).modal('show');
    }, 100);
  }

  //it will close add/edit treatment modal
  closeHistoryModal() {
    $(this.historyPopupModal.nativeElement).modal('hide');
    this.historyObject.type = null;
    this.historyObject.id=null
  }

  //here we're deleting the particular task
  deleteSubTask(id){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Event Sub Task?';
    this.popupObject.category = 'sub_task'
    this.popupObject.subtitle = 'event_task_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  //here we're deleting the particular task
  deleteTask(id){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Event Task?';
    this.popupObject.category = 'sub_task'
    this.popupObject.position = 'task'
    this.popupObject.subtitle = 'event_task_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  //here we're deleting the particular sub task
  deleteEventSubTask(status: boolean) {
    if (status && this.popupObject.id) {
      this._eventTaskService.delete(this.popupObject.id,EventTaskStore.IndividualEventTaskDetails?.task_phase?.type).subscribe(resp => {
        if (resp && this.popupObject.position=='task') {
          this._router.navigateByUrl(`event-monitoring/events/${EventsStore.selectedEventId}/task`);          
        }else{
          this.getTaskDetails(this.taskId)
        }        
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
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

  modalControl(status: boolean) {
    switch (this.popupObject.category) {
      case 'update': this.updateTaskPercentage(status);        
        break;
      case 'sub_task': this.deleteEventSubTask(status);
        break;        
      default:
        break;
    }
  }

  //need to clear the object when we're closing the delete popup
  clearPopupObject() {
    this.popupObject.id = null;
  }

  //resetting forms
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;    
  }

  //setting body for updating percentage
  setSaveData(){
    let save={
      percentage:this.form.value.percentage
    }

    return save
  }

  //checking condition for maximum numbers typing on the text field - max 3
  maxLengthCheck(object){
    console.log(object)
    if (object.value.length > object.maxLength)
      object.value = object?.value.slice(0, object.maxLength)
  }

  //user popup box objects
  getResponsibleUser(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    if(created){
      userDetial['designation'] = users?.designation;
    }else{
      userDetial['designation'] = users?.designation?.title;
    }    
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;
  }

  //it'll open/close the accordia based on the click 
  getSubTaskDetails(index) {
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else
      this.selectedIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  checkButtonPermission(id,responsible_users){
    this.subTaskId=id
    this.subTaskUserCheck=false;
    if(responsible_users.length >0){
      responsible_users.forEach(res=>{
        if(AuthStore.user?.id == res.id){
          this.subTaskUserCheck=true;
          this._utilityService.detectChanges(this._cdr);
        }
      })
    }
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

    case 'event-task':
      this._eventFileService.getFilePreview('event-task',EventsStore.selectedEventId ,documents.event_task_id, documentFile).subscribe(res => {
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
    case "event-task":
      this._eventFileService.downloadFile(
        type,
        EventsStore.selectedEventId,
        document.event_task_id,
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
      
      this.previewObject.uploaded_user = EventTaskStore.IndividualEventTaskDetails.created_by;
      this.previewObject.created_at = EventTaskStore.IndividualEventTaskDetails.created_at;
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

  //Don't forget to dispose reaction disposer and unsubscribe eventemitter
  ngOnDestroy(): void {  
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
    this.taskSubscription.unsubscribe()
    this.historySubscription.unsubscribe()
    this.deleteEventSubscription.unsubscribe()
    this.taskPercentageSubscription.unsubscribe()
    EventTaskStore.unsetIndividualEventTaskDetails()
  }

}
