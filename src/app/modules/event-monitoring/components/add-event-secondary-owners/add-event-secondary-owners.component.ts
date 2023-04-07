import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { EventTeamService } from "src/app/core/services/event-monitoring/event-team/event-team.service";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { toJS } from 'mobx';
@Component({
  selector: 'app-add-event-secondary-owners',
  templateUrl: './add-event-secondary-owners.component.html',
  styleUrls: ['./add-event-secondary-owners.component.scss']
})
export class AddEventSecondaryOwnersComponent implements OnInit {
  @Input('source') secondaryOwnersSource: any;
  AppStore=AppStore;
  DepartmentMasterStore=DepartmentMasterStore;
  UsersStore=UsersStore;
  secondaryOwnerForm: FormGroup;
  formErrors: any;
  constructor(
    private _helperService: HelperServiceService,private _imageService: ImageServiceService,
    private _eventTeamsService: EventTeamService,private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef, private _userService: UsersService, private _departmentService: DepartmentService,
  ) { }

  ngOnInit(): void {
    this.secondaryOwnerForm = this._formBuilder.group({
      secondary_owner_ids:[[],[Validators.required]],
      secondary_department_ids:[[],[Validators.required]],
    })
    if (this.secondaryOwnersSource.type == 'Edit') {
      //this.setFormValues();
      if(this.secondaryOwnersSource.hasOwnProperty('values') && this.secondaryOwnersSource.values)
      {
        this.setEditForm(this.secondaryOwnersSource.values);
      }
    }
  }

  setEditForm(value)
  {
    this.secondaryOwnerForm.patchValue({
      
      secondary_owner_ids:value.owners?toJS(value.owners):[],
      secondary_department_ids:value.departments?this._helperService.getArrayProcessed(value.departments,'id'):[]
      
    })
    if(this.secondaryOwnerForm?.value.secondary_department_ids.length)
    {
      this.processSecondaryDepartmentIds()
      this.getUsers('secondary_department_ids');
    }
    
  }

  processSecondaryDepartmentIds(){
    let departments = this.secondaryOwnerForm.value.secondary_department_ids;
    for(let i of departments){
      this.getDepartments({term: i},true,'secondary_department_ids')
    }
  }

  
  getDepartments(e?,patchValue:boolean = false,formField?){
    let params = e ? '&q='+e.term : '';
    this._departmentService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            if(!formField){
              this.secondaryOwnerForm.patchValue({ secondary_owner_ids: i.id });
            }
           
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  searchUers(e,departmentFormField?){
    var params = '';
    UsersStore.setAllUsers([])
    if(departmentFormField && this.secondaryOwnerForm.value[departmentFormField] && this.secondaryOwnerForm.value[departmentFormField].toString() != ''){
      params = `&department_ids=${this.secondaryOwnerForm.value[departmentFormField].toString()}`;
      this._userService.searchUsers('?q='+e.term+params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      UsersStore.setAllUsers([]);
    }
  }
  // Get all users
  getUsers(departmentFormField?){
    var params = '';
    UsersStore.setAllUsers([])
    if(departmentFormField && this.secondaryOwnerForm.value[departmentFormField] && this.secondaryOwnerForm.value[departmentFormField].toString() != ''){
      params = `?department_ids=${this.secondaryOwnerForm.value[departmentFormField].toString()}`;
      this._userService.getAllItems(params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      UsersStore.setAllUsers([]);
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
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }
  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }
  // Returns default image
  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('user-logo');
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  save(close: boolean = false)
  {
    this.formErrors = null;
    if (this.secondaryOwnerForm.valid) {
      let save;
      AppStore.enableLoading();
      save = this._eventTeamsService.saveSecondaryOwner(this.processDataForSave());
      save.subscribe((res: any) => {
        if (!this.secondaryOwnerForm.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  cancel()
  {
    this._eventEmitterService.dismissEventSecondaryOwnerModal();
  }
  resetForm() {
    this.secondaryOwnerForm.reset();
    this.secondaryOwnerForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  processDataForSave()
  {
    
    const data={
      "secondary_owner_ids":this.secondaryOwnerForm.value.secondary_owner_ids ? this._helperService.getArrayProcessed(this.secondaryOwnerForm.value.secondary_owner_ids,'id') : [],
      "secondary_department_ids":this.secondaryOwnerForm.value.secondary_department_ids.length?this.secondaryOwnerForm.value.secondary_department_ids:[]
    }
    //console.log(data)
    return data;
  }
  resetFormSelectClose()
  {
    this.secondaryOwnerForm.patchValue({
      
      secondary_owner_ids:[],
    })
  }

}
