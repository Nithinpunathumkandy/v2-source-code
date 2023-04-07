import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { AppStore } from 'src/app/stores/app.store';
import { BcpCallTreeService } from "src/app/core/services/bcm/bcp/bcp-call-tree/bcp-call-tree.service";
import { HttpErrorResponse } from '@angular/common/http';
import { BcpCallTreeStore } from "src/app/stores/bcm/bcp/bcp-call-tree-store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

@Component({
  selector: 'app-bcp-call-tree-form',
  templateUrl: './bcp-call-tree-form.component.html',
  styleUrls: ['./bcp-call-tree-form.component.scss']
})
export class BcpCallTreeFormComponent implements OnInit {
  @Input('source') callTreeSource: any;
  form: FormGroup;
  formErrors: any;
  UsersStore = UsersStore;
  BcpCallTreeStore = BcpCallTreeStore;
  userType: string;
  AppStore = AppStore;
  constructor(private _usersService: UsersService, private _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService, private _humanCapitalService: HumanCapitalService,
    private _formBuilder: FormBuilder, private _bcpCallTreeService: BcpCallTreeService, private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.userType = 'internal';
    this.form = this._formBuilder.group({
      id: [null],
      user_id: [null],
      name: [''],
      email : [''],
      mobile : [''],
      designation : [''],
      reporting_to : [null],
      business_continuity_plan_id: [null],
      business_continuity_plan_version_id: [null]
    });
    this.changeUserType(this.userType);
    this.form.patchValue({business_continuity_plan_id: this.callTreeSource.bcpId});
    this.form.patchValue({business_continuity_plan_version_id: this.callTreeSource.bcpVersionId});
    if(this.callTreeSource.userId) this.form.patchValue({reporting_to: this._helperService.getTypeCastedValue(this.callTreeSource.userId)});
    if(this.callTreeSource.values){
      this.setFormValues();
    }
    this._utilityService.detectChanges(this._cdr);
  }

  setFormValues(){
    if(this.callTreeSource.values.user_id){
      this.changeUserType('internal');
      this.form.patchValue({ user_id: this.callTreeSource.values.user.id })
      if(this.callTreeSource.values.reporting_to) this.form.patchValue({ reporting_to: this._helperService.getTypeCastedValue(this.callTreeSource.values.reporting_to)  })
      this.searchUsers({term: this.callTreeSource.values.user.id})
    }
    else{
      this.changeUserType('external');
      if(this.callTreeSource.values.reporting_to) this.form.patchValue({ reporting_to: this._helperService.getTypeCastedValue(this.callTreeSource.values.reporting_to)})
      this.form.patchValue({ name: this.callTreeSource.values.name })
      this.form.patchValue({ email: this.callTreeSource.values.email })
      this.form.patchValue({ mobile: this.callTreeSource.values.mobile })
      this.form.patchValue({ designation: this.callTreeSource.values.designation })
    }
    this.form.patchValue({ id: this.callTreeSource.values.id });
    this._utilityService.detectChanges(this._cdr);
  }

  getUsers() {
    this._usersService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  changeUserType(type){
    this.userType = type;
    if(type == 'internal'){
      this.form.controls['user_id'].setValidators(Validators.required);
      this.form.controls['name'].reset();
      this.form.controls['email'].reset();
      this.form.controls['mobile'].reset();
      this.form.controls['designation'].reset();
      this.form.controls['name'].setErrors(null);
      this.form.controls['email'].setErrors(null);
      this.form.controls['mobile'].setErrors(null);
      this.form.controls['designation'].setErrors(null);
    }
    else{
      this.form.controls['name'].setValidators(Validators.required);
      this.form.controls['email'].setValidators(Validators.required);
      this.form.controls['mobile'].setValidators(Validators.required);
      this.form.controls['designation'].setValidators(Validators.required);
      this.form.controls['user_id'].reset();
      this.form.controls['user_id'].setErrors(null);
    }
    this.form.updateValueAndValidity();
    this._utilityService.detectChanges(this._cdr);
  }

  // search users
  searchUsers(e) {
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

   // Returns default image url
   getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  customTreeSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['external_user_name'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  save(close: boolean = false){
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.callTreeSource.values) {
        save = this._bcpCallTreeService.updateItem(this.form.value,this.callTreeSource.bcpId,this.callTreeSource.values.id);
      } else {
        save = this._bcpCallTreeService.saveItem(this.form.value,this.callTreeSource.bcpId);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (!this.form.value.id)
          this.resetFormDetails();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if(err.status == 403 || err.status == 500){
          this.closeFormModal();
        }
        else{
          this._utilityService.showErrorMessage('error', "something_went_wrong_try_again");
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  closeFormModal(){
    this.resetFormDetails();
    this._eventEmitterService.dismissCallTreeModal();
  }

  resetFormDetails(){
    this.form.reset();
  }

}
