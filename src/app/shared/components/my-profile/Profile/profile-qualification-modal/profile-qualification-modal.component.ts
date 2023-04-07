import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MyprofileProfileService } from 'src/app/core/services/my-profile/profile/profile/myprofile-profile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Component({
  selector: 'app-profile-qualification-modal',
  templateUrl: './profile-qualification-modal.component.html',
  styleUrls: ['./profile-qualification-modal.component.scss']
})
export class ProfileQualificationModalComponent implements OnInit {

  @Input('source') ProfileQualification: any;

  qualificationForm:FormGroup;
  AppStore = AppStore;
  formErrors: any;
  Savebutton:boolean = false;
  CancelButton:boolean = false;
  qualification_year = [];

  constructor(private _formBuilder:FormBuilder,
              private _eventEmitterService:EventEmitterService,
              private _cdr: ChangeDetectorRef,
              private _helperService:HelperServiceService,
              private _profileService:MyprofileProfileService,
              private _utilityService: UtilityService,) { }

  ngOnInit(): void {
    this.getYears();
    
    this.qualificationForm = this._formBuilder.group({

      id: [''],
      school: ['', [Validators.required]],
      degree: ['', [Validators.required]],
      start: [null, [Validators.required]],
      end: [null]
    });
    

    this.resetForm();
    if (this.ProfileQualification) {
      this.setFormValues();
    }
  }

  resetForm() {
    this.qualificationForm.reset();
    this.qualificationForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  setFormValues(){
    if(this.ProfileQualification.hasOwnProperty('values') && this.ProfileQualification.values){
      let {id,school,degree,start,end} = this.ProfileQualification.values
      this.qualificationForm.setValue({
        id:id,
        school:school,
        degree:degree,
        start:start,
        end:end
      })
    }
  }

  ngDoCheck(){
    if (this.ProfileQualification && this.ProfileQualification.hasOwnProperty('values') && this.ProfileQualification.values && !this.qualificationForm.value.id)
      this.setFormValues();
  }

  getYears() {
    for (let i = UsersStore.currentDate.getFullYear() - 100; i <= UsersStore.currentDate.getFullYear(); i++) {
      this.qualification_year.push(i);
    }
  }

  saveQualification(close: boolean = false){
    this.formErrors = null;
    if (this.qualificationForm.valid) {
      let save;
      AppStore.enableLoading();
      this.Savebutton =true;

      if (this.qualificationForm.value.id) {
        save = this._profileService.updateQualification(this.qualificationForm.value.id,this.qualificationForm.value);
      } else {
        let saveData = {
          school: this.qualificationForm.value.school ? this.qualificationForm.value.school : '',
          degree: this.qualificationForm.value.degree ? this.qualificationForm.value.degree : '',
          start: this.qualificationForm.value.start ? this.qualificationForm.value.start : null,
          end: this.qualificationForm.value.end ? this.qualificationForm.value.end : null
        }
        save = this._profileService.saveQualification(saveData);

      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        this.Savebutton = false;
        if (!this.qualificationForm.value.id) {
          this.qualificationForm.reset();
          this.qualificationForm.markAsPristine();
        }
        this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.qualificationForm.reset();
          this.closeQualificationFormModal();

        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this.Savebutton = false;
        }
        if (err.status == 403 || err.status == 500) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this.closeQualificationFormModal();
          this.Savebutton = false;
        }
      });
    }
  }

  closeQualificationFormModal(){
    this.CancelButton = true;
    this.resetForm();
    this._eventEmitterService.dismissProfileQualificationModal();
    this.CancelButton = false;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
