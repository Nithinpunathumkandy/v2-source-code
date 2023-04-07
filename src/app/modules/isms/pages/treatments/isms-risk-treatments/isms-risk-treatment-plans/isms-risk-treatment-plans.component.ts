import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RiskTreatmentService } from 'src/app/core/services/risk-management/risks/risk-treatment/risk-treatment.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
// import { IsmsRiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';
import { IReactionDisposer, autorun } from 'mobx';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
// import { IsmsRisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
// import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsRiskTreatmentStore } from 'src/app/stores/isms/isms-risks/isms-risk-treatment.store';
import { IsmsRiskTreatmentService } from 'src/app/core/services/isms/isms-risks/isms-risk-treatment/isms-risk-treatment.service';
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';
declare var $: any;


@Component({
  selector: 'app-isms-risk-treatment-plans',
  templateUrl: './isms-risk-treatment-plans.component.html',
  styleUrls: ['./isms-risk-treatment-plans.component.scss']
})
export class IsmsRiskTreatmentPlansComponent implements OnInit {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('exportFormModal') exportFormModal: ElementRef;
  IsmsRiskTreatmentStore = IsmsRiskTreatmentStore;
  SubMenuItemStore = SubMenuItemStore;
  IsmsRisksStore = IsmsRisksStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  selectedFields = [];
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  formErrors: any;
  filterSubscription: Subscription = null;
  allSelected = false;
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
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle: ''
  };
  selectionValues = ['risk_number', 'risk_title','risk_description','reference_code', 'title', 'risk_treatment_action_plan', 'risk_treatment_owner', 'risk_owner', 'budget', 'start_date', 'agreed_date', 'status', 'inherent_risk_rating', 'divisions', 'departments','frequency_of_review','treatment_dependency'];
  constructor(private _riskTreatmentService: IsmsRiskTreatmentService,
    private _utilityService: UtilityService,
    private router: Router,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _risksService: IsmsRisksService) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    RightSidebarLayoutStore.filterPageTag = 'risk_treatment';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'division_ids',
      'department_ids',
      'risk_ids',
      'responsible_user_ids',
      'risk_treatment_status_ids',
      'risk_owner_ids',
      'risk_status_ids',
      'risk_rating_ids',
      'target_date',
      'is_corporate',
      'is_functional'
    ]);
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.IsmsRiskTreatmentStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getItems(1);
    })
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'refresh'}},
        { activityName: 'ISMS_RISK_TREATMENT_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_ISMS_RISK_TREATMENT', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_ISMS_RISK_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_ISMS_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },

      ]
      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "no_risk_treatment_data", subtitle: 'no_risk_treatment_sub_data', buttonText: 'add_risk_treatment' });

      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewRiskTreatment();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              IsmsRisksStore.riskId = null;
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          case "template":
            this._riskTreatmentService.generateTemplate();
            break;
          case "export_to_excel":
            this.openExportModal();
            break;
          case "search":
            IsmsRiskTreatmentStore.searchText = SubMenuItemStore.searchText;
            this.getItems(1);
            break;
          case 'refresh':
            IsmsRiskTreatmentStore.loaded = false;
            this.getItems(1); 
            break
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    // setTimeout(() => {

    //   window.addEventListener('scroll', this.scrollEvent, true);
    //   this._utilityService.detectChanges(this._cdr);

    // }, 250);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.getItems(1);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

  getItems(newPage: number = null) {
    if (newPage) IsmsRiskTreatmentStore.setCurrentPage(newPage);
    this._riskTreatmentService.getItems(false, '', false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  setRiskSort(type, callList: boolean = true) {
    this._riskTreatmentService.sortRiskTreatmentList(type, callList);
  }

  getPopupDetails(index) {
    let details = IsmsRiskTreatmentStore?.riskTreatmentList[index];
    this.userDetailObject.first_name = details.responsible_user_first_name;
    this.userDetailObject.last_name = details.responsible_user_last_name;
    this.userDetailObject.designation = details.responsible_user_designation;
    this.userDetailObject.image_token = details.responsible_user_image_token;
    // this.userDetailObject.email = details.email;
    // this.userDetailObject.mobile = details.mobile;
    // this.userDetailObject.department = details.department ? details.department : null;
    // this.userDetailObject.status_id = details.status_id ? details.status.id : 1;

    return this.userDetailObject;
  }

  getDetails(id, risk_id?) {
    IsmsRiskTreatmentStore.treatment_id = id;
    IsmsRisksStore.riskId = risk_id;
    this._risksService.getItem(risk_id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.router.navigateByUrl('/isms/isms-risk-treatment/' + id);
    })

  }

  getResponsiblePresent(id, index) {
    // this._risksService.getItem(IsmsRiskTreatmentStore.riskTreatmentDetails?.risk_id).subscribe(res=>{
    // var pos = IsmsRiskTreatmentStore.riskTreatmentList[index]?.risk_responsible_user_id?.findIndex(e => e.id == id);
    // if (pos != -1)
    //   return true;
    // else

    if (IsmsRiskTreatmentStore.riskTreatmentList[index]?.risk_owner_id == id)
      return true;
    else
      if (IsmsRiskTreatmentStore.riskTreatmentList[index]?.responsible_user_id == id)
        return true
      else {
        if (IsmsRiskTreatmentStore.riskTreatmentDetails?.created_by?.id == id)
          return true
        else
          return false
      }
    // else {
    //   var pos2 = IsmsRiskTreatmentStore.riskTreatmentList[index]?.watcher_id?.findIndex(v => v.id == id);

    //   if (pos2 != -1) {
    //     return true;
    //   }
    //   else
    //     return false
    // }

    // })


    // else
    //   return false;


  }
  addNewRiskTreatment() {
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    this.IsmsRiskTreatmentStore.isRiskTreatmentPlan = true;

    this.router.navigateByUrl('/isms/isms-risk-treatments/add-isms-risk-treatment-plan');
  }

  // scrollEvent = (event: any): void => {

  //   const number = event.target.documentElement?.scrollTop;
  //   if (number > 50) {
  //     this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
  //     this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
  //   }
  //   else {
  //     this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
  //     this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
  //   }
  // }


  selectAll(event) {
    if (event.target.checked) {
      this.allSelected = true;
      for (let i of this.selectionValues) {
        let pos = this.selectedFields.findIndex(e => e == i);
        if (pos == -1) {
          this.selectedFields.push(i)
        }
      }
    }

    else {
      this.allSelected = false;
      for (let j of this.selectionValues) {
        let pos = this.selectedFields.findIndex(e => e == j);
        if (pos != -1) {
          this.selectedFields.splice(pos, 1);
        }
      }
    }


  }

  convertToNumber(data) {
    return parseInt(data);
  }

  checkSelected(field) {
    var pos = this.selectedFields.findIndex(e => e == field);
    if (pos != -1) {
      return true;
    }
    else
      return false;
  }

  setSelectedField(field, event,) {
    if (event.target.checked) {
      this.selectedFields.push(field);
    }
    else {
      var pos = this.selectedFields.findIndex(e => e == field);
      if (pos != -1) {
        this.selectedFields.splice(pos, 1);
      }
      this.allSelected = false;

    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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

    this._riskTreatmentService.exportToExcel('?fields=' + this.selectedFields);
    setTimeout(() => {

      AppStore.disableLoading();
      $(this.exportFormModal.nativeElement).modal('hide');
    }, 500);
  }


  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  editRisk(id, risk_id) {
    IsmsRisksStore.riskId = risk_id;
    this._riskTreatmentService.getItem(id, '?risk_id=' + risk_id).subscribe(() => {
      IsmsRiskTreatmentStore.setEditFlag();
      this.IsmsRiskTreatmentStore.isRiskTreatmentPlan = true;
      this.router.navigateByUrl('/isms/isms-risk-treatments/edit-isms-risk-treatment-plan');
    })
  }

  // pageChange(newPage: number = null) {
  //   if (newPage) IsmsRisksStore.setCurrentPage(newPage);
  //   this._riskTreatmentService
  //     .getItems(false,null,true)
  //     .subscribe(() =>
  //       setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
  //     );
  // }

  deleteRisk(id, index) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "Are you sure you want to delete this risk treatment?"
    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.position = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';
  }

  delete(status) {
    // this.getItems(IsmsRiskTreatmentStore.currentPage);
    if (status && this.deleteObject.id) {
      this._riskTreatmentService.delete(this.deleteObject.id).subscribe(resp => {

        if (IsmsRiskTreatmentStore.currentPage > 1) {
          IsmsRiskTreatmentStore.currentPage = Math.ceil(IsmsRiskTreatmentStore.totalItems / 15);
          this.getItems(IsmsRiskTreatmentStore.currentPage);
        }
        else
          this.getItems(1);
        this.clearDeleteObject();
      },
        (err: HttpErrorResponse) => {
          
          if (err.status == 422) {

            this._utilityService.showErrorMessage(err.error.message, 'Error :');
          }
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
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
    // window.removeEventListener('scroll',this.scrollEvent);
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    IsmsRiskTreatmentStore.searchText=null;
		SubMenuItemStore.searchText = '';
    IsmsRiskTreatmentStore.unsetTreatmentList();
  }

}
