import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RiskRegisterService } from 'src/app/core/services/event-monitoring/risk-register/risk-register.service';
import { RiskTreatmentService } from 'src/app/core/services/event-monitoring/risk-treatment/risk-treatment.service';

import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RiskRegisterStore } from 'src/app/stores/event-monitoring/risk-register/risk-register-store';
import { EventRiskTreatmentStore } from 'src/app/stores/event-monitoring/risk-register/risk-treatment.store';

import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';

@Component({
  selector: 'app-add-risk-treatment',
  templateUrl: './add-risk-treatment.component.html',
  styleUrls: ['./add-risk-treatment.component.scss']
})
export class AddRiskTreatmentComponent implements OnInit {

  @Input('source') source: any;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  AppStore = AppStore;
  AuthStore = AuthStore;
  RisksStore = RisksStore
  UsersStore = UsersStore
  EventRiskTreatmentStore = EventRiskTreatmentStore
  RiskRegisterStore = RiskRegisterStore
  RiskManagementSettingStore = RiskManagementSettingStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  SubSectionMasterStore = SubSectionMasterStore;
  form: FormGroup;
  formErrors: any;
  
  organisationChangesModalSubscription: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  sliderValue = 0;

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

  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService, private _riskService: RisksService,
    private _utilityService: UtilityService, private _http: HttpClient,
    private _riskTreatmentService: RiskTreatmentService, private _usersService: UsersService,
    private _bcmRiskAssessmentService: RiskRegisterService, private _renderer2: Renderer2, private _router: Router,
    private _riskManagementSettingsService: RiskManagementSettingsService,private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,) { }

  ngOnInit(): void {

    this._riskService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskManagementSettingsService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this.form = this._formBuilder.group({
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
      watcher_ids: [[]],
      risk_controls: [[]],
      risk_title: [''],
      divisions: [[]],
      departments: [[]],
      sections: [[]],
      risk_owner: [null],
      risk_description: ['']
    })
    this.form.patchValue({
      start_date: this._helperService.getTodaysDateObject()
    })
    // if (RiskRegisterStore.RiskRegisterId) {
    //   this._bcmRiskAssessmentService.getRiskAssessment(RiskRegisterStore.RiskRegisterId).subscribe(res => {
    //     this._utilityService.detectChanges(this._cdr);
    //   })
    // }
    if (RiskRegisterStore.individualLoaded && !EventRiskTreatmentStore.isRiskTreatmentPlan) {
      this.form.patchValue({
        // risk_id: RiskRegisterStore.individualRiskRegisterDetails?.id,
        risk_title: RiskRegisterStore.individualRiskRegisterDetails?.title,
        // divisions: this.getTitle(RiskRegisterStore.individualRiskRegisterDetails?.divisions),
        departments: this.getTitle(RiskRegisterStore.individualRiskRegisterDetails?.departments),
        // sections: this.getTitle(RiskRegisterStore.individualRiskRegisterDetails?.sections),
        risk_owner: RiskRegisterStore.individualRiskRegisterDetails?.risk_owner,
        risk_description: RiskRegisterStore.individualRiskRegisterDetails?.description
      })
    }
    if(this.source.type == 'Edit')this.setEditValues()
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

  setEditValues() {
    this.form.patchValue({
      id: EventRiskTreatmentStore.riskTreatmentDetails.id,
      responsible_user_id: EventRiskTreatmentStore.riskTreatmentDetails?.responsible_user,
      title: EventRiskTreatmentStore.riskTreatmentDetails.title,
      reference_code: EventRiskTreatmentStore.riskTreatmentDetails?.reference_code,
      description: EventRiskTreatmentStore.riskTreatmentDetails.description,
      treatment_dependency:EventRiskTreatmentStore.riskTreatmentDetails.treatment_dependency,
      start_date: this._helperService.processDate(EventRiskTreatmentStore.riskTreatmentDetails.start_date, 'split'),
      target_date: this._helperService.processDate(EventRiskTreatmentStore.riskTreatmentDetails.target_date, 'split'),
      watcher_ids: this.getData(EventRiskTreatmentStore.riskTreatmentDetails.watchers),
      risk_id: EventRiskTreatmentStore.riskTreatmentDetails.risk?.id ? this.getRisk(EventRiskTreatmentStore.riskTreatmentDetails.risk?.id) : '',

      // risk_controls:EventRiskTreatmentStore.riskTreatmentDetails.process_details
      budget: EventRiskTreatmentStore.riskTreatmentDetails.budget ? EventRiskTreatmentStore.riskTreatmentDetails.budget : 0
    })
    if (EventRiskTreatmentStore.isRiskTreatmentPlan) {
      this.form.patchValue({
        risk_id: EventRiskTreatmentStore.riskTreatmentDetails.risk.id
      })

    }
    this.sliderValue = EventRiskTreatmentStore.riskTreatmentDetails.budget;

    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

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
    if (EventRiskTreatmentStore.isRiskTreatmentPlan && this.form.value.risk_id) {
      RiskRegisterStore.RiskRegisterId = this.form.value.risk_id;
      this._riskService.getItem(this.form.value.risk_id).subscribe((res) => {
        this.form.patchValue({
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
        // if (res['is_analysis_performed'] == 1) {

        //   this._bcmRiskAssessmentService.getRiskAssessment(RiskRegisterStore.RiskRegisterId).subscribe(res => {
        //     this._utilityService.detectChanges(this._cdr);
        //   })
        // }
        this._utilityService.detectChanges(this._cdr)
      });

    }
  }

  getRisk(id) {
    this._riskService.getItem(id).subscribe(res => {
      this.form.patchValue({
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

  getTitle(data) {
    let dataArray = [];
    for (let i of data) {
      dataArray.push(i)
    }
    return dataArray;
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

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  clear(type) {
    if (type == 'start_date') {
      this.form.patchValue({
        start_date: null
      })
    }
    else {
      this.form.patchValue({
        target_date: null
      })
    }
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
      if (RiskRegisterStore.individualRiskRegisterDetails?.organizations)
        params = '?organization_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.organizations)

      if (RiskRegisterStore.individualRiskRegisterDetails?.divisions)
        params += '&division_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.divisions);

      if (RiskRegisterStore.individualRiskRegisterDetails?.departments)
        params += '&department_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.departments);

      if (RiskRegisterStore.individualRiskRegisterDetails?.sections)
        params += '&section_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.sections);

      if (RiskRegisterStore.individualRiskRegisterDetails?.sub_sections)
        params += '&sub_section_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.sub_sections);


    }
    this._usersService.getAllItems(params ? params : '').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  searchUsers(e, type) {
    let params = '';
    if (type == 'owner') {
      if (RiskRegisterStore.individualRiskRegisterDetails?.organizations)
        params = '&organization_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.organizations)

      if (RiskRegisterStore.individualRiskRegisterDetails?.divisions)
        params += '&division_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.divisions);

      if (RiskRegisterStore.individualRiskRegisterDetails?.departments)
        params += '&department_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.departments);

      if (RiskRegisterStore.individualRiskRegisterDetails?.sections)
        params += '&section_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.sections);

      if (RiskRegisterStore.individualRiskRegisterDetails?.sub_sections)
        params += '&sub_section_ids=' + this.getTypes(RiskRegisterStore.individualRiskRegisterDetails?.sub_sections);


    }
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

  formatDate(date) {
    if (date) {
      // if (this.externalAuidtForm.value.start_date) {
      let tempRiskDate = this._helperService.processDate(date, 'join')
      return tempRiskDate;
    }
  }

  processFormValues(type) {
    let controlArray = []
    if (this.form.value.start_date) {
      let tempstartdate = this.form.value.start_date;
      this.form.value.start_date = this.formatDate(tempstartdate);
    }
    if (this.form.value.target_date) {
      let tempenddate = this.form.value.target_date;
      this.form.value.target_date = this.formatDate(tempenddate);

    }
    var formObject = {
      responsible_user_id: this.form.value?.responsible_user_id?.id,
      title: this.form.value.title,
      description: this.form.value.description,
      treatment_dependency:this.form.value.treatment_dependency,
      budget: this.form.value.budget ? parseInt(this.form.value.budget).toFixed(2) : '',
      start_date: this.form.value.start_date,
      target_date: this.form.value.target_date,
      watcher_ids: this.getIds(this.form.value.watcher_ids),
      risk_id: RiskRegisterStore.RiskRegisterId,
      // risk_id:RisksStore.riskId


    }
    return formObject;
  }

  save(close:boolean=false) {
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._riskTreatmentService.updateItem(this.form.value.id, this.processFormValues('update'));
      } else {
        this.form.removeControl('id');
        save = this._riskTreatmentService.saveItem(this.processFormValues('update'));
      }
      save.subscribe((res: any) => {
        if(!this.form.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if(close)this.cancel()
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
          else if(err.status == 500 || err.status == 403){
            this.cancel();
          }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  cancel(){
    this.resetForm();
    this._eventEmitterService.dismissAddBcmRiskTreatmentModal();
  }

  resetForm(){
    this.form.reset();
    this.formErrors = null;
  }

}
