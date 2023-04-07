import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventLessonLearnedStore } from 'src/app/stores/event-monitoring/events/event-lesson-learned-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventLessonLearnedService } from 'src/app/core/services/event-monitoring/event-lesson-learned/event-lesson-learned.service';
declare var $: any;
@Component({
  selector: 'app-event-lesson-learnt-details',
  templateUrl: './event-lesson-learnt-details.component.html',
  styleUrls: ['./event-lesson-learnt-details.component.scss']
})
export class EventLessonLearntDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('lessonLearnedForm', { static: true }) lessonLearnedForm: ElementRef;

  taskId: number
  selectedIndex: number = 0;

  AppStore = AppStore
  EventLessonLearnedStore = EventLessonLearnedStore
  EventsStore = EventsStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  taskSubscription: Subscription
  deleteEventSubscription: Subscription
  reactionDisposer: IReactionDisposer;

  lessonLearnedObject = {
    id: null,
    type: null,
    value: null,
    values: null
  };

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _lessonLearnedService: EventLessonLearnedService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.route.params.subscribe(params => {
      this.taskId = +params['id']; // (+) converts string 'id' to a number                        
    });

    if (EventsStore.selectedEventId) {
      this.getTaskDetails(this.taskId)
    } else {
      this._router.navigateByUrl('event-monitoring/events');
    }

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.edit();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    //emitting data once closing form
    this.taskSubscription = this._eventEmitterService.eventTaskModal.subscribe(item => {
      this.closeFormModal();
      this.getTaskDetails(this.taskId)
    })
  }

  //Getting details of the parent task
  getTaskDetails(id) {
    this._lessonLearnedService.getTaskDetails(id).subscribe(res => {
      console.log(EventLessonLearnedStore.IndividualEventLessonLearnedDetails)
      this._utilityService.detectChanges(this._cdr)
    })
  }

  //it will open add task modal
  openNewlessonLearnedForm() {
    setTimeout(() => {
      $(this.lessonLearnedForm.nativeElement).modal('show');
    }, 100);
  }

  //it will close add/edit task modal
  closeFormModal() {
    $(this.lessonLearnedForm.nativeElement).modal('hide');
    this.lessonLearnedObject.type = null;
  }

  edit() {
    let res = EventLessonLearnedStore.IndividualEventLessonLearnedDetails
    this.lessonLearnedObject.type = 'Edit';
    this.lessonLearnedObject.values = {
      id: res.id,
      title: res.title,
      description: res.description,
      recommendation: res.recommendation,
      is_further_action_required: res.is_further_action_required
    }
    this._utilityService.detectChanges(this._cdr);
    this.openNewlessonLearnedForm();
  }

  //user popup box objects
  getResponsibleUser(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    if (created) {
      userDetial['designation'] = users?.designation;
    } else {
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

  //Don't forget to dispose reaction disposer and unsubscribe eventemitter
  ngOnDestroy(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.taskSubscription.unsubscribe()
    EventLessonLearnedStore.unsetIndividualEventLessonLearnedDetails()
  }

}
