import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
// import { RiskTreatmentService } from 'src/app/core/services/risk-management/risks/risk-treatment/risk-treatment.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UserDocumentStore } from 'src/app/stores/human-capital/users/user-document.store';
// import { IsmsRiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';
// import { IsmsRisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store'
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
// import { RiskAssessmentService } from 'src/app/core/services/risk-management/risks/risk-assessment/risk-assessment.service';
// import { IsmsRiskAssessmentStore } from 'src/app/stores/risk-management/risks/risk-assessment.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
// import { ISMSRiskSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { RiskTypeService } from 'src/app/core/services/masters/risk-management/risk-type/risk-type.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsRiskTreatmentStore } from 'src/app/stores/isms/isms-risks/isms-risk-treatment.store';
import { IsmsRiskTreatmentService } from 'src/app/core/services/isms/isms-risks/isms-risk-treatment/isms-risk-treatment.service';
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';
import { IsmsRiskAssessmentService } from 'src/app/core/services/isms/isms-risks/isms-risk-assessment/isms-risk-assessment.service';
import { IsmsRiskAssessmentStore } from 'src/app/stores/isms/isms-risks/isms-risk-assessment.store';
import { IsmsRiskSettingsService } from 'src/app/core/services/settings/organization_settings/isms-risk-settings/isms-risk-settings.service';
import { ISMSRiskSettingStore } from 'src/app/stores/settings/isms-risk-settings.store';

declare var $: any;
@Component({
  selector: 'app-add-isms-risk-treatment',
  templateUrl: './add-isms-risk-treatment.component.html',
  styleUrls: ['./add-isms-risk-treatment.component.scss']
})
export class AddIsmsRiskTreatmentComponent implements OnInit {
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('controlFormModal') controlFormModal: ElementRef;
  regForm: FormGroup;
  formErrors: any;
  cancelEventSubscription: any;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore
  // ISMSRiskSettingStore = ISMSRiskSettingStore;
  ISMSRiskSettingStore = ISMSRiskSettingStore;
  currentTab = 0;
  AppStore = AppStore;
  ProcessStore = ProcessStore;
  cancelObject = {
    type: '',
    title: '',
    subtitle: ''
  };
  controlObject = {
    values: null,
    type: null,
    page: 'add-risk'
  }

  riskDetailObject = {
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

  watcherDetailObject = {
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
  IsmsRisksStore = IsmsRisksStore;
  IsmsRiskTreatmentStore = IsmsRiskTreatmentStore;
  UserDocumentStore = UserDocumentStore;
  ControlStore = ControlStore;
  sliderValue = 0;
  controlModalEventSubscription: any;
  controlEventSubscription: any;
  nextButtonText = 'Next';
  previousButtonText = "Previous";
  formObject = {
    0: [
      'risk_id',
      'responsible_user_id',
      'title',
      'description',
      'budget',
      'start_date',
      'target_date',
      'watchers_ids'
    ],
    1: [
      'risk_controls',
    ],

  }
  responsibleOpened = true;
  watcherOpened = true;
  processIndex = null;
  IsmsRiskAssessmentStore = IsmsRiskAssessmentStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  UsersStore = UsersStore;
  newControls = [];
  modalCount = 0;
  controlEmptyList = "control_empty_list_message";
  responsibleUserEmptyList = "responsible_user_empty_list_message";
  watcherEmptyList = "watchers_empty_list_message";
  controlsModalTitle = 'risk_treatment_controls_modal_title';
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  activeProcess = null;
  DivisionStore = DivisionMasterStore;
  DepartmentStore = DepartmentMasterStore;
  SectionStore = SectionMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  //ck editor configuration
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

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _riskTreatmentService: IsmsRiskTreatmentService,
    private _formBuilder: FormBuilder,
    private _riskAssessmentService: IsmsRiskAssessmentService,
    private _usersService: UsersService,
    private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _controlService: ControlsService,
    private _riskService: IsmsRisksService,
    private _ismsRiskSettingsService: IsmsRiskSettingsService,
    private _divisionService: DivisionService,
    private _departmentService: DepartmentService,
    private _sectionService: SectionService) { }

  ngOnInit(): void {
    IsmsRisksStore.unsetRiskDetails();
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

      //   this.regForm.pristine;
      // }, 250);

    });
    AppStore.showDiscussion = false

    this.buildForm();
    IsmsRisksStore.is_registered==true;

    this._riskService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this._ismsRiskSettingsService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    if (IsmsRisksStore.riskId) {
      this._riskAssessmentService.getItem().subscribe(res => {
        // if(res['risk_processes'])
        // this.activeProcess=res['risk_processes'][0]?.process?.id;
        // IsmsRiskAssessmentStore.riskAssessmentDetails?.risk_processes

        this._utilityService.detectChanges(this._cdr);
      })
    }



    if (IsmsRiskTreatmentStore.editFlag) {
      this.setEditValues();
    }
    else {
      if (IsmsRisksStore.individual_risk_loaded && !IsmsRiskTreatmentStore.isRiskTreatmentPlan) {
        this.regForm.patchValue({
          risk_id: IsmsRisksStore.individualRiskDetails?.id,
          risk_title: IsmsRisksStore.individualRiskDetails?.title,
          divisions: this.getTitle(IsmsRisksStore.individualRiskDetails?.divisions),
          departments: this.getTitle(IsmsRisksStore.individualRiskDetails?.departments),
          sections: this.getTitle(IsmsRisksStore.individualRiskDetails?.sections),
          risk_owner: IsmsRisksStore.individualRiskDetails?.risk_owner,
          risk_description: IsmsRisksStore.individualRiskDetails?.description
        })
      }



    }

    this.regForm.controls['risk_title'].disable();
    this.regForm.controls['divisions'].disable();
    this.regForm.controls['departments'].disable();
    this.regForm.controls['sections'].disable();
    this.regForm.controls['risk_owner'].disable();
    this.regForm.controls['risk_description'].disable();



    SubMenuItemStore.setNoUserTab(true);
    if (!IsmsRiskTreatmentStore.isRiskTreatmentPlan) {
      SubMenuItemStore.setSubMenuItems([
        { type: 'close', path: '/isms/isms-risks/' + IsmsRisksStore.riskId + '/isms-risk-treatment' },
      ]);
    }

    else if (IsmsRiskTreatmentStore.isRiskTreatmentPlan && IsmsRiskTreatmentStore.editFlag && IsmsRiskTreatmentStore.riskTreatmentDetails?.id) {
      IsmsRiskTreatmentStore.editFlag = false;
      SubMenuItemStore.setSubMenuItems([
        { type: 'close', path: '/isms/isms-risk-treatment/' + IsmsRiskTreatmentStore.riskTreatmentDetails?.id },
      ]);
    }
    else {
      this.getRisks();
      SubMenuItemStore.setSubMenuItems([
        { type: 'close', path: '/isms/isms-risk-treatments' },
      ]);
    }



    window.addEventListener('scroll', this.scrollEvent, true);

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelTreatment(item);
    })

    this.controlEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {

      this.closeControls();
      this._utilityService.detectChanges(this._cdr);
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


    this.controlModalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeControlModal();
    })
    IsmsRisksStore.currentRiskPage = "treatment";



    setTimeout(() => {

      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);

    }, 250);
  }

  removeNewControl(pId, cId, id) {
    let pos = ControlStore.selectedControlsList.findIndex(e => e.id == id);
    ControlStore.selectedControlsList.splice(pos, 1);
    if (IsmsRiskTreatmentStore.editFlag) {
      IsmsRiskTreatmentStore.riskTreatmentDetails?.process_details[pId]['newly_added']?.splice(cId, 1);

    }
    else {
      IsmsRiskAssessmentStore.riskAssessmentDetails?.risk_processes[pId]['new_controls']?.splice(cId, 1);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  buildForm() {
    this.regForm = this._formBuilder.group({
      id: [null],
      reference_code: [''],
      responsible_user_id: [null, [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      description: [''],
      treatment_dependency:[''],
      budget: ['', [Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]],
      start_date: [null, [Validators.required]],
      target_date: [null, [Validators.required]],
      risk_id: [null],
      watchers_ids: [[]],
      risk_controls: [[]],
      risk_title: [''],
      divisions: [[]],
      departments: [[]],
      sections: [[]],
      risk_owner: [null],
      risk_description: ['']

    })
    if (IsmsRiskTreatmentStore.isRiskTreatmentPlan)
      this.regForm.controls['risk_id'].setValidators(Validators.required);
  }

  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  ngAfterViewChecked() {

    // First let's set the colors of our sliders
    const settings = {
      fill: '#00C73C',
      background: '#fff'
    }

    // First find all our sliders
    const sliders = document.querySelectorAll('.range-slider');

    // Iterate through that list of sliders
    // ... this call goes through our array of sliders [slider1,slider2,slider3] and inserts them one-by-one into the code block below with the variable name (slider). We can then access each of wthem by calling slider
    Array.prototype.forEach.call(sliders, (slider) => {
      // Look inside our slider for our input add an event listener
      //   ... the input inside addEventListener() is looking for the input action, we could change it to something like change
      slider.querySelector('input').addEventListener('input', (event) => {
        // 1. apply our value to the span
        if (this.regForm.value.budget)
          slider.querySelector('span').innerHTML = event.target.value;
        else
          slider.querySelector('span').innerHTML = 0;
        // 2. apply our fill to the input
        applyFill(event.target);
      });
      // Don't wait for the listener, apply it now!
      applyFill(slider.querySelector('input'));
    });

    // This function applies the fill to our sliders by using a linear gradient background
    function applyFill(slider) {
      // Let's turn our value into a percentage to figure out how far it is in between the min and max of our input
      const percentage = 100 * (slider.value - slider.min) / (slider.max - slider.min);
      // now we'll create a linear gradient that separates at the above point
      // Our background color will change here
      const bg = `linear-gradient(90deg, ${settings.fill} ${percentage}%, ${settings.background} ${percentage + 0.1}%)`;
      slider.style.background = bg;
    }

  }

  // setValue() {
  //   this.sliderValue = $('#slider-input').val();
  //   // this.sliderValue = data;
  //   this.sliderValue = ISMSRiskSettingStore.ismsRiskSettings.treatment_max_budget>0?this.sliderValue * (ISMSRiskSettingStore.riskManagementSettings.treatment_max_budget/100):0;
  // }
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

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.submitForm();

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
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      this.getSelectedValues();
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

  setActiveProcess(id) {
    if (this.activeProcess == id) {
      this.activeProcess = null;
    }
    else
      this.activeProcess = id;
    this._utilityService.detectChanges(this._cdr);
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
          if (!this.regForm.controls[i].valid) {
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
            if (!this.regForm.controls[k].valid) {
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
    $('.modal-backdrop').remove();
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

  getWatcherPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.watcherDetailObject.first_name = user.first_name;
      this.watcherDetailObject.last_name = user.last_name;
      this.watcherDetailObject.designation = user.designation ? user.designation : user.designation_title;
      this.watcherDetailObject.image_token = user.image?.token ? user.image?.token : user.image_token;
      this.watcherDetailObject.email = user.email;
      this.watcherDetailObject.mobile = user.mobile;
      this.watcherDetailObject.id = user.id;
      this.watcherDetailObject.department = user.department ? user.department : null;
      this.watcherDetailObject.status_id = user.status?.id ? user.status.id : 1;
      return this.watcherDetailObject;
    }
  }

  setEditValues() {
    // this.activeProcess=IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[0]?.process?.id;

    this.regForm.patchValue({
      id: IsmsRiskTreatmentStore.riskTreatmentDetails.id,
      responsible_user_id: IsmsRiskTreatmentStore.riskTreatmentDetails?.responsible_user,
      title: IsmsRiskTreatmentStore.riskTreatmentDetails.title,
      reference_code: IsmsRiskTreatmentStore.riskTreatmentDetails?.reference_code,
      description: IsmsRiskTreatmentStore.riskTreatmentDetails.description,
      treatment_dependency:IsmsRiskTreatmentStore.riskTreatmentDetails.treatment_dependency,
      start_date: this._helperService.processDate(IsmsRiskTreatmentStore.riskTreatmentDetails.start_date, 'split'),
      target_date: this._helperService.processDate(IsmsRiskTreatmentStore.riskTreatmentDetails.target_date, 'split'),
      watchers_ids: this.getData(IsmsRiskTreatmentStore.riskTreatmentDetails.watchers),
      risk_id: IsmsRiskTreatmentStore.riskTreatmentDetails.risk?.id ? this.getRisk(IsmsRiskTreatmentStore.riskTreatmentDetails.risk?.id) : '',

      // risk_controls:IsmsRiskTreatmentStore.riskTreatmentDetails.process_details
      budget: IsmsRiskTreatmentStore.riskTreatmentDetails.budget ? IsmsRiskTreatmentStore.riskTreatmentDetails.budget : 0
    })
    if (IsmsRiskTreatmentStore.isRiskTreatmentPlan) {
      this.regForm.patchValue({
        risk_id: IsmsRiskTreatmentStore.riskTreatmentDetails.risk.id
      })
      IsmsRisksStore.riskId = IsmsRisksStore.riskId ? IsmsRisksStore.riskId : null;
      this._riskService.getItem(this.regForm.value.risk_id).subscribe((res) => {
        if (res['is_analysis_performed'] == 1) {
          this._riskAssessmentService.getItem().subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
          })
        }
        this._utilityService.detectChanges(this._cdr)
      });

    }
    this.sliderValue = IsmsRiskTreatmentStore.riskTreatmentDetails.budget;

    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getData(data) {
    let dataArray = [];
    for (let i of data) {
      if (i.id) {
        dataArray.push(i);
      }

    }
    return dataArray;
  }

  getIds(data) {
    let idArray = [];
    for (let i of data) {
      idArray.push(i.id);
    }
    return idArray;
  }

  getRiskPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.riskDetailObject.first_name = user.first_name;
      this.riskDetailObject.last_name = user.last_name;
      this.riskDetailObject.designation = user.designation;
      this.riskDetailObject.image_token = user.image.token;
      this.riskDetailObject.email = user.email;
      this.riskDetailObject.mobile = user.mobile;
      this.riskDetailObject.id = user.id;
      this.riskDetailObject.department = user.department ? user.department : null;
      this.riskDetailObject.status_id = user.status.id ? user.status.id : 1;
      return this.riskDetailObject;
    }
  }

  /**
 * cancel modal
 * @param status - decision to cancel
 */
  cancelTreatment(status) {
    if (status) {
      if (IsmsRiskTreatmentStore.isRiskTreatmentPlan && IsmsRiskTreatmentStore.editFlag) {
        IsmsRiskTreatmentStore.editFlag = false;
        IsmsRiskTreatmentStore.isRiskTreatmentPlan = false;
        this._router.navigateByUrl('/isms/isms-risk-treatment/' + IsmsRiskTreatmentStore.riskTreatmentDetails.id);
      }
      else if (IsmsRiskTreatmentStore.isRiskTreatmentPlan && !IsmsRiskTreatmentStore.editFlag) {
        IsmsRiskTreatmentStore.isRiskTreatmentPlan = false;
        this._router.navigateByUrl('/isms/isms-risk-treatments');
      }
      else if (!IsmsRiskTreatmentStore.isRiskTreatmentPlan) {
        this._router.navigateByUrl('/isms/isms-risks/' + IsmsRisksStore.riskId + '/isms-risk-treatment');
      }
      this.regForm.reset();

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

  getValue(e) {
    this.regForm.patchValue({
      budget: e.target.value
    })
  }

  clearCancelObject() {

    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';

  }

  clear(type) {
    if (type == 'start_date') {
      this.regForm.patchValue({
        start_date: null
      })
    }
    else {
      this.regForm.patchValue({
        target_date: null
      })
    }
  }



  confirmCancel() {
    this.cancelObject.type = 'Cancel';
    this.cancelObject.title = 'Cancel Risk Treatment Creation?';
    this.cancelObject.subtitle = 'cancel_confirmation';
    $(this.cancelPopup.nativeElement).modal('show');
  }

  getSelectedValues() {
    if (this.regForm.value.start_date) {
      let tempstartdate = this.regForm.value.start_date;

      this.regForm.value.start_date = this._helperService.processDate(tempstartdate, 'join');

    }
    if (this.regForm.value.target_date) {
      let tempenddate = this.regForm.value.target_date;

      this.regForm.value.target_date = this._helperService.processDate(tempenddate, 'join')

    }
  }

  processFormValues(type) {
    let controlArray = []
    if (this.regForm.value.start_date) {
      let tempstartdate = this.regForm.value.start_date;

      this.regForm.value.start_date = this.formatDate(tempstartdate);

    }
    if (this.regForm.value.target_date) {
      let tempenddate = this.regForm.value.target_date;

      this.regForm.value.target_date = this.formatDate(tempenddate);

    }
    if (IsmsRiskTreatmentStore.editFlag) {
      for (let i of IsmsRiskTreatmentStore.riskTreatmentDetails.process_details) {
        if (i.new_controls && i.new_controls?.length > 0) {
          for (let j of i.new_controls) {
            if (j['is_deleted']) {
              controlArray.push({ is_deleted: true, id: j.id, process_id: i.process.id, control_id: j.control_id })
            }

          }
        }

        if (i['newly_added'] && i['newly_added'].length > 0) {
          for (let k of i['newly_added']) {
            controlArray.push({ is_new: true, control_id: k.id, process_id: i.process.id });
          }
        }

      }

    }
    else {
      if (IsmsRiskAssessmentStore?.riskAssessmentDetails?.risk_processes?.length > 0) {
        for (let i of IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes) {
          if (i['new_controls'] && i['new_controls']?.length > 0) {
            for (let j of i['new_controls']) {
              // if(!j['is_deleted']){
              controlArray.push({ is_new: true, process_id: i.process.id, control_id: j.id })
              // }
            }
          }

        }
      }
    }




    var formObject = {
      responsible_user_id: this.regForm.value?.responsible_user_id?.id,
      title: this.regForm.value.title,
      description: this.regForm.value.description,
      treatment_dependency:this.regForm.value.treatment_dependency,
      budget: this.regForm.value.budget ? parseInt(this.regForm.value.budget).toFixed(2) : '',
      start_date: this.regForm.value.start_date,
      target_date: this.regForm.value.target_date,
      watchers_ids: this.getIds(this.regForm.value.watchers_ids),
      risk_controls: controlArray,
      risk_id: IsmsRisksStore.riskId,
      // risk_id:IsmsRisksStore.riskId


    }
    return formObject;
  }

  removeControl(p, n) {
    IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[p].new_controls[n]['is_deleted'] = true;
  }

  formatDate(date) {
    if (date) {
      // if (this.externalAuidtForm.value.start_date) {
      let tempRiskDate = this._helperService.processDate(date, 'join')
      return tempRiskDate;
    }
  }

  //save or update the user from here
  submitForm() {
    //if (this.regForm.valid) {
    let save;
    AppStore.enableLoading();
    this.nextButtonText = "loading";
    this.previousButtonText = "loading";

    if (this.regForm.value.id) {
      save = this._riskTreatmentService.updateItem(this.regForm.value.id, this.processFormValues('update'));
    } else {
      this.regForm.removeControl('id');
      save = this._riskTreatmentService.saveItem(this.processFormValues('update'));
    }
    save.subscribe((res: any) => {
      AppStore.disableLoading();

      if (IsmsRiskTreatmentStore.editFlag && !IsmsRiskTreatmentStore.isRiskTreatmentPlan) {
        this._riskService.getItem(IsmsRisksStore.riskId).subscribe(response => {
          this._utilityService.detectChanges(this._cdr);
        })
  
        IsmsRiskTreatmentStore.unsetEditFlag();
      }
      this._utilityService.detectChanges(this._cdr);

      if (IsmsRiskTreatmentStore.isRiskTreatmentPlan && IsmsRiskTreatmentStore.editFlag) {
        IsmsRiskTreatmentStore.unsetEditFlag();
        IsmsRiskTreatmentStore.isRiskTreatmentPlan = false;
        this._router.navigateByUrl('/isms/isms-risk-treatment/' + IsmsRiskTreatmentStore.riskTreatmentDetails.id);
      }
      else if (IsmsRiskTreatmentStore.isRiskTreatmentPlan && !IsmsRiskTreatmentStore.editFlag) {
        IsmsRiskTreatmentStore.isRiskTreatmentPlan = false;
        this._router.navigateByUrl('/isms/isms-risk-treatments');
      }
      else if (!IsmsRiskTreatmentStore.isRiskTreatmentPlan) {
        IsmsRiskTreatmentStore.setCurrentPage(1);
        this._router.navigateByUrl('/isms/isms-risks/' + IsmsRisksStore.riskId + '/isms-risk-treatment');
      }

      // this._router.navigateByUrl('risk-management/risks/'+IsmsRisksStore.riskId+'/risk-treatment');
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        // AppStore.disableLoading();
        this.formErrors = err.error.errors;
        this.processFormErrors();
        this.currentTab = 0;
        this.nextButtonText = "Next";
        this.previousButtonText = "Previous";
        this.setInitialTab();
        this.showTab(this.currentTab);
      }
      // else if(err.status == 500 || err.status==404){
      //   this.closeFormModal();
      //   AppStore.disableLoading();
      // }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
    // }
  }

  processFormErrors() {
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if (key.startsWith('risk_controls.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['risk_controls'] = this.formErrors['risk_controls'] ? this.formErrors['risk_controls'] + errors[key] + '(' + (errorPosition + 1) + ')' : errors[key];
    
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  // Opens Modal to Select Processes
  selectControls(pIndex) {
    IsmsRiskTreatmentStore.selectedRiskControls = [];
    ControlStore.processControl = [];
    IsmsRiskTreatmentStore.processIndex = pIndex;
    this._utilityService.detectChanges(this._cdr);

    if (IsmsRiskTreatmentStore.editFlag) {
      for (let i of IsmsRiskTreatmentStore.riskTreatmentDetails.process_details) {
        if (i.new_controls?.length > 0) {
          for (let j of i.new_controls) {
            IsmsRiskTreatmentStore.selectedRiskControls.push(j.control.id);
          }

        }
        if (i.existing_controls?.length > 0) {
          for (let k of i.existing_controls) {
            IsmsRiskTreatmentStore.selectedRiskControls.push(k.control.id);
          }

        }
        if (i['newly_added'] && i['newly_added'].length > 0) {
          for (let l of i['newly_added']) {
            IsmsRiskTreatmentStore.selectedRiskControls.push(l.id);
          }
        }
      }
      // if (IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex].new_controls?.length > 0) {
      //   for (let i of IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex].new_controls) {
      //     IsmsRiskTreatmentStore.selectedRiskControls.push(i.control.id);
      //   }
      // }
      // if (IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]?.existing_controls?.length > 0)

      //   for (let i of IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]?.existing_controls) {
      //     IsmsRiskTreatmentStore.selectedRiskControls.push(i.control.id);
      //   }

      // ControlStore.selectedControlsList = this.newControls;

      //   for (let i of IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added']) {
      //     IsmsRiskTreatmentStore.selectedRiskControls.push(i.id);
      //   }
      if (IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added'] && IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added'].length > 0) {

        ControlStore.processControl = IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added'];
      }
      // }

      else
        ControlStore.processControl = [];
    }

    else {
      for (let i of IsmsRiskAssessmentStore?.riskAssessmentDetails?.risk_processes) {
        if (i.controls?.length > 0) {
          for (let j of i.controls) {
            IsmsRiskTreatmentStore.selectedRiskControls.push(j.control.id);
          }

        }
        if (i['new_controls'] && i['new_controls']?.length > 0) {
          for (let k of i['new_controls']) {
            IsmsRiskTreatmentStore.selectedRiskControls.push(k.id);
          }

        }

      }
      // if (IsmsRiskAssessmentStore?.riskAssessmentDetails?.risk_processes[IsmsRiskTreatmentStore.processIndex]?.controls?.length > 0) {
      //   for (let i of IsmsRiskAssessmentStore?.riskAssessmentDetails?.risk_processes[IsmsRiskTreatmentStore.processIndex].controls) {
      //     IsmsRiskTreatmentStore.selectedRiskControls.push(i.control.id);
      //   }
      // }

      if (IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls'] && IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls'].length > 0) {
        ControlStore.processControl = IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls']
      }
      else {
        ControlStore.processControl = [];
      }
    }
    this._utilityService.detectChanges(this._cdr);

    setTimeout(() => {
      ProcessStore.add_control_form_modal = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.processFormModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        this._renderer2.addClass(this.processFormModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);

    // ProcessStore.add_control_form_modal = true;
    // $(this.processFormModal.nativeElement).modal('show');
    // this._utilityService.detectChanges(this._cdr);
  }


  changeZIndex() {
    if ($(this.processFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.controlFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'overflow', 'auto');
    }

  }


  // Close Modal to select processes
  closeControls() {
    if (ControlStore.saved) {
      if (IsmsRiskTreatmentStore.editFlag) {

        IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added'] = ControlStore.processControl;
        // this.newControls.push(ControlStore.selectedControlsList);
      }
      else
        IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls'] = ControlStore.processControl;
   
    }

    setTimeout(() => {
      ProcessStore.add_control_form_modal = false;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.processFormModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.processFormModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);

    // ProcessStore.add_control_form_modal = false;
    // $(this.processFormModal.nativeElement).modal('hide');
    // this._utilityService.detectChanges(this._cdr);
  }

  addControl(pIndex) {
    this.modalCount = 0;
    ControlStore.selectedControlsList = [];
    ControlStore.processControl = [];

    IsmsRiskTreatmentStore.processIndex = pIndex
    if (IsmsRiskTreatmentStore.editFlag) {

      if (IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added'] && IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added'].length > 0)
        ControlStore.processControl = IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added'];
      else
        ControlStore.processControl = [];
    }
    else {
      if (IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls'] && IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls'].length > 0) {
        ControlStore.processControl = IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls']
      }
      else {
        ControlStore.processControl = [];
      }

    }

    setTimeout(() => {
      this.controlObject.type = 'Add'
      this.controlObject.values = null
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.controlFormModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.controlFormModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);

  }

  setWatcherOpened() {
    if (this.watcherOpened == false) {
      this.watcherOpened = true
    }
    else
      this.watcherOpened = false
  }

  setResponsibleOpened() {
    if (this.responsibleOpened == false) {
      this.responsibleOpened = true
    }
    else
      this.responsibleOpened = false
  }

  closeControlModal() {
    this.controlObject.type = null;

    if (ControlStore.lastInsertedId) {


      this._controlService.getItemById(ControlStore.lastInsertedId).subscribe(res => {

        var obj = { id: res['id'], reference_code: res['reference_code'], title: res['title'], description: res['description'], control_type_id: res['control_type']?.id, control_category_id: res['control_category']?.id, control_sub_category_id: res['control_sub_category']?.id, status: null, status_id: null, status_label: null, control_objectives: res['control_objectives'], control: null }
        ControlStore.selectedControlsList.push(obj);
        if (IsmsRiskTreatmentStore.editFlag) {
          if (IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]?.hasOwnProperty('newly_added')) {
            IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added']?.push(res);

          }
          else {
            IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added'] = [];
            IsmsRiskTreatmentStore.riskTreatmentDetails.process_details[IsmsRiskTreatmentStore.processIndex]['newly_added']?.push(res);

          }

        }
        else {
          if (IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]?.hasOwnProperty('new_controls')) {
            IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls']?.push(res);

          }
          else {
            IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls'] = [];
            IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls']?.push(res);

          }
        }
        // IsmsRiskAssessmentStore.riskAssessmentDetails.risk_processes[IsmsRiskTreatmentStore.processIndex]['new_controls']?.push(res);
        this._utilityService.detectChanges(this._cdr);

        setTimeout(() => {
          ControlStore.unsetLastInsertedId();

          document.body.classList.remove('modal-open')
          this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
          this._renderer2.setAttribute(this.controlFormModal.nativeElement, 'aria-hidden', 'true');
          $('.modal-backdrop').remove();
          setTimeout(() => {
            this._renderer2.removeClass(this.controlFormModal.nativeElement, 'show')
            this._utilityService.detectChanges(this._cdr)
          }, 200);
        }, 100);

      })
    }
    // }

    else {
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.controlFormModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.controlFormModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.controlFormModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);

    }


  }



  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getTypes(types) {
    let type = [];
    for (let i of types) {
      type.push(i.id);
    }
    return type;
  }

  getUsers(type) {
    let params = '';
    if (type == 'owner') {
      if (IsmsRisksStore.individualRiskDetails?.organizations)
        params = '?organization_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.organizations)

      if (IsmsRisksStore.individualRiskDetails?.divisions)
        params += '&division_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.divisions);

      if (IsmsRisksStore.individualRiskDetails?.departments)
        params += '&department_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.departments);

      if (IsmsRisksStore.individualRiskDetails?.sections)
        params += '&section_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.sections);

      if (IsmsRisksStore.individualRiskDetails?.sub_sections)
        params += '&sub_section_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.sub_sections);


    }
    this._usersService.getAllItems(params ? params : '').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  searchUsers(e, type) {
    let params = '';
    if (type == 'owner') {
      if (IsmsRisksStore.individualRiskDetails?.organizations)
        params = '&organization_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.organizations)

      if (IsmsRisksStore.individualRiskDetails?.divisions)
        params += '&division_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.divisions);

      if (IsmsRisksStore.individualRiskDetails?.departments)
        params += '&department_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.departments);

      if (IsmsRisksStore.individualRiskDetails?.sections)
        params += '&section_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.sections);

      if (IsmsRisksStore.individualRiskDetails?.sub_sections)
        params += '&sub_section_ids=' + this.getTypes(IsmsRisksStore.individualRiskDetails?.sub_sections);


    }

    this._usersService.searchUsers('?q=' + e.term + (params ? params : '')).subscribe(res => {
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

  getRisk(id) {
    this._riskService.getItem(id).subscribe(res => {
      this.regForm.patchValue({
        risk_id: res['id'],
        risk_title: res['title'],
        divisions: this.getTitle(res['divisions']),
        departments: this.getTitle(res['departments']),
        sections: this.getTitle(res['sections']),
        risk_owner: res['risk_owner'],
        risk_description: res['description']
      })
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // getIDs(data){
  //   let idArray=[]
  //   for(let i of data)
  //     idArray.push(i.id)
  //   return idArray;
  // }

  searchRisks(e) {
    this._riskService.getItems(false, 'q=' + e.term + '&risk_control_plan_ids=2,3').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRisks(fetch: boolean = false) {
    this._riskService.getItems(fetch, 'risk_control_plan_ids=2,3').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getRiskDetails() {
    if (IsmsRiskTreatmentStore.isRiskTreatmentPlan && this.regForm.value.risk_id) {
      IsmsRisksStore.riskId = this.regForm.value.risk_id;
      this._riskService.getItem(this.regForm.value.risk_id).subscribe((res) => {
        this.regForm.patchValue({
          risk_title: res['title'],
          divisions: this.getTitle(res['divisions']),
          sections: this.getTitle(res['sections']),
          departments: this.getTitle(res['departments']),
          risk_owner: res['risk_owner'],
          risk_description: res['description']
        })
        // this._departmentService.getItems().subscribe(res=>{
        //   this._utilityService.detectChanges(this._cdr);
        // })
        if (res['is_analysis_performed'] == 1) {

          this._riskAssessmentService.getItem().subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
          })
        }
        this._utilityService.detectChanges(this._cdr)
      });

    }
  }

  getTitle(data) {
    let dataArray = [];
    for (let i of data) {
      dataArray.push(i)
    }
    return dataArray;
  }


  ngOnDestroy() {
    if (IsmsRiskTreatmentStore.isRiskTreatmentPlan) {
      IsmsRisksStore.riskId = null;
      IsmsRiskAssessmentStore.unsetAssessmentDetails();
    }
    ControlStore.selectedControlsList = [];
    ControlStore.processControl = []
    IsmsRiskTreatmentStore.isRiskTreatmentPlan = false;
    IsmsRisksStore.currentRiskPage = null;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    // window.addEventListener('scroll', this.scrollEvent, null);
    // this.regForm.reset();
    this.cancelEventSubscription.unsubscribe();
    this.controlModalEventSubscription.unsubscribe();
    this.controlEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.regForm.reset();

    IsmsRiskTreatmentStore.editFlag = false;

    AppStore.disableLoading();

  }

}
