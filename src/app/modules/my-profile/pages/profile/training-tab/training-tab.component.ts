import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProfileTrainingService } from 'src/app/core/services/my-profile/profile/profile-training/profile-training.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProfileTrainingStore } from 'src/app/stores/my-profile/profile/profile-training-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';

declare var $: any;
@Component({
  selector: 'app-training-tab',
  templateUrl: './training-tab.component.html',
  styleUrls: ['./training-tab.component.scss']
})
export class TrainingTabComponent implements OnInit {
  @ViewChild('upcoming') upcoming:ElementRef;
  @ViewChild('missed') missed:ElementRef;
  @ViewChild('completed') completed:ElementRef;
  @ViewChild('rejected') rejected:ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  trainingType = ''
  AppStore = AppStore;
  ProfileTrainingStore = ProfileTrainingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  selectedIndex = null;
  noDataMessage = "no_trainings_to_show";
  Id :number;
  up_coming = 'inactive';
  miss = 'inactive';
  complete = 'inactive';
  reject = 'inactive';

  popupObject = {
    type: '',
    title: '',
    subtitle: '',
    training_id: null
  };

  popupControlEventSubscription:any;
  

  constructor(private _profileTrainingService: ProfileTrainingService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _renderer2: Renderer2,
              private _helperService: HelperServiceService,
              private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.setTrainingType('up-coming');
     
    this.getprofileTraining()
    // console.log("success",MyProfileProfileStore.userId)

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
  }
  getprofileTraining() {

    this._profileTrainingService.getProfileTraining(MyProfileProfileStore.userId).subscribe(() => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setTrainingType(type){
    switch(type){
      case 'up-coming':
        if(this.up_coming == 'active'){
          this.up_coming = 'inactive';
        }else{
          this.up_coming = 'active';
          this.miss = 'inactive';
          this.complete = 'inactive';
          this.reject = 'inactive';
          if(this.missed) this._renderer2.removeClass(this.missed?.nativeElement,'show')
          if(this.completed) this._renderer2.removeClass(this.completed?.nativeElement,'show')
          if(this.rejected) this._renderer2.removeClass(this.rejected?.nativeElement,'show')
        }
        
        break;
      case 'missed':
        if(this.miss == 'active'){
          this.miss = 'inactive';
        }else{
          this.miss = 'active';
          this.up_coming = 'inactive';
          this.complete = 'inactive';
          this.reject = 'inactive';
          if(this.upcoming) this._renderer2.removeClass(this.upcoming?.nativeElement,'show')
          if(this.completed) this._renderer2.removeClass(this.completed?.nativeElement,'show')
          if(this.rejected) this._renderer2.removeClass(this.rejected?.nativeElement,'show')
        }
       
        break;
      case 'completed':
        if(this.complete == 'active'){
          this.complete = 'inactive';
        }else{
          this.up_coming = 'inactive';
          this.miss = 'inactive';
          this.complete = 'active';
          this.reject = 'inactive';
          if(this.missed) this._renderer2.removeClass(this.missed?.nativeElement,'show')
          if(this.upcoming) this._renderer2.removeClass(this.upcoming?.nativeElement,'show')
          if(this.rejected) this._renderer2.removeClass(this.rejected?.nativeElement,'show')
        }
        
        break;
      case 'rejected':
        if(this.reject == 'active'){
          this.reject = 'inactive';
        }else{
          this.up_coming = 'inactive';
          this.miss = 'inactive';
          this.complete = 'inactive';
          this.reject = 'active';
          if(this.missed) this._renderer2.removeClass(this.missed?.nativeElement,'show')
          if(this.completed) this._renderer2.removeClass(this.completed?.nativeElement,'show')
          if(this.upcoming) this._renderer2.removeClass(this.upcoming?.nativeElement,'show')
        }
      
        break;
    }

    // if(this.trainingType == type){
    //   this.trainingType = ''
    // }else
    // this.trainingType = type 
    this._utilityService.detectChanges(this._cdr);
  }

  acceptConfirm(training_id: number) {
    event.stopPropagation();
    this.popupObject.training_id = training_id;
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Accept';
    this.popupObject.subtitle = 'Are you sure want to accept this training?';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }
  rejectConfirm(training_id: number) {
    event.stopPropagation();
    this.popupObject.training_id = training_id;
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Reject';
    this.popupObject.subtitle = 'Are you sure want to reject this training?';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

   // for popup object clearing
   clearPopupObject() {
    this.popupObject.training_id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

 // modal control event
 modalControl(status: boolean) {
  switch (this.popupObject.title) {
    case 'Accept': this.confirmAccept(status)
      break;
    case 'Reject': this.confirmReject(status)
      break;
  }

}

confirmAccept(status: boolean) {
  if (status && this.popupObject.training_id) {
    this._profileTrainingService.onAccept(this.popupObject.training_id).subscribe(() => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.clearPopupObject();
      this.getprofileTraining();
    });
  }
  else {
    this.clearPopupObject();
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);
  this.getprofileTraining();
}

confirmReject(status: boolean) {
  if (status && this.popupObject.training_id) {
    this._profileTrainingService.onReject(this.popupObject.training_id).subscribe(() => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.clearPopupObject();
      this.getprofileTraining();
    });
  }
  else {
    this.clearPopupObject();
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);
  this.getprofileTraining();
}


  getDaysDiffer(day1){
    let dt = new Date();
    let tot_days = Math.round(this._helperService.daysFromDate(day1, dt));
    // console.log(tot_days);
    return this._helperService.daysConversion(tot_days);
  }

  //  /**
  //  * changing the number of days in to month and years
  //  * @param days -number of days
  //  */
  //   createDaysString(days) {
  //     let day_string = this._helperService.daysConversion(days);
  //   }

  // getTime(date){
  //   let t = date.split(" ")
  //   return t[1]
  // }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy(){
   this.popupControlEventSubscription.unsubscribe();
   ProfileTrainingStore.loaded = false;
  }
}
