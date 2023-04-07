import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BcmRiskAssessmentService } from 'src/app/core/services/bcm/risk-assessment/bcm-risk-assessment.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { RiskScoreStore } from 'src/app/stores/risk-management/risk-configuration/risk-score.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';

declare var $: any;
@Component({
  selector: 'app-bcp-risk-assessment',
  templateUrl: './bcp-risk-assessment.component.html',
  styleUrls: ['./bcp-risk-assessment.component.scss']
})
export class BcpRiskAssessmentComponent implements OnInit {
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('matrixForm') matrixForm: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  
  emptyAnalysis = "analysis_empty_title";
  emptyControlEfficiency = "efficiency_analysis_empty_title";
  emptyBudgetList = "budget_empty_title";
  downloadMessage: string = 'downloading';

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  RiskManagementSettingStore = RiskManagementSettingStore
  BcmRiskAssessmentStore = BcmRiskAssessmentStore
  LikelihoodStore = LikelihoodStore
  RiskScoreStore = RiskScoreStore
  ImpactStore = ImpactStore
  AppStore = AppStore
  AuthStore = AuthStore

  number= 336;

  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _impactService: ImpactService,
    private _likelihoodService: LikelihoodService,
    private _riskRatingService: RiskRatingService,
    private _riskScoreService: RiskScoreService,
    private _riskSettingsService: RiskManagementSettingsService,
    private _bcmRiskAssessmentService: BcmRiskAssessmentService
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this._riskSettingsService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this._impactService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskScoreService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this._likelihoodService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskRatingService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this.pageChange()
  }

  pageChange(){
    var subMenuItems = []
    BcmRiskAssessmentStore.detailsLoaded = false
    this._bcmRiskAssessmentService.getItem(this.number).subscribe(res=>{
      if (res['is_analysis_performed'] == 1) {
        this._bcmRiskAssessmentService.getContextChart(this.number).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
        })
      }
      if(res.risk_status.id==2){
        subMenuItems = []
        subMenuItems = [
          {activityName: null, submenuItem: {type: 'close', path: "../"}},
        ]
        this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      }else{
        subMenuItems = []
        subMenuItems = [
          // { activityName: null, submenuItem: { type: 'edit_modal' } },
          {activityName: null, submenuItem: {type: 'close', path: "../"}},
        ]
        this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      }
      
      this._utilityService.detectChanges(this._cdr);
    })
  }


  closeLoaderPopUp() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  gotoRiskMatrix() {
    $(this.matrixForm.nativeElement).modal('show');
    this._renderer2.setStyle(this.matrixForm.nativeElement, 'display', 'block');
    // this._router.navigateByUrl('/risk-management/risk-matrix');
  }

  closeMatrix() {
    $(this.matrixForm.nativeElement).modal('hide');



    this._renderer2.setStyle(this.matrixForm.nativeElement, 'display', 'none');

    $('.modal-backdrop').remove();
  }

  getArrayFormatedString(type, items, partcipents: boolean = false) {

    if (partcipents) {
      for (let i of items) {
        let string = i.user.first_name + ' ' + i.user.last_name;
        i.name = string;
      }
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  getCreatedByPopupDetails(users, created?: string,type:any='') {
    let userDetails: any = {};
    if(type=='user'){
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
    if(type=='default'){
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

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    // SubMenuItemStore.makeEmpty();
    // if(this.reactionDisposer) this.reactionDisposer();
  }

}
