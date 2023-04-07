import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { SuppliersPaginationResponse } from 'src/app/core/models/masters/suppliers-management/suppliers';
import { AssetMaintenanceService } from 'src/app/core/services/asset-management/asset-register/asset-maintenance/asset-maintenance.service';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { AssetMaintenanceCategoriesService } from 'src/app/core/services/masters/asset-management/asset-maintenance-categories/asset-maintenance-categories.service';
import { AssetMaintenanceScheduleFrequenciesService } from 'src/app/core/services/masters/asset-management/asset-maintenance-schedule-frequencies/asset-maintenance-schedule-frequencies.service';
import { AssetMaintenanceTypesService } from 'src/app/core/services/masters/asset-management/asset-maintenance-types/asset-maintenance-types.service';
import { SuppliersService } from 'src/app/core/services/masters/suppliers-management/suppliers/suppliers.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AssetMaintenanceCategoriesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-categories';
import { AssetMaintenanceScheduleFrequenciesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-schedule-frequencies-store';
import { AssetMaintenanceTypesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-types-store';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  selector: 'app-add-asset-maintenance',
  templateUrl: './add-asset-maintenance.component.html',
  styleUrls: ['./add-asset-maintenance.component.scss']
})
export class AddAssetMaintenanceComponent implements OnInit {
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
	@ViewChild('supplierModal') supplierModal: ElementRef;
  @ViewChild('shutdownModal') shutdownModal: ElementRef;
  maintenanceForm: FormGroup;
  formErrors: any;
  cancelEventSubscription: any;
  supplierSubscription:any;
  scheduleSubscription:any;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  currentShutdownIndex = null;
  currentScheduleIndex = null;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  AssetMaintenanceStore = AssetMaintenanceStore;
  AssetMaintenanceCategoriesMasterStore = AssetMaintenanceCategoriesMasterStore;
  AssetMaintenanceTypesMasterStore = AssetMaintenanceTypesMasterStore;
  AssetMaintenanceScheduleFrequencyMasterStore = AssetMaintenanceScheduleFrequenciesMasterStore;
  AssetRegisterStore = AssetRegisterStore;
  SuppliersMasterStore = SuppliersMasterStore;
  UsersStore = UsersStore;
  currentTab = 0;
  AppStore = AppStore;
  cancelObject = {
    type: '',
    title: '',
    subtitle: '',
    position:null
  };
  frequencyDataCount = 0
  frequencyDisplayData = [];
  nextButtonText = 'Next';
  previousButtonText = "Previous";
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  formObject = {
    0: [
      'asset_id',
      'asset_maintenance_category_id',
      'title',
      'description',
      'asset_maintenance_type_id',
      'is_guarantee',
      'is_warranty',
      'warranty_year',
      'warranty_month',

    ],
    1: [
      'asset_maintenance_schedule_frequency_id',
      'total_cost'
    ],
    2:[
      'schedule_title',
      'supplier_id',
      'user_ids',
      'scheduled_date'
    ]

  }

  userDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }

  supplierObject = {
		component: 'Master',
		values: null,
		type: null
	};

  shutdownObject = {
		component: 'Master',
		values: null,
		type: null,
    index:null
	};
  shutdownOpened = false;
  accordionIndex = [];


  config = {
    toolbar: [
      { name: 'document', items: ['Source', '-', 'Preview'] },
      { name: 'clipboard', items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'] },
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] },
      { name: 'links', items: ['Link', 'Unlink', 'Anchor'] }, '/',
      { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
      { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-'] },
      { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
      { name: 'tools', items: ['Maximize'] },
      { name: 'about', items: ['About'] }
    ]
  };

  constructor(private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _assetMaintenanceCategoryService: AssetMaintenanceCategoriesService,
    private _assetMaintenanceTypeService: AssetMaintenanceTypesService,
    private _assetMaintenanceService: AssetMaintenanceService,
    private _assetMaintenanceScheduleFrequencyService: AssetMaintenanceScheduleFrequenciesService,
    private _assetRegisterService:AssetRegisterService,
    private _suppliersService:SuppliersService,
    private _usersService:UsersService) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if ((!AssetRegisterStore.assetId) && !AssetMaintenanceStore.maintananceMainTab) {
      this._router.navigateByUrl('asset-management/assets');
    }
    AssetRegisterStore.currentAssetPage = 'add-maintenance';
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      // setTimeout(() => {

      //   this.maintenanceForm.pristine;
      // }, 250);

    });
    AppStore.showDiscussion = false

    this.buildForm();
    if (AssetMaintenanceStore.editFlag) {
      this.setEditValues();
    }
    else {
      this.changeGuaranteeWarranty('guarantee');
    }

    SubMenuItemStore.setNoUserTab(true);
    if(!AssetMaintenanceStore.maintananceMainTab){
      SubMenuItemStore.setSubMenuItems([
        { type: 'close', path: '/asset-management/assets/' + AssetRegisterStore.assetId + '/maintenances' },
      ]);
    }
    else{
      SubMenuItemStore.setSubMenuItems([
        { type: 'close', path: '/asset-management/asset-maintenances' },
      ]);
    }
    

    window.addEventListener('scroll', this.scrollEvent, true);
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelMaintenance(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.supplierSubscription = this._eventEmitterService.supplier.subscribe(item => {
			this.closeSupplierModal();
		});

    this.scheduleSubscription = this._eventEmitterService.maintenanceScheduleForm.subscribe(item => {
			this.closeShutdownForm(item);
		});

    setTimeout(() => {

      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);

    }, 250);
  }


  buildForm() {
    this.maintenanceForm = this._formBuilder.group({
      id: [null],
      asset_id: [null],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      description: [''],
      asset_maintenance_category_id: [null,[Validators.required]],
      asset_maintenance_type_id: [null,[Validators.required]],
      is_guarantee: [null],
      is_warranty: [null],
      warranty_year: [null,[Validators.required]],
      warranty_month: [null],
      asset_maintenance_schedule_frequency_id: [null],
      total_cost:[null],
      schedule_title:[null],
      supplier_id:[null],
      user_ids:[[]],
      scheduled_date:[null]

    })
    if(!AssetMaintenanceStore.maintananceMainTab){
    this.maintenanceForm.patchValue({
      asset_id: AssetRegisterStore.assetId
    })
    }
  }

  setEditValues() {
    let params='';
    if(!AssetMaintenanceStore.maintananceMainTab){
      '?asset_ids=' + AssetRegisterStore.assetId
    }
    this._assetMaintenanceService.getItem(AssetMaintenanceStore.maintenanceId, params?params:'').subscribe(res => {
      this.maintenanceForm.patchValue({
        id: res['id'],
        asset_id: res['asset']['id'],
        title: res['title'],
        description: res['description'],
        asset_maintenance_category_id: res['asset_maintenance_category']?.id,
        asset_maintenance_type_id: res['asset_maintenance_type']?.id,
        is_guarantee: res['is_guarantee'],
        is_warranty: res['is_warranty'],
        warranty_year: res['warranty_year'],
        warranty_month: res['warranty_month'],
        asset_maintenance_schedule_frequency_id:res['asset_maintenance_schedule_frequency']?.id,
        total_cost:res['total_cost'],
      })
      AssetMaintenanceStore.frequencyShutdownData=[];
      this.getScheduleData(res['asset_maintenance_schedules']);
     
      this._utilityService.detectChanges(this._cdr);
      this.getMaintenanceCategory();
      this.getMaintenanceType();
      this.getMaintenanceScheduleFrequency();
      this.getSupplier();
      
      this.searchAsset({term:res['asset'['id']]})
    })

  }

  getScheduleData(res){
    for(let i of res){
      AssetMaintenanceStore.frequencyShutdownData?.push({

        id:i.id,
        title:i.title,
        frequency_title:i.frequency_title?i.frequency_title:null,
        supplier_id:i.supplier_id?i.supplier_id:null,
        user_ids:i.responsible_users?this.getData(i.responsible_users):[],
        scheduled_date:this._helperService.processDate(i.scheduled_date,'split'),
        is_shutdown:i.is_shutdown,
        asset_maintenance_schedule_shutdowns:this.getShutdowns(i.asset_maintenance_schedule_shutdown)
      })
      
    }
    this.frequencyDataCount = AssetMaintenanceStore.frequencyShutdownData?.length;
    if(this.frequencyDataCount==1){
      this.setFormValues(0);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  getData(data){
    let userArray=[];
    for(let i of data){
      userArray.push(i);
    }
    return userArray;
  }

  setFormValues(index){
    this.maintenanceForm.patchValue({
      schedule_title:AssetMaintenanceStore.frequencyShutdownData[index].title,
      scheduled_date:AssetMaintenanceStore.frequencyShutdownData[index].scheduled_date,
      user_ids:AssetMaintenanceStore.frequencyShutdownData[index].user_ids?this.getData(AssetMaintenanceStore.frequencyShutdownData[index].user_ids):[],
      supplier_id:AssetMaintenanceStore.frequencyShutdownData[index].supplier_id,
    })
  }

  getShutdowns(shutdowns){
    let shutdownArray=[];
    for(let i of shutdowns){
      shutdownArray.push({
        id:i.id,
        title:i.title,
        description:i.description,
        start_date:i.start_date,
        end_date:i.end_date,
        downtime_from:i.downtime_from,
        downtime_to:i.downtime_to
      })
    }
    return shutdownArray;
    
  }


  changeGuaranteeWarranty(type) {
    if (type == 'guarantee') {
      this.maintenanceForm.patchValue({
        is_guarantee: 1,
        is_warranty: 0
      })
    }
    else {
      this.maintenanceForm.patchValue({
        is_warranty: 1,
        is_guarantee: 0
      })
    }
  }

  nextPrev(n) {

    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }


    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;
    if (n != -1) {
      switch (this.currentTab) {

        case 1:
          this.submitForm();
          break;
        case 2:
          this.scheduleSubmitForm();
          break;

        case 3:
          this.finalSubmit();
          break;
      }
    }
    else{
      this.currentScheduleIndex = null;
    }


    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      // this.submitForm();

      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  setInitialTab() {
    var x: any = document.getElementsByClassName("tab");
    for (var i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }



  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    if(n==1){
      x[0].style.display = "none"
    }

    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      // this.getSelectedValues();
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Save";
    } else {
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n)
  }

  validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[this.currentTab].getElementsByTagName("input");

    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty...
      if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    return valid; // return the valid status
  }


  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  scrollEvent = (event: any): void => {

    const number = event.target.documentElement?.scrollTop;
    if (number > 100) {
      if (this.formSteps)
        this._renderer2.addClass(this.formSteps?.nativeElement, 'small');
      // this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
    }
    else {
      if (this.formSteps)
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
      // this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
    }
  }


  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.maintenanceForm.controls[i].valid) {
            setValid = false;
            break;
          }
        }
      }
    }
    else {
      for (var i = 0; i < tabNumber; i++) {
        if (this.formObject.hasOwnProperty(i)) {
          for (let k of this.formObject[i]) {
            if (!this.maintenanceForm.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

  changeStep(step) {
    if (step > this.currentTab && this.checkFormObject(step)) {
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if (step < this.currentTab) {
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }


  }
  getPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.userDetailObject.first_name = user.first_name;
      this.userDetailObject.last_name = user.last_name;
      this.userDetailObject.designation = user.designation ? user.designation : user.designation_title;
      this.userDetailObject.image_token = user?.image?.token ? user?.image?.token : user?.image_token;
      this.userDetailObject.email = user.email;
      this.userDetailObject.mobile = user.mobile;
      this.userDetailObject.id = user.id;
      this.userDetailObject.department = user.department ? user.department : null;
      this.userDetailObject.status_id = user?.status?.id ? user.status?.id : 1;
      return this.userDetailObject;
    }
  }

  changeZIndex() {
    // if ($(this.processFormModal.nativeElement).hasClass('show')) {
    //   this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 999999);
    //   this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
    // }
    // else if ($(this.controlFormModal.nativeElement).hasClass('show')) {
    //   this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 999999);
    //   this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');
    // }

  }

  checkAccordionIndexPresent(index){
   let pos= this.accordionIndex.findIndex(e=>e==index);
   if(pos!=-1)
   return true;
   else
   return false;
  }

    
processFormErrors(){
  this.accordionIndex = [];
  var errors = this.formErrors;
  for (var key in errors) {
    if (errors.hasOwnProperty(key)) {
      if(key.startsWith('asset_maintenance_schedules.')){
        let errordata = this.maintenanceForm.value.asset_maintenance_schedules;
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        console.log(keyValueSplit);
        // let subdata = errors[key][0].split(errorPosition);

        this.accordionIndex.push(errorPosition);
        if(AssetMaintenanceStore.frequencyShutdownData[0]?.is_shutdown && AssetMaintenanceStore.frequencyShutdownData[0]?.asset_maintenance_schedule_shutdowns?.length == 0)
        this.formErrors['asset_maintenance_schedules'] = 'Shutdown data required'
        // this.formErrors['asset_maintenance_schedules'] =this.getButtonText('asset_category')+' '+errordata[errorPosition].title+''+subdata[1];

        // this.formErrors['asset_category_index'] = errorPosition;
        // console.log(this.formErrors.asset_category_index);
        // console.log(errors[key]);
      }
     
     
    }
  }
  this._utilityService.detectChanges(this._cdr);
}


  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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


  confirmCancel() {
    this.cancelObject.type = 'Cancel';
    this.cancelObject.title = 'Cancel Asset Maintenance Creation?';
    this.cancelObject.subtitle = 'maintenance_cancel_confirmation';
    $(this.cancelPopup.nativeElement).modal('show');
  }

  
  confirmDelete(index) {
    this.cancelObject.position=index;
    this.cancelObject.type = '';
    this.cancelObject.title = 'Cancel Asset Maintenance Creation?';
    this.cancelObject.subtitle = 'maintenance_delete_confirmation';
    $(this.cancelPopup.nativeElement).modal('show');
  }


  /**
 * cancel modal
 * @param status - decision to cancel
 */
  cancelMaintenance(status) {
    if (status) {
     
      if(this.cancelObject.type=='Cancel'){
        this.maintenanceForm.reset();
        if(!AssetMaintenanceStore.maintananceMainTab)
        this._router.navigateByUrl('asset-management/assets/' + AssetRegisterStore.assetId + '/maintenances');
        else
        this._router.navigateByUrl('asset-management/asset-maintenances')
      }
      else{
        this.deleteSchedule(this.cancelObject.position);
      }
     

      AppStore.disableLoading();
      this.clearCancelObject();
    }
    else {
      this.clearCancelObject();
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }


  clearCancelObject() {



  }

  submitForm() {
    AppStore.enableLoading();
    this.formErrors = null;

    let save;
    if (this.maintenanceForm.value.id || AssetMaintenanceStore.maintenanceId) {
      save = this._assetMaintenanceService.updateItem(this.maintenanceForm.value.id ? this.maintenanceForm.value.id : AssetMaintenanceStore.maintenanceId, this.maintenanceForm.value, '&asset_ids=' + AssetRegisterStore.assetId);
    }
    else {
      save = this._assetMaintenanceService.saveItem(this.maintenanceForm.value, '&asset_ids=' + AssetRegisterStore.assetId);
    }
    // this.setCustodianTitle();

    save.subscribe(res => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.currentTab = 0;
        this.nextButtonText = "Save & Next";
        this.previousButtonText = "Previous";

        this.setInitialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  scheduleSubmitForm() {
    AppStore.enableLoading();
    this.formErrors = null;
    
    let saveData = {
      asset_maintenance_schedule_frequency_id:this.maintenanceForm.value.asset_maintenance_schedule_frequency_id,
      total_cost:this.maintenanceForm.value.total_cost,
      asset_maintenance_schedules:this.getSchedules()
    }
    this._assetMaintenanceService.updateSchedule(AssetMaintenanceStore.maintenanceId,saveData).subscribe(res=>{
      AppStore.disableLoading();
      this.currentScheduleIndex = null;
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
        this.currentTab = 1;
        this.nextButtonText = "Save & Next";
        this.previousButtonText = "Previous";

        this.setInitialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getSchedules(){
    let shutdownData=[];
    for(let i of AssetMaintenanceStore.frequencyShutdownData){
      if(!i.is_deleted){
       
        if(i.id){
          shutdownData.push({
            id:i.id,
            frequency_title:i.frequency_title?i.frequency_title:null,
            title:i.title,
            supplier_id:i.supplier_id,
            user_ids:this.getIds(i.user_ids),
            scheduled_date:this._helperService.processDate(i.scheduled_date, 'join'),
            is_shutdown:i.is_shutdown,
            asset_maintenance_schedule_shutdowns:i.asset_maintenance_schedule_shutdowns
          })
        }
        else{
          shutdownData.push({
            is_new:true,
            frequency_title:i.frequency_title?i.frequency_title:null,
            title:i.title,
            supplier_id:i.supplier_id,
            user_ids:this.getIds(i.user_ids),
            scheduled_date:this._helperService.processDate(i.scheduled_date, 'join'),
            is_shutdown:i.is_shutdown,
            asset_maintenance_schedule_shutdowns:i.asset_maintenance_schedule_shutdowns
          })
      
        } 
    }
  }

    return shutdownData;
  }

  getIds(data){
    let idArray=[];
    for(let i of data){
      idArray.push(i.id);
    }
    return idArray;
  }

  finalSubmit() {
    this._utilityService.showSuccessMessage('success', AssetMaintenanceStore.editFlag ? 'asset_maintenance_updated' : 'asset_maintenance_created');
    // if(!AssetMaintenanceStore.maintananceMainTab)
    // this._router.navigateByUrl('/asset-management/assets/'+AssetRegisterStore.assetId+'/maintenances/'+AssetMaintenanceStore.individualMaintenanceDetails.id)
    //   else
      this._router.navigateByUrl('/asset-management/asset-maintenances/'+AssetMaintenanceStore.individualMaintenanceDetails.id)
  
  }

  getMaintenanceCategory() {
    this._assetMaintenanceCategoryService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchMaintenanceCategory(e) {
    this._assetMaintenanceCategoryService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getMaintenanceType() {
    this._assetMaintenanceTypeService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchMaintenanceType(e) {
    this._assetMaintenanceTypeService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMaintenanceScheduleFrequency() {
    this._assetMaintenanceScheduleFrequencyService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchMaintenanceScheduleFrequency(e) {
    this._assetMaintenanceScheduleFrequencyService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAsset() {
    this._assetRegisterService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchAsset(e) {
    this._assetRegisterService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getFrequencyData(){
    let frequencyData = null;
    if(!AssetMaintenanceStore.individual_maintenance_loaded || (AssetMaintenanceStore.individualMaintenanceDetails?.asset_maintenance_schedule_frequency?.id!=this.maintenanceForm.value.asset_maintenance_schedule_frequency_id)){
      AssetMaintenanceStore.frequencyShutdownData = [];
    

    if(this.maintenanceForm.value.asset_maintenance_schedule_frequency_id){
      let pos=this.AssetMaintenanceScheduleFrequencyMasterStore.allItems.findIndex(e=>e.id==this.maintenanceForm.value.asset_maintenance_schedule_frequency_id);
      if(pos!=-1)
        frequencyData = this.AssetMaintenanceScheduleFrequencyMasterStore.allItems[pos];
      switch(frequencyData.type){
        case 'adhoc':
          this.frequencyDataCount = 1;
          break;
        case 'half-yearly':
          this.frequencyDataCount = 2;
          this.frequencyDisplayData = ['H1','H2'];
          
          break;
        case 'monthly':
          this.frequencyDataCount = 12;
          this.frequencyDisplayData=['January','February','March','April','May','June','July','August','September','October','November','December'];

          break;
        case 'yearly':
          this.frequencyDataCount = 1;
          break;
        case 'quarterly':
          this.frequencyDataCount=4;
          this.frequencyDisplayData = ['Q1','Q2','Q3','Q4'];
          break;
        

      }
      if(this.frequencyDataCount>1){
        for(let i of this.frequencyDisplayData){
          AssetMaintenanceStore.frequencyShutdownData.push({frequency_title:i,id:null,title:'',supplier_id:null,user_ids:[],scheduled_date:null,is_shutdown:false,asset_maintenance_schedule_shutdowns:[]});
       
        }
      }
      else{
        AssetMaintenanceStore.frequencyShutdownData.push({title:'',id:null,supplier_id:null,user_ids:[],scheduled_date:null,is_shutdown:false,asset_maintenance_schedule_shutdowns:[]});
       
      }
    }
   
      this._utilityService.detectChanges(this._cdr);
      
    }
    else{
      this.getScheduleData(AssetMaintenanceStore.individualMaintenanceDetails.asset_maintenance_schedules)
    }
  }

  getMaintenanceTypeData(){
    if(this.maintenanceForm.value.asset_maintenance_type_id){
      let pos = AssetMaintenanceTypesMasterStore.allItems.findIndex(e=>e.id == this.maintenanceForm.value.asset_maintenance_type_id);
      if(pos!=-1){
        return AssetMaintenanceTypesMasterStore.allItems[pos].type;
      }
    }
  }

  getSupplier() {
		this._suppliersService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

  searchSupplier(e, patchValue: boolean = false) {
		this._suppliersService.getItems(false, '&q=' + e.term).subscribe((res: SuppliersPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.maintenanceForm.patchValue({ supplier_id: i.id });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

	addSupplier() {
		this.supplierObject.type = 'Add';
		this.supplierObject.values = null; // for clearing the value
		this._renderer2.setStyle(this.supplierModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.supplierModal.nativeElement, 'show');
		this._renderer2.setStyle(this.supplierModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

  closeSupplierModal() {
		if (SuppliersMasterStore.lastInsertedId) {
			this.searchSupplier({ term: SuppliersMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.supplierObject.type = null;
			this._renderer2.setStyle(this.supplierModal.nativeElement, 'z-index', 9);
			this._renderer2.removeClass(this.supplierModal.nativeElement, 'hide');
			this._renderer2.setStyle(this.supplierModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

  
	getUsers() {
		var params = '';
		this._usersService.getAllItems(params).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});

	}

	searchUers(e) {
		let params = '';
		if (params) params = params + '&q=' + e.term;
		else params = '?q=' + e.term;
		this._usersService.searchUsers(params ? params : '').subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

  setFrequencyShutdownData(type,event,index){
    if(type=='title')
    AssetMaintenanceStore.frequencyShutdownData[index]['title']=this.maintenanceForm.value.schedule_title;
    if(type=='scheduled_date')
    AssetMaintenanceStore.frequencyShutdownData[index]['scheduled_date']=this.maintenanceForm.value.scheduled_date;
    if(type=='supplier')
    AssetMaintenanceStore.frequencyShutdownData[index]['supplier_id']=this.maintenanceForm.value.supplier_id;
    if(type=='responsible')
    AssetMaintenanceStore.frequencyShutdownData[index]['user_ids']=this.maintenanceForm.value.user_ids;
    if(type=='schedule')
    AssetMaintenanceStore.frequencyShutdownData[index]['is_shutdown']=event.target.checked;
    this._utilityService.detectChanges(this._cdr);
  }

	clear(type,index) {
		AssetMaintenanceStore.frequencyShutdownData[index].scheduled_date=null;
  }

  deleteSchedule(index){
    AssetMaintenanceStore.frequencyShutdownData.splice(index,1);
  }

  addShutdown(index){
    this.shutdownObject.type='add';
    this.shutdownObject.index = index;
    AssetMaintenanceStore.shutdownData = null;

    this._renderer2.setStyle(this.shutdownModal.nativeElement, 'z-index', 999999);
    this._renderer2.addClass(this.shutdownModal.nativeElement, 'show');
    this._renderer2.setStyle(this.shutdownModal.nativeElement, 'display', 'block');
  }

  editShutdown(index){
    this.shutdownObject.type='edit';
    // this.shutdownObject.values={
    //   title:AssetMaintenanceStore.individualMaintenanceDetails.asset_maintenance_schedules?.
    // }
    this._renderer2.setStyle(this.shutdownModal.nativeElement, 'z-index', 999999);
    this._renderer2.addClass(this.shutdownModal.nativeElement, 'show');
    this._renderer2.setStyle(this.shutdownModal.nativeElement, 'display', 'block');
  }


  closeShutdownForm(index){

    this.shutdownObject.type = null;
    this._renderer2.setStyle(this.shutdownModal.nativeElement, 'z-index', 9);
    this._renderer2.removeClass(this.shutdownModal.nativeElement, 'show');
    this._renderer2.setStyle(this.shutdownModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    if(AssetMaintenanceStore.shutdownData)
    AssetMaintenanceStore.frequencyShutdownData[index]?.asset_maintenance_schedule_shutdowns.push(AssetMaintenanceStore.shutdownData);
    AssetMaintenanceStore.shutdownData = null;
    this.shutdownObject.index = null;
    this._utilityService.detectChanges(this._cdr);
  }

  setMaintenanceIndex(index){
    this.setFormValues(index);
    if(this.currentScheduleIndex == index)
    this.currentScheduleIndex = null;
    else
    this.currentScheduleIndex = index
    this._utilityService.detectChanges(this._cdr);

  }

  getScheduledDate(date){
   let scheduled_date = this._helperService.processDate(date, 'join');
   return scheduled_date;

  }

  setShutdownAccordion(){
    if(this.shutdownOpened ==true){
      this.shutdownOpened =false
    }
    else
    this.shutdownOpened=true;
  }

  getCreatedByPopupDetails(users, supplier: boolean = false) {
    let userDetial: any = {};
    if (supplier && users != null) {
      let pos = SuppliersMasterStore.allItems.findIndex(e => e.id == users);
      if (pos != -1)
        users = SuppliersMasterStore.allItems[pos];
      userDetial['first_name'] = users?.first_name ? users?.first_name : users?.title? users?.title : '';
      userDetial['image_token'] = users?.image?.token;
      userDetial['designation'] = users?.email;
      userDetial['email'] = users?.email;
      userDetial['mobile'] = users?.mobile;
      userDetial['id'] = users?.id;
      userDetial['department'] = users?.department;
      userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    }
    else {
      userDetial['first_name'] = users?.first_name ? users?.first_name : users?.title? users?.title : '';
      userDetial['last_name'] = users?.last_name;
      userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      userDetial['image_token'] = users?.image?.token;
      userDetial['email'] = users?.email;
      userDetial['mobile'] = users?.mobile;
      userDetial['id'] = users?.id;
      userDetial['department'] = users?.department;
      userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    }
    return userDetial;
  }

  ngOnDestroy() {
    AssetRegisterStore.currentAssetPage = null;
    this.cancelEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    AssetMaintenanceStore.searchText = null;
    AssetMaintenanceStore.editFlag=false;
    if (this.reactionDisposer) this.reactionDisposer();
  }

}
