
import { ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { Particpants } from 'src/app/core/models/mrm/meeting-plan/meeting-plan';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';

@Component({
  selector: 'app-meetings-add-participants-model',
  templateUrl: './meetings-add-participants-model.component.html',
  styleUrls: ['./meetings-add-participants-model.component.scss']
})
export class MeetingsAddParticipantsModelComponent implements OnInit, OnChanges {
  @Input ('source') users: any;
  
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;

  UsersStore=UsersStore;
  MeetingPlanStore=MeetingPlanStore;
  reactionDisposer: IReactionDisposer;
  meetingUsers:Particpants[];
  participants=[];
  cancelObject = {
    type: '',
    title: '',
    subtitle: ''
  }
  
  constructor(
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _usersService: UsersService,
    private _imageService: ImageServiceService,
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      meeting_plan_users:[[], [Validators.required]]
    });  

    this.getAllUsers();
  }

  ngOnChanges():void{
    this.meetingUsers=this.users;
  }

  clearCancelObject() {
    this.cancelObject.type = '';
    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';
  }

  // Returns default image
  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  // Get users
  getAllUsers()
  {
    UsersStore.setAllUsers([]);
    this._usersService.getAllItems().subscribe(res=>{

      this.participants=UsersStore.usersList;
      let ids = new Set(this.meetingUsers.map(({ id }) => id));

      this.participants = this.participants.filter(({ id }) => !ids.has(id));
      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchUers(e){
    this._usersService.searchUsers('?q='+e.term).subscribe(res=>{
      this.participants=UsersStore.usersList; 
      let ids = new Set(this.meetingUsers.map(({ id }) => id));
      this.participants = this.participants.filter(({ id }) => !ids.has(id));      
      this._utilityService.detectChanges(this._cdr);
    })
  }


  // cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();
}
     // for resetting the form
resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  AppStore.disableLoading();
}


  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissAddParticipantsModal(this.form.value.meeting_plan_users);
    
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      // let save;
      AppStore.enableLoading();
      this._eventEmitterService.dismissAddParticipantsModal(this.form.value.meeting_plan_users);
        this.closeFormModal();
        this._utilityService.showSuccessMessage('success', 'meeting_participants_has_been_added');
      // if (this.form.value.id) {
      //   // save = this._venueService.updateItem(this.form.value.id, this.form.value);
      // } else {
        //  save = this._venueService.saveItem(this.form.value);
      // }
      // save.subscribe((res: any) => {
      //   if(!this.form.value.id){
      //     this.resetForm();}
      //   AppStore.disableLoading();
      //   setTimeout(() => {
      //     this._utilityService.detectChanges(this._cdr);
      //   }, 500);
      //   if (close) this.closeFormModal();
      // }, (err: HttpErrorResponse) => {
      //   if (err.status == 422) {
      //     this.formErrors = err.error.errors;
      //   }
      //   else if(err.status == 500 || err.status == 403){
      //     this.closeFormModal();
      //   }
      //     AppStore.disableLoading();
      //     this._utilityService.detectChanges(this._cdr);
        
      // });
    }
    }

    //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


}
