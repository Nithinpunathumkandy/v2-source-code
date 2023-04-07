import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { TimeTrackerStore } from 'src/app/stores/project-management/time-tracker/time-tracker.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { TimeTrackerService } from 'src/app/core/services/project-management/time-tracker/time-tracker.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;
@Component({
  selector: 'app-project-time-tracker-details',
  templateUrl: './project-time-tracker-details.component.html',
  styleUrls: ['./project-time-tracker-details.component.scss']
})
export class ProjectTimeTrackerDetailsComponent implements OnInit,OnDestroy {
  @ViewChild("addTimeTrackerModal", {static: true}) addTimeTrackerModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @Input('source') timeTrackerSource: any;
  TimeTrackerStore=TimeTrackerStore;
  AppStore=AppStore;
  selectedIndex:number;
  AuthStore=AuthStore;
  popupControlEventSubscription: any;
  addTimeTrackerSubscription: any;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore
  timeTrackerObject = {
    id : null,
    type : null,
    values : null,
    redirect:false
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  constructor(
    private _timeTrackerService:TimeTrackerService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService:ImageServiceService,
    private _eventEmitterService:EventEmitterService,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
     this.getDetailsProjectTimeTracker(1)

     // for delete/activate/deactivate using delete modal
     this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.addTimeTrackerSubscription = this._eventEmitterService.addTimeTrackerModalControl.subscribe(element => {
      this.closeTimeTrackerPopup();
  })
  }
  getDetailsProjectTimeTracker(newPage: number = null)
  {
    if (newPage) TimeTrackerStore.setProjectTimeTrackerCurrentPage(newPage);
    this._timeTrackerService.getProjectTimeTrackerDetails(this.timeTrackerSource.id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  cancel(){
    this._eventEmitterService.dismissTimeTrackerDetailsModal();
  }

  readMore(index,type)
  {
    if(type=="more")
    {
      this.selectedIndex=index
    }
    else{
      this.selectedIndex=null;
    }
    
  }

  getPopupDetails(user) { 
    let userDetailObject: any = {};
    userDetailObject['id'] = user?.resource_id; 
    userDetailObject['first_name'] = user?.resource_first_name;
    userDetailObject['last_name'] = user?.resource_last_name;
    userDetailObject['designation'] = user?.resource_designation;
    userDetailObject['department'] = user?.resource_department;
    userDetailObject['image_token'] = user?.resource_image_token;
    userDetailObject['email'] = user?.resource_email;
    userDetailObject['mobile'] = user?.resource_mobile;
    userDetailObject['status_id'] = user?.resource_status_id;
    return userDetailObject;
  
  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.created_by_first_name;
    userDetial['last_name'] = users?.created_by_last_name;
    userDetial['designation'] = users?.created_by_designation;
    userDetial['image_token'] = users?.created_by_image_token;
    userDetial['email'] = users?.created_by_email;
    userDetial['mobile'] = users?.created_by_mobile;
    userDetial['id'] = users?.created_by;
    userDetial['department'] = users?.created_by_department;
    userDetial['status_id'] = users?.created_by_status_id;
    userDetial['created_at'] = created? created:null;
    return userDetial;
  }

   //passing token to get preview
   createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  editTimeTracker(id,event)
  {
    event.stopPropagation();
    this.timeTrackerObject.type = 'Edit';
    this.timeTrackerObject.values = id;
    this.openTimeTrackerPopup()
  }

  openTimeTrackerPopup(){
    setTimeout(() => {
      $(this.addTimeTrackerModal.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement,'z-index',99999);
  }

  closeTimeTrackerPopup() {
    setTimeout(() => {
      this.timeTrackerObject.id=null;
      this.timeTrackerObject.type=null;
      $(this.addTimeTrackerModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.addTimeTrackerModal.nativeElement,'show');
      this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
    this.getDetailsProjectTimeTracker(1);
  }

  delete(id: number,event) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'delete_time_tracker_log';
    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
    
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteItem(status);
        break;
    }
  }

  // delete function call
  deleteItem(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._timeTrackerService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.getDetailsProjectTimeTracker(1);
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

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  ngOnDestroy(): void {
    TimeTrackerStore.unsetProjectTimeTrackerList();
    this.popupControlEventSubscription.unsubscribe();
    this.addTimeTrackerSubscription.unsubscribe();
  }

}
