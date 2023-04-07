import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { Router } from '@angular/router';
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
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';


declare var $: any;
@Component({
  selector: 'app-corporate-risks',
  templateUrl: './corporate-risks.component.html',
  styleUrls: ['./corporate-risks.component.scss']
})
export class CorporateRisksComponent implements OnInit {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('exportFormModal') exportFormModal: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  RisksStore = RisksStore;
  RiskDashboardStore = RiskDashboardStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;

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
  statementValues = ['reference_code', 'risk_id', 'risk', 'departments', 'divisions', 'risk_category'];
  inherentValues = ['inherent_risk_likelihood', 'inherent_risk_impact', 'inherent_risk_score', 'inherent_risk_rating'];
  residualValues = ['residual_risk_likelihood', 'residual_risk_impact', 'residual_risk_score', 'residual_risk_rating',];
  otherValues = ['risk_types', 'risk_sources', 'risk_owner', 'risk_observation', 'risk_impacts', 'risk_causes', 'last_review_note', 'risk_treatment_strategy', 'status'];

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _risksService: RisksService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }


  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    RisksStore.corporate = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.RisksStore.loaded = false;
      this.pageChange();
    })
    this.selectAll(null, null);

    this.reactionDisposer = autorun(() => {

      if (this.riskSelected) {
        var subMenuItems = [
          { activityName: null, submenuItem: { type: 'functional' } },
          { activityName: 'RISK_LIST', submenuItem: { type: 'search' } },
          {activityName: null, submenuItem: {type: 'refresh'}},
          { activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
          { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
          { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
          { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_with_filter' } },
          { activityName: 'IMPORT_CORPORATE_RISK', submenuItem: { type: 'import' } },

        ]
      }
      else {
        var subMenuItems = [
          { activityName: 'RISK_LIST', submenuItem: { type: 'search' } },
          {activityName: null, submenuItem: {type: 'refresh'}},
          { activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
          { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
          { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
          { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_with_filter' } },
          { activityName: 'IMPORT_CORPORATE_RISK', submenuItem: { type: 'import' } },

        ]
      }

      if(RisksStore.is_registered)
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
      else
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_corporate_risk' });


      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewRisk();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              RisksStore.riskId = null;
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;

          case 'corporate':
            this.makeCorporate();
            break;

          case 'functional':
            this.makeFunctional();
            break;

          case "template":
            this._risksService.generateTemplate();
            break;
          case "export_with_filter":
            this.openExportModal();
            break;
          case "export_to_excel":
            this._risksService.exportWithTemplate();
            break;
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
          case "import":
            ImportItemStore.setTitle('import_risk_corporate');
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
        this._risksService.importCorporateData(ImportItemStore.getFileDetails).subscribe(res => {
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
    for (let i of RisksStore.riskDetails) {
      if (i['selected'] && i['selected'] == true) {
        riskArray.push(i.id);
      }
    }
    this._risksService.makeCorporate({ 'risk_ids': riskArray }).subscribe(res => {
      riskArray = [];
      this.pageChange(1);
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  makeFunctional() {
    AppStore.enableLoading();
    let riskArray = [];
    for (let i of RisksStore.riskDetails) {
      if (i['selected'] && i['selected'] == true) {
        riskArray.push(i.id);
      }
    }
    this._risksService.makeFunctional({ 'risk_ids': riskArray }).subscribe(res => {
      riskArray = [];
      this.pageChange(1)
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setSelectedRisk(index, event) {
    if (event.target.checked) {
      RisksStore.riskDetails[index]['selected'] = true;
      this.riskSelected = true



      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'functional' } },
        { activityName: 'RISK_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'IMPORT_CORPORATE_RISK', submenuItem: { type: 'import' } },

      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);

    }

    else {
      let count = 0
      RisksStore.riskDetails[index]['selected'] = false;
      this.allRiskSelected = false;
      for (let j of RisksStore.riskDetails) {
        if (j['selected'] && j['selected'] == true) {
          count++;

        }
      }
      if (count == 0) {
        var subMenuItems = [

          { activityName: 'RISK_LIST', submenuItem: { type: 'search' } },
          { activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
          { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
          { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
          { activityName: 'IMPORT_CORPORATE_RISK', submenuItem: { type: 'import' } },

        ]
        this._helperService.checkSubMenuItemPermissions(900, subMenuItems);

      }


    }

  }

  selectAllRisk(event) {
    this.allRiskSelected = event.target.checked;
    if (event.target.checked) {
      this.riskSelected = true;


      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'functional' } },
        { activityName: 'RISK_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'IMPORT_CORPORATE_RISK', submenuItem: { type: 'import' } },

      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);

      for (let i of RisksStore.riskDetails) {
        i['selected'] = true;
      }
    }
    else {
      for (let i of RisksStore.riskDetails) {
        i['selected'] = false;
        subMenuItems = [
          { activityName: 'RISK_LIST', submenuItem: { type: 'search' } },
          { activityName: 'CREATE_RISK', submenuItem: { type: 'new_modal' } },
          { activityName: 'GENERATE_RISK_TEMPLATE', submenuItem: { type: 'template' } },
          { activityName: 'EXPORT_RISK', submenuItem: { type: 'export_to_excel' } },
          { activityName: 'IMPORT_CORPORATE_RISK', submenuItem: { type: 'import' } },
        ]
        this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      }
    }

  }

  
  setIdentified(identified){
    if(identified==true)
    RisksStore.is_registered=false;
    else
    RisksStore.is_registered=true;

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
    if (newPage) RisksStore.setCurrentPage(newPage);
    var additionalParams = ''
    if (RiskDashboardStore.riskDashboardParam) {
      additionalParams = RiskDashboardStore.riskDashboardParam
    }


    this._risksService.getItems(false, additionalParams ? additionalParams : '').subscribe(res => {
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
    this._risksService.sortRiskList(type, callList);
  }


  editRisk(id) {
    RisksStore.setRiskId(id);
    RisksStore.editFlag = true;
    this._router.navigateByUrl('risk-management/risks/edit-risk');
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

    this._risksService.exportToExcel('?fields=' + selectedArray);
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
    this.deleteObject.subtitle = "Are you sure you want to delete this risk?"

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
    // if(RisksStore.corporate == true){
    RisksStore.addCorporate = true;
    // }
    this._router.navigateByUrl('risk-management/corporate-risks/add-risk');

  }

  getDetails(id) {
    RisksStore.setRiskId(id);

    this._router.navigateByUrl('risk-management/corporate-risks/' + id);


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
    // RisksStore.setRiskStatus(null)
    RisksStore.loaded = false;
    RiskDashboardStore.unsetRiskStatus()
    RiskDashboardStore.unsetRiskDashboardParam()
    RisksStore.unsetRiskDetails();
    RisksStore.searchText=null;
		SubMenuItemStore.searchText = '';
  }

}
