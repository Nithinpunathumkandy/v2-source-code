import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-department-modal',
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.scss']
})
export class DepartmentModalComponent implements OnInit {
  @Input('source') DepartmentSource: any;

  AppStore = AppStore;
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  SubsidiaryStore = SubsidiaryStore;
  DivisionMasterStore = DivisionMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  form: FormGroup;
  formErrors: any;

  color='';
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _divisionService: DivisionService,
    private _userService: UsersService,
    private _subsiadiaryService: SubsidiaryService,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _departmentService: DepartmentService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      organization_id: ['', [Validators.required]],
      head_id: [''],
      division_id: [''],
      code: ['', Validators.required],
      order:[''],
      color_code:['']
    });

    if(OrganizationLevelSettingsStore.organizationLevelSettings.is_division == AppStore.activeStatusId){
      this.form.get('division_id').setValidators([Validators.required])
    }

    // restingForm on initial load
    this.resetForm();

    if(this.DepartmentSource.type == 'Add')
      this.setInitialOrganizationLevels();

    // for open organization

    this.getOrganization();

    // Checking if Source has Values and Setting Form Value

    if (this.DepartmentSource) {
      this.setFormValues();
    }

  }

  ngDoCheck(){
    if (this.DepartmentSource && this.DepartmentSource.hasOwnProperty('values') && this.DepartmentSource.values && !this.form.value.id)
      this.setFormValues();
  }

  titleChange(e){
    let title = e.target.value.split(' ');
    let code = ''
    for(let i of title){
      code += i.charAt(0).toUpperCase();
    }
    this.form.patchValue({
      code: code
    });
    this._utilityService.detectChanges(this._cdr);
  }

  setFormValues(){
    if (this.DepartmentSource.hasOwnProperty('values') && this.DepartmentSource.values) {
      this.form.setValue({
        id: this.DepartmentSource.values.id,
        title: this.DepartmentSource.values.title,
        organization_id: this.DepartmentSource.values.organization_id.id,
        head_id: this.DepartmentSource.values.head_id,
        division_id: this.DepartmentSource.values.division_id ? this.DepartmentSource.values.division_id.id : null,
        code: this.DepartmentSource.values.code,
        order:this.DepartmentSource.values.order,
        color_code:this.DepartmentSource.values.color_code?this.DepartmentSource.values.color_code:null
      })
      this.color=  this.DepartmentSource.values.color_code?this.DepartmentSource.values.color_code:null;
      if(this.form.get('head_id').value) this.searchUsers({term: this.form.get('head_id').value.id});
      if(this.form.get('division_id').value) this.searchDivision({term: this.form.get('division_id').value});
    }
  }



  getUsers() {
    let params= '';
    if(this.form.get('organization_id').value){
      if(this.form.get('organization_id').value)
        params = params + `?organization_ids=${this.form.get('organization_id').value}`;
      if(this.form.get('division_id').value){
        if (params)
          params = params + `&division_ids=${this.form.get('division_id').value}`;
        else
          params = `&division_ids=${this.form.get('division_id').value}`;
      }
      if(this.form.value.id){
        if (params)
          params = params + `&department_ids=${this.form.value.id}`;
        else
          params = `&department_ids=${this.form.value.id}`;
      }
       
      this._userService
      .getAllItems(params)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getOrganization() {
    this._subsiadiaryService.getAllItems(false).subscribe((res:any) => {
      if(!OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary){
        this.form.patchValue({organization_id: res.data[0].id});
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }



  getDivision() {
    let params='';
    if (this.form.get('organization_id').value) {
      params = `&organization_ids=${this.form.get('organization_id').value}`;
      this._divisionService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      DivisionMasterStore.setAllDivision([]);
    }

  }

  eventChange(type){

    switch(type){

      case 'organization':
        this.form.controls["division_id"].reset();
        DivisionMasterStore.setAllDivision([]);
        this.getDivision();
        break;

      case 'division':
        this.form.controls["head_id"].reset();
       this.getUsers();
       break;
       
      default:
        break; 
    }

  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage() {
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

  searchUsers(event) {
    let params = '';
    if(this.form.get('organization_id').value){
      if(this.form.get('organization_id').value)
        params = params + `&organization_ids=${this.form.get('organization_id').value}`;
      if(this.form.get('division_id').value){
        if (params)
          params = params + `&division_ids=${this.form.get('division_id').value}`;
        else
          params = `&division_ids=${this.form.get('division_id').value}`;
      }
      if(this.form.value.id){
        if (params)
          params = params + `&department_ids=${this.form.value.id}`;
        else
          params = `&department_ids=${this.form.value.id}`;
      }
      this._userService.searchUsers('?q=' + event.term+params).subscribe((res) => {
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

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }

  // for searching division
  searchDivision(event) {
    let params= '';
    if(this.form.get('organization_id').value){
      if(this.form.get('organization_id').value)
        params = params + `&organization_ids=${this.form.get('organization_id').value}`;
      this._divisionService.getItems(false, '&q=' + event.term+params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }

  }


  

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissOrganizationDepartmentControlModal();
  }

  // for save
  save(close: boolean = false) {
    this.formErrors = null;
    this.form.patchValue({
      color_code:this.color?this.color:''
    })
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if(this.form.value.head_id){
        let head =this.form.value.head_id.id;
        this.form.value.head_id = head;
      }
      let saveData = this.form.value;
      if(!OrganizationLevelSettingsStore.organizationLevelSettings.is_division){
        delete saveData.division_id
      }
      if (this.form.value.id) {
        save = this._departmentService.updateItem(this.form.value.id, saveData);
      } else {
        delete this.form.value.id
        save = this._departmentService.saveItem(saveData);
      }

      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          // this.resetForm();
          this.form.controls['title'].reset();
          this.form.controls['head_id'].reset();
          this.form.controls['code'].reset();
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

setInitialOrganizationLevels(){
  this.form.patchValue({
    division_id: AuthStore.user.division ? AuthStore.user.division.id : null,
    organization_id: AuthStore?.user?.organization ? AuthStore?.user?.organization.id : null
  });
  // if(OrganizationLevelSettingsStore?.organizationLevelSettings?.is_subsidiary){
  //   this.form.patchValue({ organization_id: AuthStore?.user?.organization.id});
  // }
  if(OrganizationLevelSettingsStore?.organizationLevelSettings?.is_division) this.searchDivision({term: this.form.value.division_id});
  this._utilityService.detectChanges(this._cdr);
}
}

