import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TrainingsService } from 'src/app/core/services/training/trainings/trainings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';

@Component({
  selector: 'app-training-complete-modal',
  templateUrl: './training-complete-modal.component.html',
  styleUrls: ['./training-complete-modal.component.scss']
})
export class TrainingCompleteModalComponent implements OnInit {
  @Input("source") completeSource: any;
  
  AppStore = AppStore;
  TrainingsStore = TrainingsStore;
  trainingCompleteForm: FormGroup;
  formError: any;
  
  participantsMarks = [];
  attendanceMarks = [];

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
    created_at:null
  }

  constructor(private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _trainingService: TrainingsService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.setPresentUsers();
  }
  setPresentUsers() {
    for(let user of TrainingsStore.trainingDetails?.participants?.participants) {
      this.participantsMarks.push({
        user_id: user.user.id,
        is_accepted: user.is_accepted ? user?.is_accepted : null,
        is_present:  user.is_rejected?false:true ,
        is_rejected: user.is_rejected?true:false,
        is_absent: user.is_rejected? true : false,
      })
    }
    
  }
  participantsMarked(value,marks){
    let participationObject = {
      user_id: value?.user?.id ? value?.user?.id : null,
      is_accepted: value?.is_accepted ? value?.is_accepted : null,
      is_present: marks == 'present' ? true : null,
      is_rejected: value?.is_rejected ? value?.is_rejected : null,
      is_absent: marks == 'absent' ? true : null,
    }
    for (let i = 0; i < this.participantsMarks?.length; i++) {
      if (value?.user?.id == this.participantsMarks[i]?.user_id) {
        this.participantsMarks.splice(i, 1);
      }
    }
    this.participantsMarks.push(participationObject);
  }

  save(close) {
    let save;
    let saveData;
    AppStore.enableLoading();
      saveData = {
        participants: this.participantsMarks ? this.participantsMarks : null,
      }
     
      save = this._trainingService.completed(this.completeSource.id,saveData);

    save.subscribe((res: any) => {
      AppStore.disableLoading();

      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);           
        this.participantsMarks = [];
        if(close) 
        this.closeFormModal();      
      }, 300);

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) { 
        this.formError = err.error.errors;
      }
      else if (err.status == 500 || err.status == 404) {
        AppStore.disableLoading();
        this.participantsMarks = [];
        this.closeFormModal();
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  closeFormModal() {
    this._eventEmitterService.dismissTrainingCompleteModal();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getPopupDetails(user) {
    if(user){
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

  conditionCheck(user,marks){
    for(let i of this.participantsMarks){
      if(i.user_id == user?.id){
        if(marks == 'present' && i.is_present == true){
          return true;
        }
        else if(marks == 'absent' && i.is_absent == true){
          return true;
        }
      }
    }
  }
}
