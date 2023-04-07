import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-division-modal',
  templateUrl: './division-modal.component.html',
  styleUrls: ['./division-modal.component.scss']
})
export class DivisionModalComponent implements OnInit {
  @Input('source') DivisionSource: any;

  organization_id:number;
  AppStore = AppStore;
  UsersStore = UsersStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  SubsidiaryStore = SubsidiaryStore;
  form: FormGroup;
  formErrors: any;
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _divisionService: DivisionService,
    private _userService: UsersService,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _subsiadiaryService: SubsidiaryService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      organization_id: ['',[Validators.required]],
      head_id: ['']
    });


    // restingForm on initial load
    this.resetForm();


    // for open organization

    this.getOrganization();
    this.getAllUsers();



    // Checking if Source has Values and Setting Form Value

    if (this.DivisionSource) {
      this.setFormValues();
    }
    if(this.DivisionSource.type == 'Add')
      this.setInitialOrganizationLevels();

  }

  ngDoCheck(){
    if (this.DivisionSource && this.DivisionSource.hasOwnProperty('values') && this.DivisionSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.DivisionSource.hasOwnProperty('values') && this.DivisionSource.values) {
      this.form.setValue({
        id: this.DivisionSource.values.id,
        title: this.DivisionSource.values.title,
        organization_id: this.DivisionSource.values.organization_id.id,
        head_id: this.DivisionSource.values.head_id
      })
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }

  getOrganization() {
    this._subsiadiaryService.getAllItems().subscribe((res:any) => {
      if(!OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary){
        this.form.patchValue({organization_id: res.data[0].id});
      }
      this._utilityService.detectChanges(this._cdr);
    })


  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  // Returns default image
  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('user-logo');
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
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  // for searching the users

  searchUsers(e) {
    let params = '';
    if(this.form.get('organization_id').value){
      if(this.form.get('organization_id').value)
        params = params + `&organization_ids=${this.form.get('organization_id').value}`;
      if(this.form.value.id){
        if (params)
          params = params + `&division_ids=${this.form.value.id}`;
        else
          params = `&division_ids=${this.form.value.id}`;
      }
      this._userService.searchUsers('?q=' + e.term+params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }

  }

  // for searching organization

  searchOrganization(event) {
    if(OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary){
      this._subsiadiaryService.getAllItems(false, '&q=' + event.term).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  setInitialOrganizationLevels(){
    this.form.patchValue({
      organization_id:AuthStore.user.organization ? AuthStore.user.organization.id : null,
    });
    this._utilityService.detectChanges(this._cdr);
  }

  getAllUsers() {
    let params= '';
    if(this.form.get('organization_id').value){
      if (params)
        params = params + `?organization_ids=${this.form.get('organization_id').value}`;
      else
        params=`?organization_ids=${this.form.get('organization_id').value}`;
      if(this.form.value.id){
        if (params)
          params = params + `&division_ids=${this.form.value.id}`;
        else
          params = `&division_ids=${this.form.value.id}`;
      }
    this._userService
      .getAllItems(params)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }else {
    this.form.controls["head_id"].reset();}
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }
  

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissOrganizationDivisionControlModal();
  }

  // for save
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if(this.form.value.head_id){
        let head =this.form.value.head_id.id;
        this.form.value.head_id = head;
      }

      if (this.form.value.id) {
        save = this._divisionService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._divisionService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          //this.resetForm();
          this.form.controls['title'].reset();
          this.form.controls['head_id'].reset();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        
      });
    }
  }

//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

getStringsFormatted(stringArray,characterLength,seperator){
  return this._helperService.getFormattedName(stringArray,characterLength,seperator);
}

}

