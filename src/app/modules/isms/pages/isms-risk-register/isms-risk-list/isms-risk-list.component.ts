import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { Router } from '@angular/router';
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
// import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { Subscription } from 'rxjs';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  selector: 'app-isms-risk-list',
  templateUrl: './isms-risk-list.component.html',
  styleUrls: ['./isms-risk-list.component.scss']
})
export class IsmsRiskListComponent implements OnInit {
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navigationBar') navigationBar: ElementRef;
	@ViewChild('deletePopup') deletePopup: ElementRef;
	@ViewChild('exportFormModal') exportFormModal: ElementRef;

	SubMenuItemStore = SubMenuItemStore;
	reactionDisposer: IReactionDisposer;
	IsmsRisksStore = IsmsRisksStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	// RiskDashboardStore = RiskDashboardStore;

	deleteObject = {
		id: null,
		position: null,
		type: '',
		subtitle: ''
	};
	AppStore = AppStore;
	AuthStore = AuthStore;
	deleteEventSubscription: any;
	filterSubscription: Subscription = null;
	statementSelected = false;
	inherentSelected = false;
	residualSelected = false;
	otherSelected = false;
	allRiskSelected = false;
	riskSelected = false;
	selectedFields = [];
	statementValues = ['reference_code', 'risk', 'description', 'departments', 'divisions', 'risk_category'];
	inherentValues = ['inherent_risk_likelihood', 'inherent_risk_impact', 'inherent_risk_score', 'inherent_risk_rating'];
	residualValues = ['residual_risk_likelihood', 'residual_risk_impact', 'residual_risk_score', 'residual_risk_rating',];
	otherValues = ['risk_types', 'risk_sources', 'risk_owner', 'risk_observation','last_review_note', 'risk_treatment_strategy', 'status', 'risk_treatment_status'];


	constructor(private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _router: Router,
		private _ismsRisksService: IsmsRisksService,
		private _eventEmitterService: EventEmitterService,
		private _renderer2: Renderer2,
		private _humanCapitalService: HumanCapitalService,
		private _imageService: ImageServiceService,
		private _rightSidebarFilterService: RightSidebarFilterService
	) { }


	ngOnInit(): void {

		RightSidebarLayoutStore.showFilter = true;
		IsmsRisksStore.corporate = false;
		IsmsRisksStore.unsetIndiviudalRiskDetails();

		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
			this.IsmsRisksStore.loaded = false;
			this.pageChange(1);
		})
		this.selectAll(null, null);

		this.reactionDisposer = autorun(() => {
			if (this.riskSelected) {
				var subMenuItems = [
					{activityName:null, submenuItem: {type: 'refresh'}},
					{ activityName: null, submenuItem: { type: 'corporate' } },
					{ activityName: 'ISMS_RISK_LIST', submenuItem: { type: 'search' } },
					{ activityName: 'CREATE_ISMS_RISK', submenuItem: { type: 'new_modal' } },
					{ activityName: 'GENERATE_ISMS_RISK_TEMPLATE', submenuItem: { type: 'template' } },
					{ activityName: 'EXPORT_ISMS_RISK', submenuItem: { type: 'export_to_excel' } },
					// { activityName: 'EXPORT_ISMS_RISK', submenuItem: { type: 'export_with_filter' } },
					// { activityName: 'IMPORT_RISK', submenuItem: { type: 'import' } },

				]
			}

			else {
				var subMenuItems = [
					{activityName:null, submenuItem: {type: 'refresh'}},
					{ activityName: 'ISMS_RISK_LIST', submenuItem: { type: 'search' } },
					{ activityName: 'CREATE_ISMS_RISK', submenuItem: { type: 'new_modal' } },
					{ activityName: 'GENERATE_ISMS_RISK_TEMPLATE', submenuItem: { type: 'template' } },
					{ activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
					// { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_with_filter' } },
					// { activityName: 'IMPORT_RISK', submenuItem: { type: 'import' } },

				]
			}

			if (IsmsRisksStore.is_registered == true) {
				NoDataItemStore.setNoDataItems({title: "" , subtitle: "common_nodata_title" });

			}
			else
				NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_risk' });

			if (NoDataItemStore.clikedNoDataItem) {
				this.addNewRisk();
				NoDataItemStore.unSetClickedNoDataItem();
			}

			this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "new_modal":
						setTimeout(() => {
							IsmsRisksStore.riskId = null;
							this._utilityService.detectChanges(this._cdr);
							this.openFormModal();
						}, 1000);
						break;

					case 'corporate':
						this.makeCorporate();
						break;
					
					case 'refresh':
						IsmsRisksStore.loaded = false;
						this.pageChange(1); 
						break

					case "template":

						this._ismsRisksService.generateTemplate();
						break;

					case "export_with_filter":
						this.openExportModal();

						break;
					case "export_to_excel":
						this._ismsRisksService.exportWithTemplate();
						break;

					case "search":
						IsmsRisksStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						break;
					case "import":
						ImportItemStore.setTitle('import_risk_register');
						ImportItemStore.setImportFlag(true);
						break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
			if (ImportItemStore.importClicked) {
				ImportItemStore.importClicked = false;
				this._ismsRisksService.importData(ImportItemStore.getFileDetails).subscribe(res => {
					ImportItemStore.unsetFileDetails();
					ImportItemStore.setTitle('');
					ImportItemStore.setImportFlag(false);
					$('.modal-backdrop').remove();
					this._utilityService.detectChanges(this._cdr);
				}, (error) => {
					if (error.status == 422) {
						ImportItemStore.processFormErrors(error.error.errors);
					}
					else if (error.status == 500 || error.status == 403) {
						ImportItemStore.unsetFileDetails();
						ImportItemStore.setImportFlag(false);
						$('.modal-backdrop').remove();
					}
					this._utilityService.detectChanges(this._cdr);
				})
			}
		})
		AppStore.showDiscussion = false;

		setTimeout(() => {

			this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
			window.addEventListener('scroll', this.scrollEvent, true);
			this._utilityService.detectChanges(this._cdr);

		}, 250);
		this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.delete(item);
		})
		SubMenuItemStore.setNoUserTab(true);
		RightSidebarLayoutStore.filterPageTag = 'risk';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
			'organization_ids',
			'division_ids',
			'department_ids',
			'section_ids',
			'sub_section_ids',
			'risk_type_ids',
			// 'stakeholder_ids',
			'risk_classification_ids',
			'risk_category_ids',
			'risk_status_ids',
			'risk_source_ids',
			'risk_control_plan_ids',
			'risk_owner_ids',
			'inherent_risk_score',
			'residual_risk_score',
			'inherent_risk_rating_ids',
			'residual_risk_rating_ids'
		]);

		this.pageChange(1)
	}

	makeCorporate() {
		AppStore.enableLoading();
		let riskArray = [];
		for (let i of IsmsRisksStore.riskDetails) {
			if (i['selected'] && i['selected'] == true) {
				riskArray.push(i.id);
			}
		}
		this._ismsRisksService.makeCorporate({ 'risk_ids': riskArray }).subscribe(res => {
			riskArray = [];
			this.pageChange(1);
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		})
	}

	makeFunctional() {
		AppStore.enableLoading();
		let riskArray = [];
		for (let i of IsmsRisksStore.riskDetails) {
			if (i['selected'] && i['selected'] == true) {
				riskArray.push(i.id);
			}
		}
		this._ismsRisksService.makeFunctional({ 'risk_ids': riskArray }).subscribe(res => {
			riskArray = [];
			this.pageChange(1)
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		})
	}

	setSelectedRisk(index, event) {
		if (event.target.checked) {
			IsmsRisksStore.riskDetails[index]['selected'] = true;
			this.riskSelected = true

			var subMenuItems = [
				{ activityName: null, submenuItem: { type: 'corporate' } },
				{ activityName: 'ISMS_RISK_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
				{ activityName: 'GENERATE_ISMS_RISK_TEMPLATE', submenuItem: { type: 'template' } },
				{ activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
				{ activityName: 'IMPORT_RISK', submenuItem: { type: 'import' } },

			]


			this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);

		}

		else {
			let count = 0
			IsmsRisksStore.riskDetails[index]['selected'] = false;
			this.allRiskSelected = false;
			for (let j of IsmsRisksStore.riskDetails) {
				if (j['selected'] && j['selected'] == true) {
					count++;

				}
			}
			if (count == 0) {
				var subMenuItems = [

					{ activityName: 'ISMS_RISK_LIST', submenuItem: { type: 'search' } },
					{ activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
					{ activityName: 'GENERATE_ISMS_RISK_TEMPLATE', submenuItem: { type: 'template' } },
					{ activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
					{ activityName: 'IMPORT_RISK', submenuItem: { type: 'import' } },

				]
				this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);

			}


		}

	}

	selectAllRisk(event) {
		this.allRiskSelected = event.target.checked;
		if (event.target.checked) {
			this.riskSelected = true;

			var subMenuItems = [
				{ activityName: null, submenuItem: { type: 'corporate' } },
				{ activityName: 'ISMS_RISK_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
				{ activityName: 'GENERATE_ISMS_RISK_TEMPLATE', submenuItem: { type: 'template' } },
				{ activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
				{ activityName: 'IMPORT_RISK', submenuItem: { type: 'import' } },

			]


			this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);

			for (let i of IsmsRisksStore.riskDetails) {
				i['selected'] = true;
			}
		}
		else {
			for (let i of IsmsRisksStore.riskDetails) {
				i['selected'] = false;
				subMenuItems = [
					{ activityName: 'ISMS_RISK_LIST', submenuItem: { type: 'search' } },
					{ activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
					{ activityName: 'GENERATE_ISMS_RISK_TEMPLATE', submenuItem: { type: 'template' } },
					{ activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
					{ activityName: 'IMPORT_RISK', submenuItem: { type: 'import' } },
				]
				this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
			}
		}

	}

	setIdentified(identified) {
		if (identified == true)
			IsmsRisksStore.is_registered = false;
		else
			IsmsRisksStore.is_registered = true;

		this.pageChange(1);
	}



	addNewRisk() {
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
	}

	getArrayFormatedString(type, items, languageSupport?) {
		let item = [];
		if (languageSupport) {
			for (let i of items) {
				if (i.language) {
					item.push(i.language[0]?.pivot);
				}
			}
			items = item;
		}
		return this._helperService.getArraySeperatedString(',', type, items);
	}


	pageChange(newPage: number = null) {
		if (newPage) IsmsRisksStore.setCurrentPage(newPage);
		var additionalParams = ''
		if (IsmsRisksStore.dashboardParameter) {
			additionalParams = IsmsRisksStore.dashboardParameter
		}

		if (additionalParams) additionalParams = additionalParams + '&is_functional=true';
		else additionalParams = 'is_functional=true';

		this._ismsRisksService.getItems(false, additionalParams ? additionalParams : '').subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

	selectAll(type, event) {
		if (type) {
			switch (type) {
				case 'statement':
					if (event.target.checked) {
						this.statementSelected = true;
						for (let i of this.statementValues) {
							let pos = this.selectedFields.findIndex(e => e == i);
							if (pos == -1) {
								this.selectedFields.push(i)
							}
						}
					}

					else {
						this.statementSelected = false;
						for (let j of this.statementValues) {
							let pos = this.selectedFields.findIndex(e => e == j);
							if (pos != -1) {
								this.selectedFields.splice(pos, 1);
							}
						}
					}

					break;
				case 'inherent':
					if (event.target.checked) {
						this.inherentSelected = true;
						for (let i of this.inherentValues) {
							let pos = this.selectedFields.findIndex(e => e == i);
							if (pos == -1) {
								this.selectedFields.push(i)
							}
						}
					}

					else {
						this.inherentSelected = false;
						for (let j of this.inherentValues) {
							let pos = this.selectedFields.findIndex(e => e == j);
							if (pos != -1) {
								this.selectedFields.splice(pos, 1);
							}
						}
					}

					break;
				case 'residual':
					if (event.target.checked) {
						this.residualSelected = true;
						for (let i of this.residualValues) {
							let pos = this.selectedFields.findIndex(e => e == i);
							if (pos == -1) {
								this.selectedFields.push(i)
							}
						}
					}

					else {
						this.residualSelected = false;
						for (let j of this.residualValues) {
							let pos = this.selectedFields.findIndex(e => e == j);
							if (pos != -1) {
								this.selectedFields.splice(pos, 1);
							}
						}
					}

					break;
				case 'other':
					if (event.target.checked) {
						this.otherSelected = true;
						for (let i of this.otherValues) {
							let pos = this.selectedFields.findIndex(e => e == i);
							if (pos == -1) {
								this.selectedFields.push(i)
							}
						}
					}

					else {
						this.otherSelected = false;
						for (let j of this.otherValues) {
							let pos = this.selectedFields.findIndex(e => e == j);
							if (pos != -1) {
								this.selectedFields.splice(pos, 1);
							}
						}
					}

					break;

			}
		}
		else {
			this.statementSelected = true;
			for (let i of this.statementValues) {
				this.selectedFields.push(i)
			}
			this.inherentSelected = true;
			for (let j of this.inherentValues) {
				this.selectedFields.push(j)
			}
			this.residualSelected = true;
			for (let k of this.residualValues) {
				this.selectedFields.push(k)
			}
			this.otherSelected = true;
			for (let l of this.otherValues) {
				this.selectedFields.push(l)
			}
		}

	}

	checkSelected(field) {
		var pos = this.selectedFields.findIndex(e => e == field);
		if (pos != -1) {
			return true;
		}
		else
			return false;
	}

	setSelectedField(field, event, type?) {
		if (event.target.checked) {
			this.selectedFields.push(field);
		}
		else {
			var pos = this.selectedFields.findIndex(e => e == field);
			if (pos != -1) {
				this.selectedFields.splice(pos, 1);
			}
			if (type) {
				switch (type) {
					case 'statement': this.statementSelected = false;
						break;
					case 'inherent': this.inherentSelected = false;
						break;
					case 'residual': this.residualSelected = false;
						break;

				}
			}
			else {
				this.otherSelected = false;
			}
		}
	}

	setRiskSort(type, callList: boolean = true) {
		this._ismsRisksService.sortRiskList(type, callList);
	}


	editRisk(id) {
		IsmsRisksStore.setRiskId(id);
		IsmsRisksStore.editFlag = true;
		this._router.navigateByUrl('isms/isms-risks/edit-risk');
	}

	createImagePreview(type, token) {
		return this._humanCapitalService.getThumbnailPreview(type, token);
	}

	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	openExportModal() {
		$(this.exportFormModal.nativeElement).modal('show');
	}

	closeExportModal() {
		AppStore.disableLoading();
		this.selectedFields = [];
		SubMenuItemStore.exportClicked = false;
		$(this.exportFormModal.nativeElement).modal('hide');
	}

	export() {
		AppStore.enableLoading();
		let selectedArray = [];
		for (let i of this.statementValues) {
			let p = this.selectedFields.findIndex(e => e == i);
			if (p != -1) {
				selectedArray.push(i);
			}
		}

		for (let j of this.inherentValues) {
			let q = this.selectedFields.findIndex(e => e == j);
			if (q != -1) {
				selectedArray.push(j);
			}

		}

		for (let k of this.residualValues) {
			let r = this.selectedFields.findIndex(e => e == k);
			if (r != -1) {
				selectedArray.push(k);
			}

		}

		for (let m of this.otherValues) {
			let s = this.selectedFields.findIndex(e => e == m);
			if (s != -1) {
				selectedArray.push(m);
			}

		}

		this._ismsRisksService.exportToExcel('?fields=' + selectedArray);
		setTimeout(() => {

			AppStore.disableLoading();
			$(this.exportFormModal.nativeElement).modal('hide');
		}, 500);
	}

	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}
	/**
   * Delete the risk
   * @param id -risk id
   */
	delete(status) {
		if (status && this.deleteObject.id) {

			this._ismsRisksService.delete(this.deleteObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
					if (IsmsRisksStore.currentPage > 1) {
						IsmsRisksStore.currentPage = Math.ceil(IsmsRisksStore.totalItems / 15);
						this.pageChange(IsmsRisksStore.currentPage);
					}
				}, 500);
				this.clearDeleteObject();
				// console.log(AssessmentStore.totalItems);

			});
		}
		else {
			this.clearDeleteObject();
		}
		setTimeout(() => {
			$(this.deletePopup.nativeElement).modal('hide');
		}, 250);

	}


	scrollEvent = (event: any): void => {

		const number = event.target.documentElement?.scrollTop;
		if (number > 50) {
			this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
			this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
		}
		else {
			this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
			this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
		}
	}



	deleteRisk(id, position) {
		this.deleteObject.id = id;
		this.deleteObject.position = position;
		this.deleteObject.type = '';
		this.deleteObject.subtitle = "delete_risk_confirmation"

		$(this.deletePopup.nativeElement).modal('show');
	}

	clearDeleteObject() {

		this.deleteObject.id = null;

	}


	searchRiskList() {
		IsmsRisksStore.setCurrentPage(1);
		this._ismsRisksService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
	}

	openFormModal() {

		this._router.navigateByUrl('isms/isms-risks/add-isms-risk');

	}

	getDetails(id) {
		IsmsRisksStore.setRiskId(id);

		this._router.navigateByUrl('isms/isms-risks/' + id);

	}

	//Right left scroll starts
	prev(){
		var container = document.getElementById('container');
		this.sideScroll(container,'left',0,1000,10);
	}

	next(){
		var container = document.getElementById('container');
		this.sideScroll(container,'right',0,1000,10);
	}

	sideScroll(element,direction,speed,distance,step){
		let scrollAmount = 0;
		var slideTimer = setInterval(function(){
			if(direction == 'left'){
				element.scrollLeft -= step;
			} else {
				element.scrollLeft += step;
			}
			scrollAmount += step;
			if(scrollAmount >= distance){
				window.clearInterval(slideTimer);
			}
		}, speed);
	  }
	  //Right left scroll ends

	ngOnDestroy() {
		if (this.reactionDisposer) this.reactionDisposer();
		NoDataItemStore.unsetNoDataItems();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent);
		this.deleteEventSubscription.unsubscribe();
		this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
		RightSidebarLayoutStore.showFilter = false;
		// IsmsRisksStore.setRiskStatus(null)
		IsmsRisksStore.loaded = false;
		// RiskDashboardStore.unsetRiskStatus()
		// RiskDashboardStore.unsetRiskDashboardParam()
		IsmsRisksStore.unsetRiskDetails();
		IsmsRisksStore.searchText = null;
		SubMenuItemStore.searchText = '';
	}

}
