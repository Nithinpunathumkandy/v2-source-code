import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer, values } from 'mobx';
import { BcmStrategiesService } from 'src/app/core/services/bcm/bcm-strategies/bcm-strategies.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BcsTypeService } from 'src/app/core/services/masters/bcm/bcs-type/bcs-type.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BcmStrategyStore } from 'src/app/stores/bcm/strategy/bcm-strategy-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BcsTypesMasterStore } from 'src/app/stores/masters/bcm/bcs-type-store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { toJS } from 'mobx';
import { BcmRiskAssessmentService } from 'src/app/core/services/bcm/risk-assessment/bcm-risk-assessment.service';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { BcmRiskTreatmentService } from "src/app/core/services/bcm/bcm-risk-treatment/bcm-risk-treatment.service";
import { BcmRiskTreatmentStore } from 'src/app/stores/bcm/risk-assessment/bc-risk-treatment.store';

declare var $: any;
@Component({
  selector: 'app-add-bc-strategy',
  templateUrl: './add-bc-strategy.component.html',
  styleUrls: ['./add-bc-strategy.component.scss']
})
export class AddBcStrategyComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('criteriaPopup') criteriaPopup: ElementRef;
  @ViewChild('objectivePopup') objectivePopup: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('locationMaster') locationMaster: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('typeAddModal') typeAddModal: ElementRef;
  currentTab = 0;
  formObject = {
    0: [
      'business_continuity_strategy_type_id',
      'risk_ids'
    ]
  }

  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };
  formErrors: any;
  nextButtonText = "Next";
  previousButtonText = "Previous";
  SubMenuItemStore = SubMenuItemStore;
  BcmStrategyStore = BcmStrategyStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  openModelPopup: boolean = false;
  form: FormGroup;
  cancelEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  organisationChangesModalSubscription: any;
  bcmtypeAddEvent:any
  solutionsArray = [];
  benifitsArray = [];
  consiquencesArray = [];
  solution;
  BcmRiskTreatmentStore = BcmRiskTreatmentStore;
  BcsTypesMasterStore = BcsTypesMasterStore;
  BcmRiskAssessmentStore = BcmRiskAssessmentStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  RisksStore = RisksStore;
  AppStore = AppStore;
  saveSolutions: any = null;
  is_hour: any;
  is_day: boolean;
  solution_saved = 0

  scores =[{title: '1', value:1, id:1},
  {title: '2', value:2, id:2},
  {title: '3', value:3, id:3},
  {title: '4', value:4 , id:4},
  {title: '5', value:5, id:5}]

  times = [{title: 'Day', id:1},
  {title: 'Hour', id:2}]
  scoreSolutionid: any;
  clickedScore: any;
  constructor(
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _bcsTypes: BcsTypeService,
    private _risksService: RisksService,
    private _bcmStrategiesService: BcmStrategiesService,
    private _bcmRiskAssessmentService: BcmRiskAssessmentService,
    private _router: Router, private _riskTreatmentService: BcmRiskTreatmentService
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    OrganizationalSettingsStore.isMultiple = true;
    AppStore.disableLoading();
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener("scroll", this.scrollEvent, true);
    }, 1000);
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      // setTimeout(() => {
      //   this.form.pristine;
      // }, 250);
    });
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: '../' }]);
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );

    this.bcmtypeAddEvent = this._eventEmitterService.bcsTypeModalControl.subscribe(res=>{
      this.closeTypeModal();
    })

    this.form = this._formBuilder.group({
      id: [null],
      organization_ids: [[]],
      department_ids: [[]],
      division_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
      risk_ids: [null, [Validators.required]],
      business_continuity_strategy_type_id: [null, [Validators.required]],
      type_description: ['']
    })

    if (this._router.url.indexOf('edit') != -1) {
      var solutions = [];
      if (BcmStrategyStore.single_loaded) {
        this.solution_saved = 1;
        BcmStrategyStore.showId = BcmStrategyStore._singleStrategies?.solutions[0].id
        BcmStrategyStore._singleStrategies?.solutions.forEach(element => {
          var data = {
            "id": element.id,
            "title": element.title,
            "is_deleted": false,
          }
          solutions.push(data);
        });
        this.solutionsArray = solutions;
        this.form.patchValue({
          id: BcmStrategyStore._singleStrategies?.id,
          section_ids: toJS(BcmStrategyStore._singleStrategies?.sections),
          sub_section_ids: toJS(BcmStrategyStore._singleStrategies?.sub_sections),
          organization_ids: toJS(BcmStrategyStore._singleStrategies?.organizations),
          division_ids: toJS(BcmStrategyStore._singleStrategies?.divisions),
          department_ids: toJS(BcmStrategyStore._singleStrategies?.departments),
          risk_ids: this.getFilterById(BcmStrategyStore._singleStrategies?.risks),
          business_continuity_strategy_type_id: BcmStrategyStore._singleStrategies?.business_continuity_strategy_type?.id,
          type_description: BcmStrategyStore._singleStrategies?.business_continuity_strategy_type?.description

        })
      } else
        this._router.navigateByUrl('/bcm/business-continuity-strategies');
    } else {
      this.setInitialOrganizationLevels();
    }

    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);

    this.getBcContinuityStrategyType();
    this.getRisks();
    this.getBcmFinance();
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  getFilterById(fields) {
    var returnValues = [];
    for (let i of fields) {
      returnValues.push(i.id);
    }
    return returnValues;
  }

  addBcsType() {
		setTimeout(() => {
			$(this.typeAddModal.nativeElement).modal('show');
			this._renderer2.setStyle(this.typeAddModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
		}, 500);
	}

	closeTypeModal() {
		$(this.typeAddModal.nativeElement).modal('hide');

		if (BcsTypesMasterStore.lastInsertedId) {
			// this.form.patchValue({ auditable_item_category_id: AuditItemCategoryMasterStore.lastInsertedId });
			this.searchBcContinuityStrategyType({ term: BcsTypesMasterStore.lastInsertedId }, true);
			// AuditItemCategoryMasterStore.lastInsertedId = null;
		}
	}

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;

  }


  getRisks() {
    let params = 'inherent_risk_rating_ids=1,2,3,4';
    this._bcmRiskAssessmentService.getItems(false,params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskTreatments(e){
    if(e){
      this._riskTreatmentService.getItems(false,'risk_ids='+e,false).subscribe(res=>{
        this.processRiskTreatments(true,res.data);
      })
    }
  }

  clearRiskTreatments(e){
    // console.log(e);
    if(e){
      this._riskTreatmentService.getItems(false,'risk_ids='+e.value,false).subscribe(res=>{
        this.processRiskTreatments(false,res.data);
      })
    }
  }

  processRiskTreatments(status,response){
    if(response.length > 0){
      response.forEach(element => {
        var data = {
          "title": element.title,
          "is_new": true,
          "is_deleted": false,
        }
        let index = this.solutionsArray.findIndex(e => e.title == element.title);
        if(status){
          if(index == -1) this.solutionsArray.push(data);
        }
        else{
          if(index != -1) this.solutionsArray.splice(index,1);
          if(BcmStrategyStore._singleStrategies) BcmStrategyStore._singleStrategies.solutions.splice(index, 1);

        }
      });
      this._utilityService.detectChanges(this._cdr);
    }
  }

  getBcmFinance() {
    this._bcmStrategiesService.businessFinanceGet().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchRisks(e) {
    let params = '&inherent_risk_rating_ids=2,3,4,5';
    this._bcmRiskAssessmentService.getItems(false, 'q=' + e.term+params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBcContinuityStrategyType() {
    this._bcsTypes.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchBcContinuityStrategyType(e, patchValue: boolean = false) {
		this._bcsTypes.getItems(false, '&q=' + e.term).subscribe((res) => {
			if (patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.form.patchValue({ business_continuity_strategy_type_id: i.id });
            this.getDescription();
						break;
					}
				}
				BcsTypesMasterStore.lastInsertedId = null;
			}
			this._utilityService.detectChanges(this._cdr);
		});
  }

  getDescription() {
    if (this.form.value.business_continuity_strategy_type_id) {
      this.form.patchValue({
        type_description: BcsTypesMasterStore.getBcsTypesById(this.form.value.business_continuity_strategy_type_id).description
      })
    } else {
      this.form.patchValue({
        type_description: null
      })
    }
  }

  cancelByUser(status) {
    if (status) {
      this._router.navigateByUrl('/bcm/business-continuity-strategies');
    } else {

    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }

  confirmCancel() {
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    }, 100);
  }


  closeModal(data?) {
    if (data) {
      this.form.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids: data.department_ids ? data.department_ids : [],
        section_ids: data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }


  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  };

  // ================= TAB SETTINGS =====================
  nextPrev(n, is_save: boolean = false) {
    var x: any = document.getElementsByClassName("tab");
    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
    }

    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    this.currentTab = this.currentTab + n;
    if (this.currentTab >= x.length) {
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      if (BcmStrategyStore.new_strategy_id) {
      BcmStrategyStore.unsetDetails();
        if(this._router.url.indexOf('edit') != -1){
          this._utilityService.showSuccessMessage('success', 'bcm_stratergy_updated');
        }
        this._router.navigateByUrl('/bcm/business-continuity-strategies/' + BcmStrategyStore.new_strategy_id)
      } else {
        this._router.navigateByUrl('/bcm/business-continuity-strategies');
      }
      return false;
    }
    this.showTab(this.currentTab, is_save);
  }

  showTab(n, is_save: boolean = false) {
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
      if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "inoline";
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save & Next";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
      if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "inline";
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save & Next";
    }
    if (n != -1) {
      switch (this.currentTab) {
        case 1:
          if (is_save) this.submitStrategy()
          if (!is_save) this.getResourceRequirement(true);
          // if(BcmRiskAssessmentStore.selectedId){
          //   this.setEditSection();
          // }
          this._utilityService.detectChanges(this._cdr);
          break;
        case 2:
          // this._bcmStrategiesService.getStrategy(BcmStrategyStore.new_strategy_id).subscribe(res=>{
          //   this._utilityService.detectChanges(this._cdr);
          // });
          if (is_save) this.submitBsSolutions();
          this._utilityService.detectChanges(this._cdr);
          break;
        case 3:
          // if(is_save)this.submitRiskMapping()
          // this.gotoMappingSection('issue')
          break;
      }
    }
    if (n == x.length - 1) {
      // this.gotoMappingSection('issue');
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
      if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "none";
    }
    this.fixStepIndicator(n);
  }

  fixStepIndicator(n) {
    var i,
      x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    if (x[n]) x[n].className += " active";
  }

  // Setting Intial Tab

  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  changeStep(step) {
    if (step > this.currentTab && this.checkFormObject(step)) {
      let dif = step - this.currentTab;
      this.nextPrev(dif)
      if(step == 1) this.getResourceRequirement();
    }
    else if (step < this.currentTab) {
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
      if(step == 1) this.getResourceRequirement();
    }
    
  }

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.form.controls[i].valid) {
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
            if (!this.form.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

   processSaveSolutions() {
    let object = {
      "business_continuity_strategy_id": BcmStrategyStore.new_strategy_id,
      "solutions": []
    }
    for (let i = 0; i < BcmStrategyStore._singleStrategies?.solutions.length; i++) {
      var element = BcmStrategyStore._singleStrategies?.solutions[i];
      // if(this.processBenifitsArray(element).length>0||this.processConcequencesArray(element).length>0||element['business_continuity_strategy_finance_id'+i]||element['score'+i]){
      if(this.checkSolutionValuePresent(element,i)){
        var obj2 = new Object;
        obj2['id'] = element.id;
        obj2['skills'] = element['skills' + i];
        obj2['people'] = element['people' + i];
        obj2['information_and_data'] = element['information_and_data' + i];
        obj2['buildings_and_utilities'] = element['buildings_and_utilities' + i];
        obj2['facilities_equipment'] = element['facilities_equipment' + i];
        obj2['information_and_operational_technology'] = element['information_and_operational_technology' + i];
        obj2['transportation_and_logistics'] = element['transportation_and_logistics' + i];
        obj2['supply_chain'] = element['supply_chain' + i];
        obj2['duration'] = element['duration' + i];
        obj2['remarks'] = element['remarks' + i];
        obj2['description'] = element['description' + i];
        obj2['score'] = element['score' + i];
        this.clickedScore = element['score' + i];
        obj2['expense'] = element['expense' + i];
        obj2['business_continuity_strategy_finance_id'] = element['business_continuity_strategy_finance_id' + i];
        obj2['benifits'] = this.processBenifitsArray(element);
        obj2['benifits_error'] = '';
        obj2['consequences_error'] = '';
        obj2['business_continuity_strategy_finance_id_error'] = '';
        obj2['expense_error'] = '';
        obj2['supply_chain_error'] = '';
        obj2['score_error'] = '';
        obj2['description_error'] = '';
        obj2['remarks_error'] = '';
        obj2['duration_error'] = '';
        obj2['transportation_and_logistics_error'] = '';
        obj2['information_and_operational_technology_error'] = '';
        obj2['facilities_equipment_error'] = '';
        obj2['buildings_and_utilities_error'] = '';
        obj2['information_and_data_error'] = '';
        obj2['people_error'] = '';
        obj2['skills_error'] = '';
        obj2['resource_requirements_error'] = '';
        obj2['consequences'] = this.processConcequencesArray(element);
        obj2['is_hour'] = element['time'+i] == 2 ? true : null; 
        obj2['is_day'] =  element['time'+i] == 1 ? true : null; 
        obj2['is_day_error'] = '';
        obj2['is_hour_error'] = '';
        obj2['resource_requirements'] = element['resource_requirements' + i];
        object.solutions.push(obj2);
      }
    }

    return object;

  }

  checkSolutionValuePresent(element,i){
    // this.processBenifitsArray(element).length>0 || this.processConcequencesArray(element).length>0 || element['business_continuity_strategy_finance_id'+i] || element['score'+i]
    let objectItemsPresent = false;
    for (const property in element) {
      // console.log(`${property}: ${element[property]}`);
      if(element[property+i]) objectItemsPresent = true;
      if(objectItemsPresent) break;
    }
    if(this.processBenifitsArray(element).length>0 || this.processConcequencesArray(element).length>0 || objectItemsPresent)
      return true;
    else return false;
  }

  processBenifitsArray(element){
    // console.log("elem",element)
    let dummy_array  = []
    element.benifits.forEach(res=>{
      dummy_array.push(res)
    });
    return dummy_array;

  }

  processConcequencesArray(element){
    let dummy_array  = []
    element.consequences.forEach(res=>{
      dummy_array.push(res)
    });
    return dummy_array;
  }

  durationTypeChange(e, data) {
    if (data == 'day') {
      this.is_hour = null;
      this.is_day = true;
    } else {
      this.is_hour = true;
      this.is_day = null;
    }
  }

  processSolutions() {
    var solutionArray = [];
    if (BcmStrategyStore.new_strategy_id == null) {
      this.solutionsArray.forEach(item => {
        var data = {
          "title": item.title,
          "is_new": item.is_new,
          "is_deleted": item.is_deleted,
        }
        solutionArray.push(data);
      })
    } else {
      BcmStrategyStore._singleStrategies?.solutions.forEach(element => {
        var pos = solutionArray.findIndex(e => e.id == element.id)
        if (pos == -1) {
          var data2 = {
            "id": element.id,
            "title": element.title,
            "is_deleted": false
          }
          solutionArray.push(data2);
        }
      })
      this.solutionsArray.forEach(item => {
        var pos = solutionArray.findIndex(e => e.title == item.title)
        if (!item.id && pos == -1) {
          var data3 = {
            "title": item.title,
            "is_deleted": false
          }
          solutionArray.push(data3);
        }
      });
    }
    return solutionArray;
  }

  SaveDataForStrategy() {
    let saveData = {
      solutions: this.processSolutions(),
      risk_ids: this.form.value.risk_ids ? this.form.value.risk_ids : null,
      business_continuity_strategy_type_id: this.form.value.business_continuity_strategy_type_id ? this.form.value.business_continuity_strategy_type_id : null,
      organization_ids: this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids, 'id') : [AuthStore.user?.organization.id],
      division_ids: this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids, 'id') : [AuthStore.user?.division.id],
      department_ids: this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : [AuthStore.user?.department.id],
      section_ids: this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids, 'id') : [AuthStore.user?.section.id],
      sub_section_ids: this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids, 'id') : [AuthStore.user?.sub_section.id],
    }
    return saveData;
  }


  submitStrategy() {
    AppStore.enableLoading();
    this.formErrors = null;
    let save;
    if (this.form.value.id || BcmStrategyStore.new_strategy_id) {
      save = this._bcmStrategiesService.updateBusinessStrategy(this.form.value.id ? this.form.value.id : BcmStrategyStore.new_strategy_id, this.SaveDataForStrategy());
    }
    else {
      save = this._bcmStrategiesService.saveBusinessStrategy(this.SaveDataForStrategy());
    }
    // this.setCustodianTitle();
    save.subscribe(res => {
      BcmStrategyStore.new_strategy_id = res.id;
      this._bcmStrategiesService.getStrategy(BcmStrategyStore.new_strategy_id).subscribe(
        res => {
          BcmStrategyStore.showId = res.solutions[0]?.id;
          this.getResourceRequirement();
          this._utilityService.detectChanges(this._cdr);
        }
      );//calling to geting the solutions by calling details api
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.currentTab = 0;
        this.nextButtonText = "Select & Next";
        this.previousButtonText = "Previous";

        this.setIntialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  submitBsSolutions() {
    AppStore.enableLoading();
    this.formErrors = null;
    let save;
    save = this._bcmStrategiesService.updateBcStrategySolutions(BcmStrategyStore.new_strategy_id, this.processSaveSolutions());
    // this.setCustodianTitle();
    save.subscribe(res => {
      if (res && res.id) {
        this.solution_saved = 1;
        BcmStrategyStore.new_strategy_id = res.id;
        this._bcmStrategiesService.getStrategy(BcmStrategyStore.new_strategy_id).subscribe(
          res => {
            BcmStrategyStore.showId = res.solutions[0]?.id;
            this.getResourceRequirement();
            this._utilityService.detectChanges(this._cdr);
          }
        );//calling to geting the solutions by calling details api
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.solution_saved = 0;
        this.processFormErrors();
        this.currentTab = 1;
        this.nextButtonText = "Select & Next";
        this.previousButtonText = "Previous";

        // this.setIntialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  saveClick() {
    switch (this.currentTab) {
      case 0:
        this.submitStrategy()
        break;
      case 1:
        this.submitBsSolutions()
        break;
    }
  }

  processFormErrors() {
    var errors = this.formErrors;

    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if (key.startsWith('solutions.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          let replaceErrors = errors[key];
          BcmStrategyStore._singleStrategies.solutions[errorPosition][keyValueSplit[2] + '_error'] = replaceErrors.toString().replace('.'+keyValueSplit[1]+'.' ,' ');
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }


  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  addSolution() {
    var pos = this.solutionsArray.findIndex(e => e.title == this.solution)
    if (pos!=-1) {
      this._utilityService.showErrorMessage('error', 'solution_already_added');
    } else {
      var data = {
        "title": this.solution,
        "is_new": true,
        "is_deleted": false,
      }
      this.solutionsArray.push(data);
      this.solution = null;
    }
  }

  scoreClick(value,index){
    BcmStrategyStore._singleStrategies.solutions[index]['score'+index]=value;
    this.clickedScore = value;
  }


  addBenifits(benifits, solution_id,index) {
    var data = {
      "title": benifits,
      "is_new": true,
      "is_deleted": false,
      "solution_id": solution_id
    }
    BcmStrategyStore._singleStrategies.solutions[index]['benifits'].push(data);
    BcmStrategyStore._singleStrategies.solutions[index]['benifits'+index]=''
  }

  addConcequences(consiquences, solution_id, index) {
    var data = {
      "title": consiquences,
      "is_new": true,
      "is_deleted": false,
      "solution_id": solution_id
    }
    BcmStrategyStore._singleStrategies.solutions[index]['consequences'].push(data);
    BcmStrategyStore._singleStrategies.solutions[index]['consequences'+index]=''
  }

  deleteSolution(solution) {
    var index = this.solutionsArray.indexOf(solution);
    this.solutionsArray.splice(index, 1);
    if(BcmStrategyStore._singleStrategies) BcmStrategyStore._singleStrategies.solutions.splice(index, 1);
    this._utilityService.showSuccessMessage('Success!', 'Solution Successfully Deleted');
  }

  // dynamic solutions benifits delete
  deleteSolutionBenifits(index,index2,id) {
    if(BcmStrategyStore.showId==id){
      BcmStrategyStore._singleStrategies.solutions[index]['benifits'].splice(index2,1);
      this._utilityService.showSuccessMessage('Success!', 'Solution Benifit Successfully Deleted');
    }
    
  }
 // dynamic solutions consequences delete
  deleteSolutionConcequences(index,index2,id) {
    if(BcmStrategyStore.showId==id){
      BcmStrategyStore._singleStrategies.solutions[index]['consequences'].splice(index2,1);
      this._utilityService.showSuccessMessage('Success!', 'Solution Consequence Successfully Deleted');
    }
    
  }



  getBcmSolutions(id) {
    BcmStrategyStore.showId = id;
  }

  processSolutionsNgmodel() {

  }

  getResourceRequirement(isIndexData?) {
    if (BcmStrategyStore._singleStrategies?.solutions && BcmStrategyStore._singleStrategies?.solutions?.length != 0) {
      this.saveSolutions = BcmStrategyStore._singleStrategies?.solutions
      BcmStrategyStore.showId = BcmStrategyStore._singleStrategies?.solutions[0].id;
      for (let i = 0; i < BcmStrategyStore._singleStrategies?.solutions.length; i++) {
        const element = BcmStrategyStore._singleStrategies?.solutions[i];
        if(!isIndexData){
          element['skills' + i] = element.skills;
          element['people' + i] = element.people;
          element['information_and_data' + i] = element.information_and_data;
          element['buildings_and_utilities' + i] = element.buildings_and_utilities;
          element['facilities_equipment' + i] = element.facilities_equipment;
          element['information_and_operational_technology' + i] = element.information_and_operational_technology;
          element['transportation_and_logistics' + i] = element.transportation_and_logistics;
          element['supply_chain' + i] = element.supply_chain;
          element['duration' + i] = element.duration;
          element['remarks' + i] = element.remarks;
          element['description' + i] = element.description;
          element['score' + i] = element.score;
          this.clickedScore = element.score;
          element['expense' + i] = element.expense;
          element['business_continuity_strategy_finance_id' + i] = element.business_continuity_strategy_finance_id;
          element['resource_requirements' + i] = element.resource_requirements;
          element['benefits'] = element.benefits
          element['consequences'] = element.consequences;
          element['time'+i] = element.is_hour ? 2 : 1 ;
          this.is_hour = element.is_hour;
          this.is_day = element.is_day;
        }
      }
    }
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  setInitialOrganizationLevels() {
    this.form.patchValue({
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids: AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      section_ids: AuthStore?.user?.section ? [AuthStore?.user?.section] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
      organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : []
    });
    this._utilityService.detectChanges(this._cdr);

  }

  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.cancelEventSubscription.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();
    this.bcmtypeAddEvent.unsubscribe();
    BcmStrategyStore.new_strategy_id = null;
    this.consiquencesArray = [];
    this.benifitsArray = [];
    this.is_day = null;
    this.is_hour = null;
    this.solution_saved = 0
  }
}
