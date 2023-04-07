import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TrainingsService } from 'src/app/core/services/training/trainings/trainings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';
declare var $: any;

@Component({
  selector: 'app-training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.scss']
})
export class TrainingDetailsComponent implements OnInit {
  @ViewChild("formModal", { static: true }) formModal: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
  @ViewChild("completeModal") completeModal: ElementRef;

  AppStore = AppStore;
  TrainingsStore = TrainingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  Id: number;
  reactionDisposer: IReactionDisposer;
  trainingModalSubscription: any = null;
  deleteEventSubscription: any;
  completeEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  value: any;
  training_history_message = "";

  TrainingObject = {
    id: null,
    type: null,
  };

  completeObject = {
    id: null,
  };

  popupObject = {
    type: "",
    title: "",
    id: null,
    subtitle: "",
  };

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null,
    created_at: null
  }

  countDownDate: any;
  days: any;
  hours: any;
  minute: any;
  seconds: any;
  timeUp = true;
  revertClicked: boolean = false;
  constructor(private _trainingsService: TrainingsService,
    private _route: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _router: Router) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;
    this._route.params.subscribe(params => {
      this.Id = params.id;
      TrainingsStore.training_id = this.Id;
      this.getDetails();
    });
    //this.mytimerfunction();

    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: '', buttonText: ''});
      if (TrainingsStore.trainingDetails?.training_status?.type != 'completed' && TrainingsStore.trainingDetails?.training_status?.type != 'cancelled') {
        if (AuthStore.user.id == TrainingsStore.trainingDetails?.created_by?.id) {
          var subMenuItems = [
            { activityName: 'UPDATE_TRAINING', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_TRAINING', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: { type: 'complete' } },
            { activityName: null, submenuItem: { type: 'cancel' } },
            { activityName: null, submenuItem: { type: 'close', path: "/trainings/training" } },
          ]
        }
        else {
          var subMenuItems = [
            { activityName: 'UPDATE_TRAINING', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_TRAINING', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: { type: 'close', path: "/trainings/training" } },
          ]
        }

      }

      else {
        var subMenuItems = [
          { activityName: 'DELETE_TRAINING', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: { type: 'close', path: "/trainings/training" } },
        ]
      }

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editTraining();
            break;
          case "delete":
            this.delete();
            break;
          case "complete":
            this.completed();
            break;
          case "cancel":
            SubMenuItemStore.cancelClicked = true;
            this.cancelPopup();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })



    this.trainingModalSubscription = this._eventEmitterService.trainingModal.subscribe(
      (res) => {
        this.closeFormModal();
        this.getDetails();
      }
    );

    this.completeEventSubscription = this._eventEmitterService.trainingCompleteModal.subscribe(
      (res) => {
        this.closeCompleteFormModal();
        this.getDetails();
        
      }
    );

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
      (item) => {
        this.modalControl(item);
      }
    );

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })


    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.completeModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.completeModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.completeModal.nativeElement, 'overflow', 'auto');
    }
  }

  // Run myfunc every second
  mytimerfunction() {
    const countDownDate = new Date(TrainingsStore.trainingDetails?.start_date).getTime();
    var now = new Date().getTime();
    var timeleft = countDownDate - now;
    // Calculating the days, hours, minutes and seconds left
    let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    // Result is output to the specific element
    this.days = days;
    this.hours = hours;
    this.minute = minutes;
    this.seconds = seconds;
    if (timeleft < 0) {
      this.timeUp = true;
      clearInterval(this.countDownDate);
    }
    else
      this.timeUp = false;
    this._utilityService.detectChanges(this._cdr);
  }

  getDetails() {
    this._trainingsService.getItem(TrainingsStore.training_id).subscribe(res => {
      this.countDownDate = setInterval(() => { this.mytimerfunction(); }, 1000);
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  onGoing() {
    AppStore.enableLoading();
    this._trainingsService.onGoing(this.Id).subscribe(() => {
      AppStore.disableLoading();
      this.getDetails();
      this._utilityService.detectChanges(this._cdr)
    }, (err: HttpErrorResponse) => {
      if (err.status == 500 || err.status == 404) {
        AppStore.disableLoading();
      }
      else {
        this._utilityService.showErrorMessage('Error', 'something_went_wrong_try_again');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  completed() {
    this.completeObject.id = this.Id;
    setTimeout(() => {
      $(this.completeModal.nativeElement).modal("show");
      this._renderer2.setStyle(this.completeModal.nativeElement, 'z-index', '9999999');
    }, 100);
  }

  cancelPopup() {
    event.stopPropagation();
    this.popupObject.type = "Cancel";
    this.popupObject.id = this.Id;
    this.popupObject.title = "cancel_training";
    this.popupObject.subtitle = "training_cancel_confirmation";

    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  cancelled(status) {
    if (status && this.popupObject.id) {
      this.closeConfirmationPopUp();
      this._trainingsService.cancelled(this.popupObject.id).subscribe(
        (resp) => {
          SubMenuItemStore.cancelClicked = false;
          this._utilityService.detectChanges(this._cdr);
          this.clearPopupObject();
        },(error)=>{
          SubMenuItemStore.cancelClicked = false;
          this._utilityService.detectChanges(this._cdr);
        });
    } else {
      this.closeConfirmationPopUp();
      SubMenuItemStore.cancelClicked = false;
      this.clearPopupObject();
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal("show");
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal("hide");
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9');
    this.TrainingObject.type = null;
  }

  closeCompleteFormModal() {
    $(this.completeModal.nativeElement).modal("hide");
    this._renderer2.setStyle(this.completeModal.nativeElement, 'z-index', '9');
    this.completeObject.id = null;
  }

  editTraining() {
    event.stopPropagation();
    //set form value
    this.TrainingObject.id = this.Id;
    this.TrainingObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }


  deleteTraining(status: boolean) {
    if (status && this.popupObject.id) {
      this._trainingsService.deleteTraining(this.popupObject.id).subscribe(
        (resp) => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('/trainings/training');
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        },
      );
    } else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }

  deleteActivity(status: boolean) {
    if (status && this.popupObject.id) {
      this.closeConfirmationPopUp();
      this._trainingsService.deleteActivity(this.popupObject.id).subscribe(
        (resp) => {
          this.revertClicked = false;
          this._utilityService.detectChanges(this._cdr);
          this.clearPopupObject();
        },(error)=>{
          this.revertClicked = false;
          this._utilityService.detectChanges(this._cdr);
        });
    } else {
      this.revertClicked = false;
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }

  deleteActivityPopup() {
    event.stopPropagation();
    this.popupObject.type = "Confirm";
    this.popupObject.id = this.Id;
    this.popupObject.title = "delete_activity";
    this.popupObject.subtitle = "Are you sure you want revert this action?";
    this.revertClicked =  true;
    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  delete() {
    event.stopPropagation();
    this.popupObject.type = "";
    this.popupObject.id = this.Id;
    this.popupObject.title = "delete_training";
    this.popupObject.subtitle = "delete_training";

    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal("hide");
    this._utilityService.detectChanges(this._cdr);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case "":
        this.deleteTraining(status);
        break;
      case 'Confirm':
        this.deleteActivity(status);
        break;
      case 'Cancel':
        this.cancelled(status);
        break;

    }
  }

  translateToUserLanguage(text){
    return this._helperService.translateToUserLanguage(text);
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  multipleDataBind(item) {
    this.value = [];
    for (let i of item) {
      this.value.push(i.title);
    }
    return this.value.join(', ');
  }

  getArrayFormatedString(type, items, partcipents: boolean = false) {

    if (partcipents) {
      for (let i of items) {
        let string = i.user.first_name + ' ' + i.user.last_name;
        i.name = string;
      }
    }
    return this._helperService.getArraySeperatedString(', ', type, items);
  }

  setLabelColor(data) {
    let className = 'draft-tag label-tag-style-tag label-left-arow-tag ml-3 '
    if (data.label) {
      switch (data.label) {
        case 'blue':
          className = className + ' ' + 'color-blue'
          break;
        case 'green':
          className = className + ' ' + 'color-green'
          break;
        case 'yellow':
          className = className + ' ' + 'color-yellow'
          break;
        case 'red':
          className = className + ' ' + 'color-red'
          break;
        default:
          break;
      }
    }
    else {
      className = className
    }
    return className
  }

  timeDetect() {
    const countDownDate = new Date(TrainingsStore.trainingDetails?.start_date).getTime();
    var now = new Date().getTime();
    var timeleft = countDownDate - now;
    if (timeleft < 0) {
      return true;
    }
    else
      return false;
  }

  getPopupDetails(user) {
    if (user) {
      this.userDetailObject.first_name = user?.first_name ? user?.first_name : null;
      this.userDetailObject.last_name = user?.last_name ? user?.last_name : null;
      this.userDetailObject.designation = user?.designation ? user?.designation : null;
      this.userDetailObject.image_token = user?.image?.token ? user?.image?.token : null;
      this.userDetailObject.email = user?.email ? user?.email : null;
      this.userDetailObject.mobile = user?.mobile ? user?.mobile : null;
      this.userDetailObject.id = user?.id ? user?.id : null;
      this.userDetailObject.department = user?.department ? user?.department : null;
      this.userDetailObject.status_id = user?.status?.id ? user?.status?.id : 1;
      return this.userDetailObject;
    }
  }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : null;
    userDetial['last_name'] = users?.last_name ? users?.last_name : null;
    userDetial['designation'] = users?.designation ? users?.designation :null;
    userDetial['image_token'] = users?.image?.token ? users?.image?.token : users?.image_token;
    userDetial['email'] = users?.email ? users?.email : null;
    userDetial['mobile'] = users?.mobile ? users?.mobile : null;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;
  }

  returnWebsiteValue(value){
    if(value){
       if(value.indexOf('http') != -1)
          return value;
       else
          return `http://${value}`;
    }
 }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    TrainingsStore.training_id = null;
    TrainingsStore.unsetIndividualTrainings();
    this.deleteEventSubscription.unsubscribe();
    this.trainingModalSubscription.unsubscribe();
    clearInterval(this.countDownDate);
    this.timeUp = true;
  }
}
