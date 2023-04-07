
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProfileTrainingService } from 'src/app/core/services/my-profile/profile/profile-training/profile-training.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ProfileTrainingStore } from 'src/app/stores/my-profile/profile/profile-training-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';

declare var $: any;

@Component({
  selector: 'app-user-trainings',
  templateUrl: './user-trainings.component.html',
  styleUrls: ['./user-trainings.component.scss']
})
export class UserTrainingsComponent implements OnInit,OnDestroy {

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
  emptyList = "no_data_found";
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

 
  

  constructor(private _profileTrainingService: ProfileTrainingService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _renderer2: Renderer2,
              private _helperService: HelperServiceService,
              private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.setTrainingType('up-coming');
     
    this.getprofileTraining()

  }
  getprofileTraining() {

    this._profileTrainingService.getProfileTraining(UsersStore.user_id).subscribe(() => {
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


  getDaysDiffer(day1){
    let dt = new Date();
    let tot_days = Math.round(this._helperService.daysFromDate(day1, dt));
    // console.log(tot_days);
    return this._helperService.daysConversion(tot_days);
  }


  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
 ngOnDestroy(){
   ProfileTrainingStore.loaded = false;
 }
  
}
