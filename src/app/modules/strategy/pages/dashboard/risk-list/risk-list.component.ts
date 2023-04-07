import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ActivatedRoute, Router } from '@angular/router';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';
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
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';

declare var $: any;

@Component({
  selector: 'app-risk-list',
  templateUrl: './risk-list.component.html',
  styleUrls: ['./risk-list.component.scss']
})
export class RiskListComponent implements OnInit {

	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navigationBar') navigationBar: ElementRef;
	@ViewChild('deletePopup') deletePopup: ElementRef;
	@ViewChild('exportFormModal') exportFormModal: ElementRef;

	SubMenuItemStore = SubMenuItemStore;
	reactionDisposer: IReactionDisposer;
	RisksStore = RisksStore;
	RiskDashboardStore = RiskDashboardStore;
	OrganizationModulesStore = OrganizationModulesStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

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
	riskSelected = false;

	status_id:any;
	constructor(private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _router: Router,
		private _route : ActivatedRoute,
		private _risksService: RisksService,
		private _eventEmitterService: EventEmitterService,
		private _renderer2: Renderer2,
		private _humanCapitalService: HumanCapitalService,
		private _imageService: ImageServiceService,
		private _rightSidebarFilterService: RightSidebarFilterService
	) {
		// this.status_id =  this._route.snapshot.paramMap.get('type')
		// console.log('type',this.status_id)
	 }


	ngOnInit(): void {
		RightSidebarLayoutStore.showFilter = true;
		RisksStore.corporate = false;
		RisksStore.unsetIndiviudalRiskDetails();

		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
			this.RisksStore.loaded = false;
			this.pageChange(1);
		})

		this.reactionDisposer = autorun(() => {

				var subMenuItems = [
					{ activityName: 'RISK_LIST', submenuItem: { type: 'search' } },
					{activityName: null, submenuItem: {type: 'refresh'}},
					// { activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
					// { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
					// { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
					// { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_with_filter' } },
					// { activityName: 'IMPORT_RISK', submenuItem: { type: 'import' } },
        {activityName:null, submenuItem: { type: 'close', path: this.closePath() }},

				]

			if (RisksStore.is_registered == true) {
				NoDataItemStore.setNoDataItems({title:"", subtitle: "common_nodata_title" });

			}
			else
				NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_risk' });

			if (NoDataItemStore.clikedNoDataItem) {
				this.addNewRisk();
				NoDataItemStore.unSetClickedNoDataItem();
			}

			this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {

					case "search":
						RisksStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						break;
					
					case "refresh":
						SubMenuItemStore.searchText = '';
						RisksStore.searchText = '';
						RisksStore.loaded = false;
						this.pageChange(1);
						break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
			if (ImportItemStore.importClicked) {
				ImportItemStore.importClicked = false;
				this._risksService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
		if (newPage) RisksStore.setCurrentPage(newPage);
		var additionalParams = ''
		switch(StrategyDaashboardStore.riskStatusId){
			case 'risk':
			additionalParams = 'strategic_objective_ids='+StrategyDaashboardStore.objectiveId;	
			break;
			case '1':
			additionalParams = 'strategic_objective_ids='+StrategyDaashboardStore.objectiveId+'&risk_status_ids=1';	
			break;
			case '2':
			additionalParams = 'strategic_objective_ids='+StrategyDaashboardStore.objectiveId+'risk_status_ids=2';	
			break;
			case '3':
			additionalParams = 'strategic_objective_ids='+StrategyDaashboardStore.objectiveId+'residual_risk_rating_ids =3';	
			break;
			case '4':
			additionalParams = 'strategic_objective_ids='+StrategyDaashboardStore.objectiveId+'residual_risk_rating_ids =4';	
			break;
			case '5':
			additionalParams = 'strategic_objective_ids='+StrategyDaashboardStore.objectiveId+'residual_risk_rating_ids =5';	
			break;

		}
		// if (RiskDashboardStore.riskDashboardParam) {
		// 	RisksStore.is_registered=true;
		// 	additionalParams = RiskDashboardStore.riskDashboardParam;
		// }

		// if (additionalParams){

		// }
		// else additionalParams = 'is_functional=true';


		this._risksService.getItems(false, additionalParams ? additionalParams : '').subscribe(res => {
			// RiskDashboardStore.riskDashboardParam=null;
			this._utilityService.detectChanges(this._cdr);
		})

	}
  

	setRiskSort(type, callList: boolean = true) {
		this._risksService.sortRiskList(type, callList);
	}


	// editRisk(id) {
	// 	RisksStore.setRiskId(id);
	// 	RisksStore.editFlag = true;
	// 	this._router.navigateByUrl('risk-management/risks/edit-risk');
	// }

	createImagePreview(type, token) {
		return this._humanCapitalService.getThumbnailPreview(type, token);
	}

	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	openExportModal() {
		$(this.exportFormModal.nativeElement).modal('show');
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

			this._risksService.delete(this.deleteObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
					if (RisksStore.currentPage > 1) {
						RisksStore.currentPage = Math.ceil(RisksStore.totalItems / 15);
						this.pageChange(RisksStore.currentPage);
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
		RisksStore.setCurrentPage(1);
		this._risksService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
	}

	openFormModal() {

		this._router.navigateByUrl('risk-management/risks/add-risk');

	}

	getDetails(id) {
		RisksStore.setRiskId(id);
		RisksStore.componentFrom = 'strategy_risk';
		this._router.navigateByUrl('risk-management/risks/'+ id+'/risk-journey');

	}
	closePath() {
		return "/strategy-management/dashboard"
	}

	ngOnDestroy() {
		if (this.reactionDisposer) this.reactionDisposer();
		NoDataItemStore.unsetNoDataItems();
		SubMenuItemStore.makeEmpty();
		window.removeEventListener('scroll', this.scrollEvent);
		this.deleteEventSubscription.unsubscribe();
		this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
		RightSidebarLayoutStore.showFilter = false;
		// RisksStore.setRiskStatus(null)
		RisksStore.loaded = false;
		RiskDashboardStore.unsetRiskStatus()
		RiskDashboardStore.unsetRiskDashboardParam()
		RisksStore.unsetRiskDetails();
		RisksStore.searchText = null;
		SubMenuItemStore.searchText = '';
	}

}
