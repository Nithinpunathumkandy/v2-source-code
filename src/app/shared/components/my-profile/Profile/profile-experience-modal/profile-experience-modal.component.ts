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
  selector: 'app-profile-experience-modal',
  templateUrl: './profile-experience-modal.component.html',
  styleUrls: ['./profile-experience-modal.component.scss']
})
export class ProfileExperienceModalComponent implements OnInit {

  @Input('source') ProfileExperience: any;

  UsersStore = UsersStore;
  form:FormGroup;
  AppStore = AppStore;
  formErrors: any;
  Savebutton:boolean = false;
  SaveClosebutton:boolean = false;
  CancelButton:boolean = false;
  constructor(private _formBuilder:FormBuilder,
              private _eventEmitterService:EventEmitterService,
              private _helperService:HelperServiceService,
              private _utilityService:UtilityService,
              private _cdr:ChangeDetectorRef,
              private _profileService:MyprofileProfileService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({

      id: [''],
      company: ['', [Validators.required, Validators.maxLength(255)]],
      designation: ['', [Validators.required, Validators.maxLength(255)]],
      location:[''],
      start: [null, [Validators.required]],
      end: [null]
    });

    this.resetForm();
    if (this.ProfileExperience) {
      this.setFormValues();
    }
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  setFormValues(){
    if(this.ProfileExperience.hasOwnProperty('values') && this.ProfileExperience.values){
      let {id,company,designation,location,start,end} = this.ProfileExperience.values
      this.form.setValue({
        id:id,
        company:company,
        designation:designation,
        location:location,
        start:start,
        end:end
      })
    }
  }

  ngDoCheck(){
    if (this.ProfileExperience && this.ProfileExperience.hasOwnProperty('values') && this.ProfileExperience.values && !this.form.value.id)
      this.setFormValues();
  }

  closeWorkFormModal(){
    this.CancelButton = true;
    this.resetForm();
    this._eventEmitterService.dismissProfileQualificationModal();
    this.CancelButton = false;
  }

  saveWorkExperience(close:boolean = false){
    
    this.formErrors = null;
    // if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      this.SaveClosebutton = close ? true:false ;
      this.Savebutton = close ? false:true ;

      let tempstartdate = this.form.value.start;
      this.form.patchValue({
        start: this._helperService.processDate(tempstartdate, 'join')//converting date format
      })

      let tempenddate = this.form.value.end;
      this.form.patchValue({
        end: this._helperService.processDate(tempenddate, 'join')
      })

      if (this.form.value.id) {
        save = this._profileService.updateWorkExperience(this.form.value.id, this.form.value);
      } else {
        let saveData = {
          company: this.form.value.company ? this.form.value.company : '',
          designation: this.form.value.designation ? this.form.value.designation : '',
          location:this.form.value.location?this.form.value.location:'',
          start: this.form.value.start ? this.form.value.start : null,
          end: this.form.value.end ? this.form.value.end : null
        }
        save = this._profileService.saveWorkExperience(saveData);

      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        this.Savebutton = false;
        this.SaveClosebutton = false;
        this.form.patchValue({
          start: tempstartdate,
          end:tempenddate
        })
        if (!this.form.value.id) {
          this.form.reset();
          this.form.markAsPristine();
        }


        this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.form.reset();
          this.closeWorkFormModal();

        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this.Savebutton = false;
          this.SaveClosebutton = false;
        }
        if (err.status == 403 || err.status == 500) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this.closeWorkFormModal();
          this.Savebutton = false;
        }
      });
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
