import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { IssueMasterStore } from "src/app/stores/masters/organization/issue-master.store";
import { IssueService } from 'src/app/core/services/masters/organization/issue/issue.service';
import { IssuePaginationResponse } from 'src/app/core/models/masters/organization/issue';
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { RiskTypeMasterStore } from 'src/app/stores/masters/risk-management/risk-type-store';
import { RiskTypeService } from 'src/app/core/services/masters/risk-management/risk-type/risk-type.service';
import { RiskSourceMasterStore } from 'src/app/stores/masters/risk-management/risk-source-store';
import { RiskSourcePaginationResponse } from 'src/app/core/models/masters/risk-management/risk-source';
import { RiskSourceService } from 'src/app/core/services/masters/risk-management/risk-source/risk-source.service';
import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { RiskCategoryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-category';
import { RiskSubCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-sub-category-store';
import { RiskSubCategoryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-sub-category';
import { RiskSubCategoryService } from 'src/app/core/services/masters/risk-management/risk-sub-category/risk-sub-category.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImpactAreaStore } from 'src/app/stores/bcm/configuration/impact-area/impact-area-store';
import { ImpactAreaService } from 'src/app/core/services/bcm/impact-area/impact-area.service';
import { ImpactAreaPaginationResponse } from 'src/app/core/models/bcm/impact-area/impact-area';
import { RiskRegisterService } from 'src/app/core/services/event-monitoring/risk-register/risk-register.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IssueListService } from 'src/app/core/services/organization/context/issue-list/issue-list.service';
import { IssueListResponse } from 'src/app/core/models/organization/context/issue-list';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { EventRiskImpactAreaService } from 'src/app/core/services/masters/event-monitoring/event-risk-impact-area/event-risk-impact-area.service';
import { RiskImpactAreaPaginationResponse } from 'src/app/core/models/masters/event-monitoring/event-risk-impact-areas';
import { RiskImpactAreaMasterStore } from 'src/app/stores/masters/event-monitoring/event-risk-impact-areas-store';

declare var $: any;
@Component({
  selector: 'app-add-risk-register',
  templateUrl: './add-risk-register.component.html',
  styleUrls: ['./add-risk-register.component.scss']
})
export class AddRiskRegisterComponent implements OnInit {
  @Input('source') riskRegisterObject: any;
  @ViewChild('issueFormModal') issueFormModal: ElementRef;
  @ViewChild('riskSourceModal') riskSourceModal: ElementRef;
  @ViewChild('riskCategoryFormModal') riskCategoryFormModal: ElementRef;
  @ViewChild('riskSubCategoryModal') riskSubCategoryModal: ElementRef;

  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  riskSourceSubscription: any;
  issueSubscription: any;
  riskCategorySubscription : any;
  subCategorySubscription : any;
  selectedRisk = [];
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  riskSourceObject = {
		component: 'Master',
		values: null,
		type: null
	};

  riskCategoryObject = {
		component: 'Master',
		values: null,
		type: null
	};

  riskSubCategoryObject = {
		component: 'Master',
		values: null,
		type: null
	};

  AppStore = AppStore;
  AuthStore = AuthStore;
  RisksStore = RisksStore;
  EventsStore = EventsStore;
  IssueMasterStore = IssueMasterStore;
  IssueListStore = IssueListStore;
  MsTypeOrganizationStore = MsTypeStore;
  RiskTypeStore = RiskTypeMasterStore;
  RiskSourceMasterStore = RiskSourceMasterStore;
  RiskCategoryStore = RiskCategoryMasterStore;
  RiskSubCategoryMasterStore = RiskSubCategoryMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ImpactAreaStore = ImpactAreaStore;
  reactionDisposer: IReactionDisposer;
  RiskImpactAreaMasterStore = RiskImpactAreaMasterStore;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventService: EventsService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _issueService: IssueListService,
    private _msTypeOrganizationService: MstypesService,
    private _riskTypeService: RiskTypeService,
    private _riskSourceService: RiskSourceService,
    private _renderer2: Renderer2,
    private _riskCategoryService: RiskCategoryService,
    private _riskSubCategoryService: RiskSubCategoryService,
    private _impactAreaService: EventRiskImpactAreaService,
	private _riskRegisterService:RiskRegisterService,
	private _issueListService: IssueListService,
    ){ }

  ngOnInit(): void {
	console.log(this.IssueListStore.issueListDetails);
	
    this.form = this._formBuilder.group({
      id: [null],
      impact_area_ids: '',
	  risk_owner_id: [null],
      risk_title: [null,[Validators.required]],
      risk_description: '',
	  division_ids: [[]],
      risk_type_ids: [[]],
      risk_source_ids: [[]],
    });
    if(this.riskRegisterObject.type=='Edit'){
      this.setFormValues();
    }
    this.riskSourceSubscription = this._eventEmitterService.riskSource.subscribe(item => {
			this.closeRiskSourceModal();
		})

		
  }


  getEventList() {
    this._eventService.getItemsAll().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }



  getRiskType(fetch: boolean = false) {
		this._riskTypeService.getItems(fetch).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

  searchRiskType(e) {
		this._riskTypeService.getItems(false, 'q=' + e.term).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

  getImpactArea() {
		this._impactAreaService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}


	searchImpactArea(e, patchValue: boolean = false) {
		this._impactAreaService.getItems(false, '&q=' + e.term).subscribe((res: RiskImpactAreaPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						let impact_areas = this.form.value.impact_area_ids ? this.form.value.impact_area_ids : [];
						impact_areas.push(i);
						this.form.patchValue({ impact_area_ids: impact_areas });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

  getRiskSource() {
		this._riskSourceService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}


	searchRiskSource(e, patchValue: boolean = false) {
		this._riskSourceService.getItems(false, '&q=' + e.term).subscribe((res: RiskSourcePaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						let risk_sources = this.form.value.risk_source_ids ? this.form.value.risk_source_ids : [];
						risk_sources.push(i);
						this.form.patchValue({ risk_source_ids: risk_sources });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

  addRiskSource() {
		this.riskSourceObject.type = 'Add';
		this.riskSourceObject.values = null; 
		this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.riskSourceModal.nativeElement, 'show');
		this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	closeRiskSourceModal() {
		if (RiskSourceMasterStore.lastInsertedId) {
			this.searchRiskSource({ term: RiskSourceMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.riskSourceObject.type = null;
			this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.riskSourceModal.nativeElement, 'show');
			this._renderer2.setStyle(this.riskSourceModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}



  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  cancel() {
    this.closeFormModal('cancel');
  }

  closeFormModal(type) {
    AppStore.disableLoading();
    this._eventEmitterService.dismissCommonModal(type);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  processSaveData() {}

  setFormValues() {
	if (this.riskRegisterObject.values) {

		console.log(this.riskRegisterObject.values)
		this.form.patchValue({
			id:this.riskRegisterObject.values.id,
			impact_area_ids: this.riskRegisterObject.values.impact_area_ids, 
			risk_owner_id: this.riskRegisterObject.values.risk_owner_id,
			risk_title: this.riskRegisterObject.values.risk_title,
			risk_description: this.riskRegisterObject.values.risk_description,
			division_ids: this.riskRegisterObject.values.division_ids,
			risk_type_ids: this.riskRegisterObject.values.risk_type_ids,
			risk_source_ids: this.riskRegisterObject.values.risk_source_ids,
			risk_category_id: this.riskRegisterObject.values.risk_category_id,
			risk_sub_category_id:this.riskRegisterObject.values.risk_sub_category_id
		})

		this.getEventList();
		this._utilityService.detectChanges(this._cdr);

		
  
	  }
  }
  

  save(close: boolean = false) {

		let save;
		AppStore.enableLoading();
		if (this.riskRegisterObject.type == "Edit") {
			let id = this.riskRegisterObject.values.id
			save = this._riskRegisterService.updateItem(this.getSaveData(), id);
		  } else {
			save = this._riskRegisterService.saveItem(this.getSaveData());
		  }

  
		save.subscribe(res => {
		  AppStore.disableLoading();
		  this.resetForm();
		  if (close) this.cancel();
		  this._utilityService.detectChanges(this._cdr);
		//   if (close) this.closeFormModal();
		}, (err: HttpErrorResponse) => {
		  AppStore.disableLoading();
		  this._utilityService.detectChanges(this._cdr);
		  if (err.status == 422) {
			this.formErrors = err.error.errors;
			this._utilityService.detectChanges(this._cdr);
		  }
		})
		

  }

  

  getSaveData() {
	let saveData = {
		event_id: EventsStore.selectedEventId,
		organization_issue_ids:this.form.value?.organization_issue_ids ? this.form.value?.organization_issue_ids : [2],
		title: this.form.value?.risk_title ? this.form.value.risk_title : null,
		risk_impact_area_ids:this.form.value.impact_area_ids ? this._helperService.getArrayProcessed(this.form.value.impact_area_ids, 'id') : [],
		risk_type_ids:this.form.value.risk_type_ids ? this.form.value.risk_type_ids : [],
		risk_source_ids:this.form.value.risk_source_ids ? this._helperService.getArrayProcessed(this.form.value.risk_source_ids, 'id') : []
	}
	

	return saveData;
  }

}