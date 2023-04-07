import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { MsAuditService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-opening-meeting-participants',
  templateUrl: './opening-meeting-participants.component.html',
  styleUrls: ['./opening-meeting-participants.component.scss']
})
export class OpeningMeetingParticipantsComponent implements OnInit {

  @Input('source') source: any;
  MsAuditStore=MsAuditStore;
  todayDate: any = new Date();
  dateValid:boolean=false;
  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  UsersStore = UsersStore;
  AppStore = AppStore;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _msAuditService: MsAuditService,
    private _usersService: UsersService,
    private _imageService: ImageServiceService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      opening_start_date: ['', [Validators.required]],
      //closing_end_date: ['',[Validators.required]],
      participant_ids:[[],[Validators.required]],
    });
     //console.log(this.source)
    if (this.source)
    this.setFormData();
  }
  

  createDateTimeValidator(flag) {
    if (flag) 
      return this.todayDate;
    else 
      return this.form.value.opening_start_date?this.form.value.opening_start_date:this.todayDate;
  }

  setFormData() {
    this.form.patchValue({
      opening_start_date: this.source.start_date ? new Date(this.source?.start_date) : '',
      participant_ids: MsAuditStore.individualMsAuditDetails?.opening_participants ? this._helperService.getArrayProcessed(MsAuditStore.individualMsAuditDetails?.opening_participants,false) : [],
    });
    // this.validationCheck(new Date(this.source?.start_date));
  }

  getSaveData() {
    this.saveData = {
      opening_start_date: this.form.value.opening_start_date ? this._helperService.passSaveFormatDate(this.form.value.opening_start_date) : '',
      participant_ids:this.form.value.participant_ids.length?this._helperService.getArrayProcessed(this.form.value.participant_ids, 'id') : [],
    }

  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }
  
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getUsers() {
    var params = '';
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUsers(e) {
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  save(close: boolean = false) {
    if (this.form.value) {

      let save;
      AppStore.enableLoading();

      this.getSaveData();

      if (this.form.value) {
        save = this._msAuditService.openMeeting(this.source.id, this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.resetForm();
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (close) this.cancel();
        },
        (err: HttpErrorResponse) => {

          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  validationCheck(startDate){
    //console.log("hi");
    if(this.todayDate.getTime() < startDate.getTime()){
      this.dateValid=false;
    }else{
      this.dateValid=true;
    }
  }

  cancel(){
    this.resetForm()
    this._eventEmitterService.dismissAuditMeetingParticipants()
  }

  resetForm() {
    this.dateValid=false;
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
