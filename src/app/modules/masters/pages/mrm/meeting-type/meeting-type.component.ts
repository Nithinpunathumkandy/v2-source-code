import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import{MeetingTypeMasterStore} from 'src/app/stores/masters/mrm/meeting-type-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MeetingTypeService } from 'src/app/core/services/masters/mrm/meeting-type/meeting-type.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-meeting-type',
  templateUrl: './meeting-type.component.html',
  styleUrls: ['./meeting-type.component.scss']
})
export class MeetingTypeComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;


  reactionDisposer: IReactionDisposer;
  MeetingTypeMasterStore = MeetingTypeMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_meeting_type_message';


  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 

  popupControlMeetingTypeEventSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _meetingTypeService: MeetingTypeService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MEETING_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_MEETING_TYPE', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_MEETING_TYPE', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'mrm'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
             
              case "export_to_excel":
                this._meetingTypeService.exportToExcel();
                break;
                case "search":
                  MeetingTypeMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                   break;
                   case "share":
                    ShareItemStore.setTitle('share_meeting_type_title');
                    ShareItemStore.formErrors = {};
                    break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
         
            NoDataItemStore.unSetClickedNoDataItem();
          }
          if(ShareItemStore.shareData){
            this._meetingTypeService.shareData(ShareItemStore.shareData).subscribe(res=>{
                ShareItemStore.unsetShareData();
                ShareItemStore.setTitle('');
                ShareItemStore.unsetData();
                $('.modal-backdrop').remove();
                document.body.classList.remove('modal-open');
                setTimeout(() => {
                  $(this.mailConfirmationPopup.nativeElement).modal('show');              
                }, 200);
            },(error)=>{
              if(error.status == 422){
                ShareItemStore.processFormErrors(error.error.errors);
              }
              ShareItemStore.unsetShareData();
              this._utilityService.detectChanges(this._cdr);
              $('.modal-backdrop').remove();
              
            });
          }
        })

         // for deleting/activating/deactivating using delete modal
      this.popupControlMeetingTypeEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })
     

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) MeetingTypeMasterStore.setCurrentPage(newPage);
    this._meetingTypeService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Meeting Type?';
    this.popupObject.subtitle = 'are_you_sure_activate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Meeting Type?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
  
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Activate': this.activateMeetingType(status)
        break;
  
      case 'Deactivate': this.deactivateMeetingType(status)
        break;
  
    }

}

// for popup object clearing
clearPopupObject() {
  this.popupObject.id = null;
  // this.popupObject.title = '';
  // this.popupObject.subtitle = '';
  // this.popupObject.type = '';

}

// calling activcate function
  
activateMeetingType(status: boolean) {
  if (status && this.popupObject.id) {

    this._meetingTypeService.activate(this.popupObject.id).subscribe(resp => {
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

// calling deactivate function

deactivateMeetingType(status: boolean) {
  if (status && this.popupObject.id) {

    this._meetingTypeService.deactivate(this.popupObject.id).subscribe(resp => {
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

  sortTitle(type: string) {
    //MeetingCategoryMasterStore.setCurrentPage(1);
    this._meetingTypeService.sortMeetingTypeList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlMeetingTypeEventSubscription.unsubscribe();
    MeetingTypeMasterStore.searchText = '';
    MeetingTypeMasterStore.currentPage = 1 ;
  }

}