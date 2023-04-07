import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnsafeActionCategoryPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-category';
import { JsoUnsafeActionObservedGroupPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-observed-group';
import { UnsafeActionSubCategoryPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-sub-category';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { JsoUnsafeActionsService } from 'src/app/core/services/jso/unsafe-actions/jso-unsafe-actions.service';
import { JsoObservationTypeService } from 'src/app/core/services/masters/jso/jso-observation-type/jso-observation-type.service';
import { UnsafeActionCategoryService } from 'src/app/core/services/masters/jso/unsafe-action-category/unsafe-action-category.service';
import { UnsafeActionObservedGroupService } from 'src/app/core/services/masters/jso/unsafe-action-observed-group/unsafe-action-observed-group.service';
import { UnsafeActionSubCategoryService } from 'src/app/core/services/masters/jso/unsafe-action-sub-category/unsafe-action-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { JsoObservationStore } from 'src/app/stores/jso/jso-observations/jso-observations-store';
import { JsoUnsafeActionStore } from 'src/app/stores/jso/unsafe-actions/jso-unsafe-actions-store';
import { JsoObservationTypeMasterStore } from 'src/app/stores/masters/jso/jso-observation-type-store';
import { UnsafeActionCategoryMasterStore } from 'src/app/stores/masters/jso/unsafe-action-category-store';
import { JsoUnsafeActionObservedGroupMasterStore } from 'src/app/stores/masters/jso/unsafe-action-observed-group-store';
import { UnsafeActionSubCategoryMasterStore } from 'src/app/stores/masters/jso/unsafe-action-sub-category-store';
declare var $: any;

@Component({
  selector: 'app-unsafe-action-model',
  templateUrl: './unsafe-action-model.component.html',
  styleUrls: ['./unsafe-action-model.component.scss']
})
export class UnsafeActionModelComponent implements OnInit {
 
  @Input('source') formObject: any;
  @ViewChild('categoryFormModal', { static: true }) categoryFormModal: ElementRef;
  @ViewChild('subCategoryFormModal', { static: true }) subCategoryFormModal: ElementRef;
  @ViewChild('observedGroupFormModal', { static: true }) observedGroupFormModal: ElementRef;

  UsersStore = UsersStore;
  JsoUnsafeActionStore = JsoUnsafeActionStore;
  UnsafeActionCategoryMasterStore = UnsafeActionCategoryMasterStore;
  JsoUnsafeActionObservedGroupMasterStore = JsoUnsafeActionObservedGroupMasterStore;
  UnsafeActionSubCategoryMasterStore = UnsafeActionSubCategoryMasterStore;
  JsoObservationTypeMasterStore = JsoObservationTypeMasterStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  
  jsoUnsafeActionCategorySubscriptionEvent:any = null;
  jsoUnsafeActionSubCategorySubscriptionEvent:any = null;
  jsoUnsafeActionObservedGroupSubscriptionEvent:any = null;

  unsafeActionForm: FormGroup;
  formErrors: any;
  networkFailureSubscription:any;
  //Unsafe Action Variables
  unsafeActionCategory: any = null;
  unsafeActionSubCategory: any = null;
  groupObserved: any = null;
  unsafeActionSubCategorySource = {
    component:'jsoObservation',
    unsafe_action_category_id:null
  }

  constructor(private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _usersService: UsersService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _unsafeActionService:JsoUnsafeActionsService,
    private _unsafeActionCategoryService: UnsafeActionCategoryService,
    private _jsoUnsafeActionObservedGroupService: UnsafeActionObservedGroupService,
    private _UnsafeActionSubCategoryService: UnsafeActionSubCategoryService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

    this.unsafeActionForm = this._formBuilder.group({
      unsafe_action_category_id: [null,Validators.required],
      unsafe_action_sub_category_id: [null,Validators.required],
      unsafe_action_observed_group_id: [null,Validators.required],
      description: ['',Validators.required],
      corrective_action: [''],
      corrective_action_target_date: [''],
      corrective_action_responsible_user_id: [null]
    });

    this.getCategoryList();
    this.getSubCategoryList();
    this.getObservedGroupList();

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
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    if(this.formObject.type == 'Edit')
    this.setValue();
  }

  getCategoryList() {
    this._unsafeActionCategoryService.getItems(false, null, true).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getSubCategoryList() {
    if(this.unsafeActionForm.value.unsafe_action_category_id){
      // let categoryId = this.unsafeActionForm.value.unsafe_action_category_id.id;
    this._UnsafeActionSubCategoryService.getItems(false, '&unsafe_action_category_ids='+this.unsafeActionForm.value.unsafe_action_category_id.id).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }
    else
    this.UnsafeActionSubCategoryMasterStore.unsetUnsafeActionSubCategory();
  }

  getObservedGroupList() {
    this._jsoUnsafeActionObservedGroupService.getItems(false, null, true).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  setValue() {
    this.formErrors = null;
    this._unsafeActionService.getItem(this.formObject.id).subscribe(res => {
      let data = JsoUnsafeActionStore.jsoUnsafeActionsDetails;
      this.unsafeActionForm.patchValue({
        description: data?.description ? data?.description : null,
        unsafe_action_category_id: data?.unsafe_action_category ? data?.unsafe_action_category : null,
        unsafe_action_sub_category_id: data?.unsafe_action_sub_category ? data?.unsafe_action_sub_category : null,
        unsafe_action_observed_group_id: data?.unsafe_action_observed_group ? data?.unsafe_action_observed_group : null,
        corrective_action: data?.corrective_action ? data?.corrective_action : null,
        corrective_action_target_date: data?.corrective_action_target_date ? this._helperService.processDate(data?.corrective_action_target_date, 'split') : null,
        corrective_action_responsible_user_id: data?.corrective_action_responsible_user ? data?.corrective_action_responsible_user : null,
      })
      this.unsafeActionCategory = data?.unsafe_action_category;
      this.unsafeActionSubCategory = data?.unsafe_action_sub_category;
      this.groupObserved = data?.unsafe_action_observed_group;
      this._utilityService.detectChanges(this._cdr);
    });
  
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
    this.unsafeActionForm.reset();
    this._eventEmitterService.dismissJsoUnsafeActionModal();
  }

  save(close) {
    this.formErrors = null;
    AppStore.enableLoading();
    if (this.formObject.type == 'Add') {
      let unsafeDetailsObject = {
        description: this.unsafeActionForm?.value?.description ? this.unsafeActionForm?.value?.description : null,
        unsafe_action_category_id: this.unsafeActionForm?.value?.unsafe_action_category_id.id ? this.unsafeActionForm?.value?.unsafe_action_category_id.id : null,
        unsafe_action_category: this.unsafeActionForm?.value?.unsafe_action_category_id?.title ? this.unsafeActionForm?.value?.unsafe_action_category_id?.title : null,
        unsafe_action_sub_category_id: this.unsafeActionForm?.value?.unsafe_action_sub_category_id?.id ? this.unsafeActionForm?.value?.unsafe_action_sub_category_id?.id : null,
        unsafe_action_sub_category: this.unsafeActionForm?.value?.unsafe_action_sub_category_id?.title ? this.unsafeActionForm?.value?.unsafe_action_sub_category_id?.title : null,
        unsafe_action_observed_group_id: this.unsafeActionForm?.value?.unsafe_action_observed_group_id?.id ? this.unsafeActionForm?.value?.unsafe_action_observed_group_id?.id : null,
        unsafe_action_observed_group: this.unsafeActionForm?.value?.unsafe_action_observed_group_id?.title ? this.unsafeActionForm?.value?.unsafe_action_observed_group_id?.title : null,
        corrective_action: this.unsafeActionForm?.value?.corrective_action ? this.unsafeActionForm?.value?.corrective_action : null,
        corrective_action_target_date: this.unsafeActionForm?.value.corrective_action_target_date ? this._helperService.processDate(this.unsafeActionForm?.value?.corrective_action_target_date,'joint'): null,
        corrective_action_responsible_user_id: this.unsafeActionForm?.value?.corrective_action_responsible_user_id?.id ? this.unsafeActionForm?.value?.corrective_action_responsible_user_id?.id : null,
        corrective_action_responsible_user: this.unsafeActionForm?.value?.corrective_action_responsible_user_id ? this.unsafeActionForm?.value?.corrective_action_responsible_user_id : null,
      }
      JsoObservationStore._unsafeActionDetails.push(unsafeDetailsObject);
      AppStore.disableLoading();
      if (close) {
        this.closeFormModal();
        this.unsetUnsafeActionFormVariables();
        this.unsafeActionForm.reset();
      }
      this.unsafeActionForm.reset();
      this._utilityService.detectChanges(this._cdr);
    }
    else {
      let data = this.unsafeActionForm.value;
      let saveData = {
        description: data?.description ? data?.description : null,
        unsafe_action_category_id: data?.unsafe_action_category_id ? data?.unsafe_action_category_id.id : data?.unsafe_action_category_id,
        unsafe_action_sub_category_id: data?.unsafe_action_sub_category_id ? data?.unsafe_action_sub_category_id?.id : data?.unsafe_action_sub_category_id,
        unsafe_action_observed_group_id: data?.unsafe_action_observed_group_id ? data?.unsafe_action_observed_group_id?.id : data?.unsafe_action_observed_group_id,
        corrective_action: data?.corrective_action ? data?.corrective_action : null,
        corrective_action_target_date: data?.corrective_action_target_date ? this._helperService.processDate(data?.corrective_action_target_date, '') : null,
        corrective_action_responsible_user_id: data?.corrective_action_responsible_user_id?.id ? data?.corrective_action_responsible_user_id?.id : null,
      }
      let save = this._unsafeActionService.updateItem(this.formObject.id, saveData);
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        setTimeout(() => {
          if (close) {
            this.unsetUnsafeActionFormVariables();
            this.closeFormModal();
            this.unsafeActionForm.reset();
          }
        }, 300);
        this._utilityService.detectChanges(this._cdr);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 404) {
          AppStore.disableLoading();
          this.closeFormModal();
          this.unsafeActionForm.reset();
        }
        else {
          this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  unsetUnsafeActionFormVariables(){
    this.unsafeActionCategory = null;
    this.unsafeActionSubCategory = null;
    this.groupObserved = null;
  }

  addCategory(){

    JsoUnsafeActionStore.category_form_modal = true;
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
    JsoUnsafeActionStore.category_form_modal = false;
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
            this.unsafeActionForm.patchValue({unsafe_action_category_id:i});
            this.unsafeActionCategory = i;
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
      unsafe_action_category_id:this.unsafeActionForm?.value?.unsafe_action_category_id?.id
    }
    JsoUnsafeActionStore.sub_category_form_modal = true;
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

    JsoUnsafeActionStore.sub_category_form_modal = false;
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
    if (this.unsafeActionForm.value.unsafe_action_category_id) {
      UnsafeActionSubCategoryMasterStore.searchText = e.term;
      this._UnsafeActionSubCategoryService.getItems(false, '&unsafe_action_category_ids=' + this.unsafeActionForm.value.unsafe_action_category_id.id).subscribe((res: UnsafeActionSubCategoryPaginationResponse) => {
        if (res.data.length > 0 && patchValue) {
          for (let i of res.data) {
            if (i.id == e.term) {
              this.unsafeActionForm.patchValue({ unsafe_action_sub_category_id: i });
              this.unsafeActionSubCategory = i;
              break;
            }
          }
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  addObservedGroup(){

    JsoUnsafeActionStore.observed_group_form_modal = true;
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

    JsoUnsafeActionStore.observed_group_form_modal = false;
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
            this.unsafeActionForm.patchValue({unsafe_action_observed_group_id:i});
            this.groupObserved = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
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
  }

  unsafeActionDropdownChange(formControl){
    switch(formControl){
        case 'unsafe_action_observed_group_id': if(this.groupObserved){
          this.unsafeActionForm.patchValue({'unsafe_action_observed_group_id': JsoUnsafeActionObservedGroupMasterStore.getJsoUnsafeActionObservedGroupById(this.groupObserved.id)});
        }
        else{
          this.unsafeActionForm.patchValue({'unsafe_action_observed_group_id': null});
        }
        break;
      case 'unsafe_action_sub_category_id': if(this.unsafeActionSubCategory){
        this.unsafeActionForm.patchValue({'unsafe_action_sub_category_id': UnsafeActionSubCategoryMasterStore.getUnsafeActionSubCategoryById(this.unsafeActionSubCategory.id)});
        }
        else{
          this.unsafeActionForm.patchValue({'unsafe_action_sub_category_id': null});
        }
        break;
      case 'unsafe_action_category_id': if(this.unsafeActionCategory){
          this.unsafeActionForm.patchValue({'unsafe_action_category_id': UnsafeActionCategoryMasterStore.getUnsafeActionCategoryById(this.unsafeActionCategory.id)});
          this.getSubCategoryList();
        }
        else{
          this.unsafeActionForm.patchValue({'unsafe_action_category_id': null});
          UnsafeActionSubCategoryMasterStore.unsetUnsafeActionSubCategory();
        }
        break;
    }
  }

  ngOnDestroy(){
    AppStore.disableLoading();
    this.closeFormModal();
    this.networkFailureSubscription.unsubscribe();
  }
}
