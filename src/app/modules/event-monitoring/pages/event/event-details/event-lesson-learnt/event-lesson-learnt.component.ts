import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventLessonLearnedStore } from 'src/app/stores/event-monitoring/events/event-lesson-learned-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventLessonLearnedService } from 'src/app/core/services/event-monitoring/event-lesson-learned/event-lesson-learned.service';


declare var $: any;
@Component({
  selector: 'app-event-lesson-learnt',
  templateUrl: './event-lesson-learnt.component.html',
  styleUrls: ['./event-lesson-learnt.component.scss']
})
export class EventLessonLearntComponent implements OnInit {

  @ViewChild('deleteModal', { static: true }) deleteModal: ElementRef;
  @ViewChild('lessonLearnedForm', { static: true }) lessonLearnedForm: ElementRef;

  reactionDisposer: IReactionDisposer;

  AppStore = AppStore
  AuthStore = AuthStore
  EventsStore = EventsStore  
  EventLessonLearnedStore = EventLessonLearnedStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  lessonLearnedSubscription: Subscription
  popupControlEventSubscription: Subscription

  lessonLearnedObject = {
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

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,    
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private lessonLearnedService: EventLessonLearnedService,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_EVENT_LESSON_LEARNED', submenuItem: { type: 'new_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      setTimeout(() => {
        NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_lesson_learnt' });
      }, 300);
      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewLesson();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.openNewLesson()
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    // for deleting using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteEventLesson(item);
    })

    this.lessonLearnedSubscription = this._eventEmitterService.eventLessonLearnedModal.subscribe(item => {
      this.closeFormModal();
    })

    //1 is for initiation and function for getting details of the list
    this.getDetails(1)
  }
  getDetails(newPage:number=null) {
    if (newPage) EventLessonLearnedStore.setCurrentPage(newPage);    
    this.lessonLearnedService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }
  
  //this is for opening add lesson learned  
  openNewLesson() {
    this.lessonLearnedObject.type = 'Add';    
    this._utilityService.detectChanges(this._cdr);
    this.openNewlessonLearnedForm();
  }

  //it will open add lesson learned modal
  openNewlessonLearnedForm() {
    setTimeout(() => {
      $(this.lessonLearnedForm.nativeElement).modal('show');
    }, 100);
  }

  //it will close add/edit lesson learned modal
  closeFormModal() {
    $(this.lessonLearnedForm.nativeElement).modal('hide');
    this.lessonLearnedObject.type = null;
  }

  edit(event,values){
    event.stopPropagation();
    this.lessonLearnedObject.type = 'Edit';
    this.lessonLearnedObject.values = values;
    this.openNewlessonLearnedForm();
    this._utilityService.detectChanges(this._cdr);
  }

  //it'll navigate to details of the page
  gotoDetails(id) {
    EventLessonLearnedStore.LessonLearntId=id;
    this._router.navigateByUrl(`event-monitoring/events/${EventsStore.selectedEventId}/lesson-learned/${id}`)
  }

  //setting necessary data and opening the delete popup
  delete(event, id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Event Lesson?';
    this.popupObject.subtitle = 'remove_lesson_learnt_subtitle';
    $(this.deleteModal.nativeElement).modal('show');
  }

  //here we're deleting the particular lesson learned
  deleteEventLesson(status: boolean) {
    if (status && this.popupObject.id) {
      this.lessonLearnedService.delete(this.popupObject.id).subscribe(resp => {
        if (resp) {
          this._utilityService.detectChanges(this._cdr);
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

  //Don't forget to dispose the reaction disposer and event emitter
  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    EventLessonLearnedStore.unsetEventLessonLearnedList()
    this.lessonLearnedSubscription.unsubscribe()
    this.popupControlEventSubscription.unsubscribe()
  }

}
