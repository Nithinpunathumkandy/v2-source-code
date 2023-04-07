import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { JsoObservationsService } from 'src/app/core/services/jso/jso-observations/jso-observations.service';
import { JsoObservationTypeService } from 'src/app/core/services/masters/jso/jso-observation-type/jso-observation-type.service';
import { UnsafeActionCategoryService } from 'src/app/core/services/masters/jso/unsafe-action-category/unsafe-action-category.service';
import { UnsafeActionObservedGroupService } from 'src/app/core/services/masters/jso/unsafe-action-observed-group/unsafe-action-observed-group.service';
import { UnsafeActionSubCategoryService } from 'src/app/core/services/masters/jso/unsafe-action-sub-category/unsafe-action-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { JsoObservationStore } from 'src/app/stores/jso/jso-observations/jso-observations-store';
import { UnsafeActionCategoryMasterStore } from 'src/app/stores/masters/jso/unsafe-action-category-store';
import { JsoUnsafeActionObservedGroupMasterStore } from 'src/app/stores/masters/jso/unsafe-action-observed-group-store';
import { UnsafeActionSubCategoryMasterStore } from 'src/app/stores/masters/jso/unsafe-action-sub-category-store';
import { JsoObservationTypeMasterStore } from 'src/app/stores/masters/jso/jso-observation-type-store';
import { jsoObservationsPaginationResponse } from 'src/app/core/models/jso/jso-observations/jso-observations.model';
import { UnsafeActionCategoryPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-category';
import { UnsafeActionSubCategoryPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-sub-category';
import { JsoUnsafeActionObservedGroupPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-observed-group';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { Router } from '@angular/router';
import { JsoObservationTypePaginationResponse } from 'src/app/core/models/masters/jso/jso-observation-type';
import { AuthStore } from 'src/app/stores/auth.store';
declare var $: any;

@Component({
  selector: 'app-jso-observations-model',
  templateUrl: './jso-observations-model.component.html',
  styleUrls: ['./jso-observations-model.component.scss']
})
export class JsoObservationsModelComponent implements OnInit {

  @Input('source') formObject: any;

  @ViewChild('observationTypeFormModal', { static: true }) observationTypeFormModal: ElementRef;
  @ViewChild('categoryFormModal', { static: true }) categoryFormModal: ElementRef;
  @ViewChild('subCategoryFormModal', { static: true }) subCategoryFormModal: ElementRef;
  @ViewChild('observedGroupFormModal', { static: true }) observedGroupFormModal: ElementRef;
  @ViewChild('formModal', { static: false }) formModal: ElementRef;

  JsoObservationStore = JsoObservationStore;
  UsersStore = UsersStore;
  AuthStore = AuthStore;
  UnsafeActionCategoryMasterStore = UnsafeActionCategoryMasterStore;
  JsoUnsafeActionObservedGroupMasterStore = JsoUnsafeActionObservedGroupMasterStore;
  UnsafeActionSubCategoryMasterStore = UnsafeActionSubCategoryMasterStore;
  JsoObservationTypeMasterStore = JsoObservationTypeMasterStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  jsoUnsafeActionCategorySubscriptionEvent:any = null;
  jsoUnsafeActionSubCategorySubscriptionEvent:any = null;
  jsoUnsafeActionObservedGroupSubscriptionEvent:any = null;
  jsoObservationTypeSubscriptionEvent:any = null;
  jsoSubscriptionEvent:any = null;

  jsoForm: FormGroup;
  unsafeActionForm: FormGroup;

  unsafeActionsEmpty: boolean = true;
  addUnsafeActions = false;
  formErrors: any;
  networkFailureSubscription:any;
  unsafeSaveButtonEnabled: boolean = false;
  jsoSaveButtonEnabled: boolean = false;

  unsafeActionSubCategorySource = {
    component:'jsoObservation',
    unsafe_action_category_id:null
  }

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null
  }

  unsafeActionFormObject = {
    description: null,
    unsafe_action_category: null,
    unsafe_action_sub_category: null,
    unsafe_action_observed_group: null,
    corrective_action: null,
    corrective_action_target_date: null,
    responsible_user: null,
    // is_accordion_active: null,
    // corrective_action_responsible_user_id:null
  }
  unsafeActionObject = {
    id: null,
    type : null,
    values : null
  };

  selectedIndex = 0;
  //Unsafe Action Variables
  jsoObservationType:number = null;
  unsafeActionCategory: number = null;
  unsafeActionSubCategory: number = null;
  groupObserved: number = null;
  constructor(private _formBuilder: FormBuilder,
    private _router:Router,
    private _renderer2: Renderer2,
    private _service: JsoObservationsService,
    private _usersService: UsersService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _unsafeActionCategoryService: UnsafeActionCategoryService,
    private _jsoUnsafeActionObservedGroupService: UnsafeActionObservedGroupService,
    private _UnsafeActionSubCategoryService: UnsafeActionSubCategoryService,
    private _jsoObservationTypeService: JsoObservationTypeService,
    private _eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
    this.jsoForm = this._formBuilder.group({
      jso_observation_type_id: [null, Validators.required],
      work_area: [''],
      safe_action: [''],
     
    });
    this.unsafeActionForm = this._formBuilder.group({
      description: ['', Validators.required],
      unsafe_action_category: [null, Validators.required],
      unsafe_action_sub_category: [null, Validators.required],
      unsafe_action_observed_group: [null, Validators.required],
      corrective_action: [''],
      corrective_action_target_date: [null],
      responsible_user: [null],
    });

    this.unsafeActionsEmpty = true;
    this.getCategoryList();
    this.getSubCategoryList();
    this.getObservedGroupList();
    this.getObservedTypeList();

    if (this.formObject.type == 'Edit') {
      this.setValue();
    }

    this.jsoSubscriptionEvent = this._eventEmitterService.JsoUnsafeActionModel.subscribe(res => {
      this.closeUnsafeActionModal();
      this.changeZIndex();
    })

    this.jsoUnsafeActionCategorySubscriptionEvent = this._eventEmitterService.jsoUnsafeActionCategory.subscribe(res => {
      this.closeCategoryModal();
      this.changeZIndex();
    })
    this.jsoUnsafeActionSubCategorySubscriptionEvent = this._eventEmitterService.jsoUnsafeActionSubCategory.subscribe(res => {
      this.closeSubCategoryModal();
      this.changeZIndex();
    })
    this.jsoUnsafeActionObservedGroupSubscriptionEvent = this._eventEmitterService.jsoUnsafeActionObservedGroup.subscribe(res => {
      this.closeObservedGroupModal();
      this.changeZIndex();
    })
    this.jsoObservationTypeSubscriptionEvent = this._eventEmitterService.jsoObservationType.subscribe(res => {
      this.closeObservationTypeModal();
      this.changeZIndex();
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
  }

  getCategoryList() {
    this._unsafeActionCategoryService.getItems(false, null, true).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  
  getSubCategoryList() {
    if(this.unsafeActionForm.value.unsafe_action_category){
    this._UnsafeActionSubCategoryService.getItems(false, '&unsafe_action_category_ids='+this.unsafeActionForm.value.unsafe_action_category.id).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }
    else
    this.UnsafeActionSubCategoryMasterStore.unsetUnsafeActionSubCategory();
  }

  getObservedGroupList() {
    this._jsoUnsafeActionObservedGroupService.getItems(false, null, true).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getObservedTypeList() {
    this._jsoObservationTypeService.getItems(false, null, true).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  setValue() {
    this.formErrors = null;
    this.jsoObservationType = this.formObject?.values?.jso_observation_type_id ? this.formObject?.values?.jso_observation_type_id : this.formObject?.values?.jso_observation_type.id;
    this.jsoForm.patchValue({
      jso_observation_type_id: this.formObject?.values?.jso_observation_type_id ? this.formObject?.values?.jso_observation_type_id : this.formObject?.values?.jso_observation_type.id,
      work_area: this.formObject?.values?.work_area ? this.formObject?.values?.work_area : null,
      safe_action: this.formObject?.values?.safe_action ? this.formObject?.values?.safe_action : null,
    })
    this._service.getItem(this.formObject.values.id).subscribe(res => {
      if (JsoObservationStore.jsoObservationsDetails?.unsafe_actions?.length > 0) {
        for (let i = 0; i < JsoObservationStore?.jsoObservationsDetails?.unsafe_actions.length; i++) {
          let data = JsoObservationStore.jsoObservationsDetails.unsafe_actions[i];
          let unsafeActionFormObject = {
            description: data?.description ? data?.description : null,
            unsafe_action_category_id: data?.unsafe_action_category?.id ? data?.unsafe_action_category?.id : null,
            unsafe_action_category: data?.unsafe_action_category?.title ? data?.unsafe_action_category?.title : null,
            unsafe_action_sub_category_id: data?.unsafe_action_sub_category?.id ? data?.unsafe_action_sub_category?.id : null,
            unsafe_action_sub_category: data?.unsafe_action_sub_category?.title ? data?.unsafe_action_sub_category?.title : null,
            unsafe_action_observed_group_id: data?.unsafe_action_observed_group?.id ? data?.unsafe_action_observed_group?.id : null,
            unsafe_action_observed_group: data?.unsafe_action_observed_group?.title ? data?.unsafe_action_observed_group?.title : null,
            corrective_action: data?.corrective_action ? data?.corrective_action : null,
            corrective_action_target_date: data?.corrective_action_target_date ? this._helperService.processDate(data?.corrective_action_target_date,'joint') : null,
            corrective_action_responsible_user_id: data?.corrective_action_responsible_user_id ? data?.corrective_action_responsible_user_id : null,
            corrective_action_responsible_user: data?.corrective_action_responsible_user ? data?.corrective_action_responsible_user : null,
            // is_accordion_active: i == 0 ? true : false
          }
          JsoObservationStore._unsafeActionDetails.push(unsafeActionFormObject);
        }
        this.unsafeActionsEmpty = false;
        this._utilityService.detectChanges(this._cdr);
      }
    })
    JsoObservationStore.getUnsafeActionDetails();
    
  }

  addUnSafeActions(value) {
    // this.addUnsafeActions = value;
    // this.unsafeActionForm.reset();
    // this.unsetUnsafeActionFormVariables();
    this.unsafeActionObject.id = null;
    this.unsafeActionObject.type = 'Add';
    this.unsafeActionObject.values = null; 
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.formModal.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.formModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }

  closeUnsafeActionModal() {
    this._renderer2.removeClass(this.formModal.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setAttribute(this.formModal.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.formModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }

  unsetUnsafeActionFormVariables(){
    this.unsafeActionsEmpty = false;
    this.unsafeActionCategory = null;
    this.unsafeActionSubCategory = null;
  }

  save(close) {
    let save;
    let saveData;
    AppStore.enableLoading();
      saveData = {
        jso_observation_type_id: this.jsoObservationType ? this.jsoObservationType : null,
        work_area: this.jsoForm.value.work_area ? this.jsoForm.value.work_area : null,
        safe_action: this.jsoForm.value.safe_action ? this.jsoForm.value.safe_action : null,
        unsafe_actions: JsoObservationStore?._unsafeActionDetails ? JsoObservationStore?._unsafeActionDetails : null,
      }
     
    if (this.formObject.type == 'Add')
      save = this._service.saveItem(saveData);
    if (this.formObject.type == 'Edit')
      save = this._service.updateItem(this.formObject.id, saveData);

    save.subscribe((res: any) => {
      JsoObservationStore.jso_id = res.id;
      AppStore.disableLoading();

      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if(this.formObject.type == 'Add'){
          this.jsoObservationType = null;
          this.jsoForm.reset();
          JsoObservationStore._unsafeActionDetails = [];
          this.unsafeActionsEmpty = true;
        }
        
        if (close) {
          this.closeFormModal();
          this.jsoObservationType = null;
          this.jsoForm.reset();
          JsoObservationStore._unsafeActionDetails = [];
        }

      }, 300);

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) { 
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 404) {
        AppStore.disableLoading();
        this.closeFormModal();
        this.jsoObservationType = null;
        this.jsoForm.reset();
        JsoObservationStore._unsafeActionDetails = [];
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  saveUnSafeAction(close) {
    AppStore.enableLoading();
    let unsafeDetailsObject = {
      description: this.unsafeActionForm?.value?.description ? this.unsafeActionForm?.value?.description : null,
      unsafe_action_category_id: this.unsafeActionForm?.value?.unsafe_action_category?.id ? this.unsafeActionForm?.value?.unsafe_action_category?.id : null,
      unsafe_action_category: this.unsafeActionForm?.value?.unsafe_action_category?.title ? this.unsafeActionForm?.value?.unsafe_action_category?.title : null,
      unsafe_action_sub_category_id: this.unsafeActionForm?.value?.unsafe_action_sub_category?.id ? this.unsafeActionForm?.value?.unsafe_action_sub_category?.id : null,
      unsafe_action_sub_category: this.unsafeActionForm?.value?.unsafe_action_sub_category?.title ? this.unsafeActionForm?.value?.unsafe_action_sub_category?.title : null,
      unsafe_action_observed_group_id: this.unsafeActionForm?.value?.unsafe_action_observed_group?.id ? this.unsafeActionForm?.value?.unsafe_action_observed_group?.id : null,
      unsafe_action_observed_group: this.unsafeActionForm?.value?.unsafe_action_observed_group?.title ? this.unsafeActionForm?.value?.unsafe_action_observed_group?.title : null,
      corrective_action: this.unsafeActionForm?.value?.corrective_action ? this.unsafeActionForm?.value?.corrective_action : null,
      corrective_action_target_date: this.unsafeActionForm?.value.corrective_action_target_date ? this._helperService.processDate(this.unsafeActionForm?.value?.corrective_action_target_date,'joint'): null,
      corrective_action_responsible_user_id: this.unsafeActionForm?.value?.responsible_user?.id ? this.unsafeActionForm?.value?.responsible_user?.id : null,
    }
    JsoObservationStore._unsafeActionDetails.push(unsafeDetailsObject);
    this.unsafeActionsEmpty = false;
    this.unsetUnsafeActionFormVariables();
    this._utilityService.detectChanges(this._cdr);

    this.unsafeActionForm.reset();
    AppStore.disableLoading();
    if (!close) {
      this.addUnSafeActions(false)
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getUsers() {
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  searchUers(e) {

    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
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

  closeFormModal() {
    this._eventEmitterService.dismissJsoModal();
    if(JsoObservationStore.jso_id)
    this._router.navigateByUrl('/jso/jso-observations/'+JsoObservationStore.jso_id); 
  }

  getJSoDetails(index) {
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else
      this.selectedIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  setControlAccordion(index: number) {
    this.JsoObservationStore.setUnsafeActionAccordion(index);
    this._utilityService.detectChanges(this._cdr);
  }

  deleteUnsafeAction(index){
    JsoObservationStore._unsafeActionDetails.splice(index,1)
  }

  addObservationType(){
    JsoObservationStore.observation_type_form_modal = true;
  $('.modal-backdrop').add();
  document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.observationTypeFormModal.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.observationTypeFormModal.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.observationTypeFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }

  closeObservationTypeModal() {

    if (JsoObservationTypeMasterStore.lastInsertedId) {
      this.searchObservationType({ term: JsoObservationTypeMasterStore.lastInsertedId }, true);
    }
    JsoObservationStore.observation_type_form_modal = false;
    this._renderer2.removeClass(this.observationTypeFormModal.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.observationTypeFormModal.nativeElement, 'display', 'none');
    this._renderer2.setAttribute(this.observationTypeFormModal.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.observationTypeFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }

  searchObservationType(e,patchValue:boolean = false){
    this._jsoObservationTypeService.getItems(false,'&q='+e.term).subscribe((res:JsoObservationTypePaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.jsoForm.patchValue({jso_observation_type_id:i.id});
            this.jsoObservationType = i.id;
            this._utilityService.detectChanges(this._cdr);
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addCategory(){

    JsoObservationStore.category_form_modal = true;
  $('.modal-backdrop').add();
  document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.categoryFormModal.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.categoryFormModal.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.categoryFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }

  closeCategoryModal() {

    if (UnsafeActionCategoryMasterStore.lastInsertedId) {
      this.searchCategory({ term: UnsafeActionCategoryMasterStore.lastInsertedId }, true);
    }
    JsoObservationStore.category_form_modal = false;
    this._renderer2.removeClass(this.categoryFormModal.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.categoryFormModal.nativeElement, 'display', 'none');
    this._renderer2.setAttribute(this.categoryFormModal.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.categoryFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }

  searchCategory(e,patchValue:boolean = false){
    this._unsafeActionCategoryService.getItems(false,'&q='+e.term).subscribe((res:UnsafeActionCategoryPaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.unsafeActionForm.patchValue({unsafe_action_category:i});
            this.unsafeActionCategory = i.id;
            // this.unsafeActionForm.controls['unsafe_action_category'].setValue(i);
            this._utilityService.detectChanges(this._cdr);
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addSubCategory(){
    this.unsafeActionSubCategorySource = {
      component:'jsoObservation',
      unsafe_action_category_id:this.unsafeActionForm.value.unsafe_action_category.id
    }
    JsoObservationStore.sub_category_form_modal = true;
  $('.modal-backdrop').add();
  document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.subCategoryFormModal.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.subCategoryFormModal.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.subCategoryFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }

  closeSubCategoryModal(){
    if(UnsafeActionSubCategoryMasterStore.lastInsertedId){
      this.searchSubCategory({term: UnsafeActionSubCategoryMasterStore.lastInsertedId},true);
    }

    JsoObservationStore.sub_category_form_modal = false;
    this._renderer2.removeClass(this.subCategoryFormModal.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.subCategoryFormModal.nativeElement, 'display', 'none');
    this._renderer2.setAttribute(this.subCategoryFormModal.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.subCategoryFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }

  searchSubCategory(e, patchValue: boolean = false) {
    if (this.unsafeActionForm.value.unsafe_action_category) {
      UnsafeActionSubCategoryMasterStore.searchText = e.term;
      this._UnsafeActionSubCategoryService.getItems(false, '&unsafe_action_category_ids=' + this.unsafeActionForm.value.unsafe_action_category.id).subscribe((res: UnsafeActionSubCategoryPaginationResponse) => {
        if (res.data.length > 0 && patchValue) {
          for (let i of res.data) {
            if (i.id == e.term) {
              this.unsafeActionForm.patchValue({ unsafe_action_sub_category: i });
              this.unsafeActionSubCategory = i.id;
              break;
            }
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  addObservedGroup(){

    JsoObservationStore.observed_group_form_modal = true;
  $('.modal-backdrop').add();
  document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.observedGroupFormModal.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.observedGroupFormModal.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.observedGroupFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }

  closeObservedGroupModal(){
    
    if(JsoUnsafeActionObservedGroupMasterStore.lastInsertedId){
      this.searchObservedGroup({term: JsoUnsafeActionObservedGroupMasterStore.lastInsertedId},true);
    }

    JsoObservationStore.observed_group_form_modal = false;
    this.changeZIndex();
    this._renderer2.removeClass(this.observedGroupFormModal.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.observedGroupFormModal.nativeElement, 'display', 'none');
    this._renderer2.setAttribute(this.observedGroupFormModal.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.observedGroupFormModal.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }

  searchObservedGroup(e,patchValue:boolean = false){
    this._jsoUnsafeActionObservedGroupService.getItems(false,'&q='+e.term).subscribe((res:JsoUnsafeActionObservedGroupPaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.unsafeActionForm.patchValue({unsafe_action_observed_group:i});
            this.groupObserved = i.id;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  unsafeActionDropdownChange(formControl){
    switch(formControl){
      case 'jso_observation_type_id': this.jsoForm.patchValue({'jso_observation_type_id': JsoObservationTypeMasterStore.getJsoObservationTypeById(this.jsoObservationType)});
        break;
        case 'unsafe_action_observed_group': this.unsafeActionForm.patchValue({'unsafe_action_observed_group': JsoUnsafeActionObservedGroupMasterStore.getJsoUnsafeActionObservedGroupById(this.groupObserved)});
        break;
      case 'unsafe_action_sub_category': this.unsafeActionForm.patchValue({'unsafe_action_sub_category': UnsafeActionSubCategoryMasterStore.getUnsafeActionSubCategoryById(this.unsafeActionSubCategory)});
        break;
      case 'unsafe_action_category': this.unsafeActionForm.patchValue({'unsafe_action_category': UnsafeActionCategoryMasterStore.getUnsafeActionCategoryById(this.unsafeActionCategory)});
      this.getSubCategoryList();
        break;
    }
  }

  changeZIndex(){
    if($(this.categoryFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.categoryFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.categoryFormModal.nativeElement,'overflow','auto');
    }
    if($(this.subCategoryFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.subCategoryFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.subCategoryFormModal.nativeElement,'overflow','auto');
    }
    if($(this.observedGroupFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.observedGroupFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.observedGroupFormModal.nativeElement,'overflow','auto');
    }
    if($(this.observationTypeFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.observationTypeFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.observationTypeFormModal.nativeElement,'overflow','auto');
    }
    if($(this.formModal.nativeElement).hasClass('show')){
      console.log('formmodal');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  getPopupDetails(user) {
    this.userDetailObject.first_name = user?.first_name ? user?.first_name : null;
    this.userDetailObject.last_name = user?.last_name ? user?.last_name : null;
    this.userDetailObject.designation = user?.designation ? user?.designation : null;
    this.userDetailObject.image_token = user?.image_token ? user?.image_token : null;
    this.userDetailObject.email = user?.email ? user?.email : null;
    this.userDetailObject.mobile = user?.mobile ? user?.mobile : null;
    this.userDetailObject.id = user?.id ? user?.id : null;
    this.userDetailObject.department = user?.department ? user?.department : null;
    this.userDetailObject.status_id = user?.status_id ? user?.status_id : 1;
    return this.userDetailObject;
  }

  ngOnDestroy() {
    JsoObservationStore._unsafeActionDetails = [];
    this.unsafeActionsEmpty = true;
    this.jsoUnsafeActionCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionSubCategorySubscriptionEvent.unsubscribe();
    this.jsoUnsafeActionObservedGroupSubscriptionEvent.unsubscribe();
    this.jsoObservationTypeSubscriptionEvent.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
