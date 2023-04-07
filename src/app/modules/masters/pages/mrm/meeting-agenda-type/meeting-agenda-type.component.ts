import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import{MeetingAgendaMasterStore} from 'src/app/stores/masters/mrm/meeting-agenda-store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { MeetingAgendaTypeMasterStore } from 'src/app/stores/masters/mrm/meeting-agenda-type-store';
import { MeetingAgendaTypesService } from 'src/app/core/services/masters/mrm/meeting-agenda-types/meeting-agenda-types.service';
declare var $: any;

@Component({
  selector: 'app-meeting-agenda-type',
  templateUrl: './meeting-agenda-type.component.html',
  styleUrls: ['./meeting-agenda-type.component.scss']
})
export class MeetingAgendaTypeComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  MeetingAgendaMasterStore = MeetingAgendaTypeMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_meeting_agenda_message';

  meetingAgendaObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 

  //meetingAgendaSubscriptionEvent: any = null;
  //popupControlMeetingAgendaEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _meetingAgendaTypeService: MeetingAgendaTypesService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_meeting_agenda'});
    

        

      this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
        if(!status && $(this.formModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
        }
      })
  
      this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
        if(!status && $(this.formModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
        }
      })
  

    this.pageChange(1);

  }

  pageChange(newPage: number = null) {
    if (newPage) MeetingAgendaMasterStore.setCurrentPage(newPage);
    this._meetingAgendaTypeService.getAllItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  

  
    sortTitle(type: string) {
      //MeetingCategoryMasterStore.setCurrentPage(1);
      this._meetingAgendaTypeService.sortMeetingActionPlanStatusList(type);
      this.pageChange();
    }
  
    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      //this.meetingAgendaSubscriptionEvent.unsubscribe();
      //this.popupControlMeetingAgendaEventSubscription.unsubscribe();
      MeetingAgendaMasterStore.searchText = '';
      MeetingAgendaMasterStore.currentPage = 1 ;
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }

}
