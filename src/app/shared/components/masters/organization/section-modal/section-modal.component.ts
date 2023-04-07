import { Component, OnInit, Input, ChangeDetectorRef,HostListener } from '@angular/core';
import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

@Component({
  selector: 'app-section-modal',
  templateUrl: './section-modal.component.html',
  styleUrls: ['./section-modal.component.scss']
})
export class SectionModalComponent implements OnInit {
  @Input('source') SectionSource: any;

  AppStore = AppStore;
  UsersStore = UsersStore;
  AuthStore = AuthStore;
  SubsidiaryStore = SubsidiaryStore;
  DepartmentMasterStore = DepartmentMasterStore;
  DivisionMasterStore = DivisionMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  form: FormGroup;
  formErrors: any;
  divisionId: number = null;
  color: any;

  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _subsiadiaryService: SubsidiaryService,
    private _departmentService: DepartmentService,
    private _helperService: HelperServiceService,
    private _sectionService: SectionService,
    private _utilityService: UtilityService, 
    private _divisionService: DivisionService,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    ) { }

  ngOnInit(): void {

    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      organization_id: [null, [Validators.required]],
      head_id: [''],
      code: ['', Validators.required],
      department_id: [null],
      color_code:['']
    });

    if(OrganizationLevelSettingsStore.organizationLevelSettings.is_department == AppStore.activeStatusId){
      this.form.get('department_id').setValidators([Validators.required])
    }

    // restingForm on initial load
    this.resetForm();

    // for open organization

    this.getOrganization();


    // Checking if Source has Values and Setting Form Value

    if (this.SectionSource) {
      this.setFormValues();
    }

    // set initial value for add
    if(this.SectionSource.type == 'Add')
    this.setInitialOrganizationLevels();

  }

  ngDoCheck(){
    if (this.SectionSource && this.SectionSource.hasOwnProperty('values') && this.SectionSource.values && !this.form.value.id)
      this.setFormValues();
  }

  // setFormValues(){
  //   if (this.SectionSource.hasOwnProperty('values') && this.SectionSource.values) {
  //     this.form.setValue({
  //       id: this.SectionSource.values.id,
  //       title: this.SectionSource.values.title,
  //       organization_id: this.SectionSource.values.organization_id.id,
  //       head_id: this.SectionSource.values.head_id,
  //       division_id: this.SectionSource.values.division_id ? this.SectionSource.values.division_id.id : null,
  //       department_id: this.SectionSource.values.department_id ? this.SectionSource.values.department_id.id : null,
  //       code: this.SectionSource.values.code,
  //       color_code:this.SectionSource.values.color_code?this.SectionSource.values.color_code:null
  //     })
  //     this.color=  this.SectionSource.values.color_code?this.SectionSource.values.color_code:null;
  //     // if(this.form.get('head_id').value) this.searchUsers({term: this.form.get('head_id').value.id});
  //     // // this.searchDivision({term: this.divisionId});
  //     // if(this.form.get('divisionId').value) this.searchDivision({term: this.form.get('divisionId').value});
  //     // if(this.form.get('department_id').value) this.searchDepartment({term: this.form.get('department_id').value});
  //        this.divisionId = division_id;
  //         if(this.form.get('head_id').value) this.searchUsers({term: this.form.get('head_id').value.id});
  //         this.searchDivision({term: this.divisionId});
      
  //     // this.searchDepartment({term: department_id});
  //   }
  // }

  setFormValues(){
    if (this.SectionSource.hasOwnProperty('values') && this.SectionSource.values) {
      let { id, title, organization_id, department_id, division_id,color_code, head_id, code } = this.SectionSource.values
      this.form.patchValue({
        id: id,
        title: title,
        organization_id: organization_id ? organization_id.id : null,
        department_id: department_id ? department_id.id: null,
        color_code:color_code,
        head_id: head_id,
        code: code,
      })
      this.color = color_code;
      this.divisionId = division_id ? division_id.id : null;
      if(this.form.get('head_id').value) this.searchUsers({term: this.form.get('head_id').value.id});
      this.searchDivision({term: this.divisionId});
      this.searchDepartment({term: department_id.id});
    }
  }

   // for searching the users

   searchUsers(event) {
    let params = '';
    if(this.form.get('organization_id').value){
      if(this.form.get('organization_id').value)
        params = params + `&organization_ids=${this.form.get('organization_id').value}`;
      // if(this.form.get('division_id').value){
      //   if (params)
      //     params = params + `&division_ids=${this.form.get('division_id').value}`;
      //   else
      //     params = `&division_ids=${this.form.get('division_id').value}`;
      // }
      if(this.form.get('department_id').value){
        if (params)
          params = params + `&department_ids=${this.form.get('department_id').value}`;
        else
          params = `&department_ids=${this.form.get('department_id').value}`;
      }
      if(this.form.value.id){
        if (params)
          params = params + `&section_ids=${this.form.value.id}`;
        else
          params = `&section_ids=${this.form.value.id}`;
      }
      this._userService.searchUsers('?q=' + event.term+params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
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
        this.form.controls["department_id"].reset();
        DepartmentMasterStore.setAllDepartment([]);
        this.getDepartment();
        break;
      case 'department':
        this.form.controls["head_id"].reset();
       this.getUsers();
       break;
       
      default:
        break; 
    }

  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }


  getUsers() {
    let params= '';
    if(this.form.get('organization_id').value){
      if(this.form.get('organization_id').value)
        params = params + `?organization_ids=${this.form.get('organization_id').value}`;
      // if(this.form.get('division_id').value){
      //   if (params)
      //     params = params + `&division_ids=${this.form.get('division_id').value}`;
      //   else
      //     params = `&division_ids=${this.form.get('division_id').value}`;
      // }
      if(this.form.get('department_id').value){
        if (params)
          params = params + `&department_ids=${this.form.get('department_id').value}`;
        else
          params = `&department_ids=${this.form.get('department_id').value}`;
      }
      if(this.form.value.id){
        if (params)
          params = params + `&section_ids=${this.form.value.id}`;
        else
          params = `&section_ids=${this.form.value.id}`;
      }
       
      this._userService
      .getAllItems(params)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
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



  getOrganization() {
    this._subsiadiaryService.getAllItems().subscribe((res:any) => {
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


  getDepartment() {
    let params= '';
    if(this.form.get('organization_id').value) {
      if (params)
        params = params + `&organization_ids=${this.form.get('organization_id').value}`;
      else
        params=`&organization_ids=${this.form.get('organization_id').value}`;
      if(this.divisionId){
        if(params)
          params = params + '&division_ids='+this.divisionId;
        else
          params = '&division_ids='+this.divisionId;
      }
      this._departmentService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      this.form.controls["department_id"].reset();
      DepartmentMasterStore.setAllDepartment([]);
    }

  }

  // for searching the department

  searchDepartment(event) {

    let params = '';
    if(this.form.get('organization_id').value){
      params = params + `&organization_ids=${this.form.get('organization_id').value}`;
      if(this.divisionId){
        if(params)
          params = params + '&division_ids='+this.divisionId;
        else
          params = '&division_ids='+this.divisionId;
      }
      this._departmentService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
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

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.color=''
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
    this._eventEmitterService.dismissOrganizationSectionControlModal();
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
      if (this.form.value.id) {
        save = this._sectionService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._sectionService.saveItem(this.form.value);
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

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

   // Returns default image
   getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
} 

setInitialOrganizationLevels(){
  this.form.patchValue({
    department_id:AuthStore.user.department ? AuthStore.user.department.id : null,
    organization_id: AuthStore?.user?.organization ? AuthStore?.user?.organization?.id : null
  });
  this.divisionId = AuthStore.user.division ? AuthStore.user.division.id : null;
  // if(OrganizationLevelSettingsStore?.organizationLevelSettings?.is_subsidiary){
  //   this.form.patchValue({ organization_id: AuthStore?.user?.organization.id});
  // }
  if(OrganizationLevelSettingsStore?.organizationLevelSettings?.is_division) this.searchDivision({term: this.divisionId});
  this.searchDepartment({term: this.form.value.department_id});
  this._utilityService.detectChanges(this._cdr);
}
}


