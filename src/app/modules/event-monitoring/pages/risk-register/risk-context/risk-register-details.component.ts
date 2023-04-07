import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { RiskRegisterService } from 'src/app/core/services/event-monitoring/risk-register/risk-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskRegisterStore } from 'src/app/stores/event-monitoring/risk-register/risk-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { RiskScoreStore } from 'src/app/stores/risk-management/risk-configuration/risk-score.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
declare var $: any;
@Component({
  selector: 'app-risk-register-details',
  templateUrl: './risk-register-details.component.html',
  styleUrls: ['./risk-register-details.component.scss']
})
export class RiskRegisterDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('matrixForm') matrixForm: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;

  RiskRegisterStore = RiskRegisterStore
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  RiskManagementSettingStore = RiskManagementSettingStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  reactionDisposer: IReactionDisposer;
  emptyAnalysis = "analysis_empty_title";
  emptyBudgetList = "budget_empty_title";
  LikelihoodStore = LikelihoodStore
  RiskScoreStore = RiskScoreStore
  ImpactStore = ImpactStore
  riskRegisterObject = {
    type: null,
    values: null,
  };
  modalEventSubscription: any;
  constructor(
    private _riskRegisterService: RiskRegisterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editRisk(RiskRegisterStore.individualRiskRegisterDetails)
            this._utilityService.detectChanges(this._cdr);
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })



    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
      this.pageChange()
    });
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.pageChange()
  }

  editRisk(data) {
    // event.stopPropagation();
    this.riskRegisterObject.values = {
      id: data?.id,
      event_id: data?.event_id,
      risk_title: data?.risk_title,
      description: data?.description,
      risk_types: data?.risk_types
    };
    this.riskRegisterObject.type = 'Edit';
    this.openFormModal()
    this._utilityService.detectChanges(this._cdr);

  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    setTimeout(() => {
      this.riskRegisterObject.type = null;
      this.riskRegisterObject.values = null;
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  getPopupDetails(user, is_created_by: boolean = false) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title : user.designation ? user.designation : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if (is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  getCreatedByPopupDetails(users, created?: string, type: any = '') {
    let userDetails: any = {};
    if (type == 'user') {
      userDetails['first_name'] = users?.first_name;
      userDetails['last_name'] = users?.last_name;
      userDetails['designation'] = users?.designation;
      userDetails['image_token'] = users?.image?.token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status?.id;
      userDetails['created_at'] = null;
    }
    if (type == 'default') {
      userDetails['first_name'] = users?.created_by.first_name;
      userDetails['last_name'] = users?.created_by.last_name;
      userDetails['designation'] = users?.created_by.designation;
      userDetails['image_token'] = users?.created_by.image.token;
      userDetails['email'] = users?.created_by.email;
      userDetails['mobile'] = users?.created_by.mobile;
      userDetails['id'] = users?.created_by.id;
      userDetails['department'] = users?.created_by.department;
      userDetails['status_id'] = users?.created_by.status.id ? users?.created_by.status.id : users?.created_by?.status?.id;
      userDetails['created_at'] = created ? created : null;
    }
    return userDetails;

  }


  gotoRiskMatrix() {
    $(this.matrixForm.nativeElement).modal('show');
    this._renderer2.setStyle(this.matrixForm.nativeElement, 'display', 'block');
    // this._router.navigateByUrl('/risk-management/risk-matrix');
  }

  pageChange() {
    var subMenuItems = []
    RiskRegisterStore.individualLoaded = false
    this._riskRegisterService.getItem(RiskRegisterStore.RiskRegisterId).subscribe(res => {
      if (res['is_analysis_performed'] == 1) {
        this._riskRegisterService.getContextChart(RiskRegisterStore.RiskRegisterId).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        })
      }
      if (res.risk_status.id == 2) {
        subMenuItems = []
        subMenuItems = [
          { activityName: null, submenuItem: { type: 'close', path: "../" } },
        ]
        this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      } else {
        subMenuItems = []
        subMenuItems = [
          { activityName: null, submenuItem: { type: 'edit_modal' } },
          { activityName: null, submenuItem: { type: 'close', path: "../" } },
        ]
        this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      }

      this._utilityService.detectChanges(this._cdr);
    })
  }

  closeMatrix() {
    $(this.matrixForm.nativeElement).modal('hide');
    this._renderer2.setStyle(this.matrixForm.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.modalEventSubscription.unsubscribe();
  }

}

