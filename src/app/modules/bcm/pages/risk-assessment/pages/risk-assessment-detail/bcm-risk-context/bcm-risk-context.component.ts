import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { BcmRiskAssessmentService } from 'src/app/core/services/bcm/risk-assessment/bcm-risk-assessment.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { RiskScoreStore } from 'src/app/stores/risk-management/risk-configuration/risk-score.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { Router } from '@angular/router';
import * as htmlToImage from 'html-to-image';
import { BcmRiskMappingStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-mapping.store';

declare var $: any;
@Component({
  selector: 'app-bcm-risk-context',
  templateUrl: './bcm-risk-context.component.html',
  styleUrls: ['./bcm-risk-context.component.scss']
})
export class BcmRiskContextComponent implements OnInit {

  @ViewChild('popup') popup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('matrixForm') matrixForm: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  RiskManagementSettingStore = RiskManagementSettingStore
  BcmRiskAssessmentStore = BcmRiskAssessmentStore
  LikelihoodStore = LikelihoodStore
  RiskScoreStore = RiskScoreStore
  ImpactStore = ImpactStore
  AppStore = AppStore
  reactionDisposer: IReactionDisposer;

  AuthStore = AuthStore;
  deleteEventSubscription: any;
  workflowEventSubscription: any;
  historyEventSubscription: any;
  emptyAnalysis = "analysis_empty_title";
  emptyControlEfficiency = "efficiency_analysis_empty_title";
  emptyBudgetList = "budget_empty_title";
  downloadMessage: string = 'downloading';
  SubmenuItemStore = SubMenuItemStore;
  workflowCommentEventSubscription:any;
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle: ''
  };
  
  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _route:Router,
    private _impactService: ImpactService,
    private _likelihoodService: LikelihoodService,
    private _riskRatingService: RiskRatingService,
    private _riskScoreService: RiskScoreService,
    private _riskSettingsService: RiskManagementSettingsService,
    private _bcmRiskAssessmentService: BcmRiskAssessmentService) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {

      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            BcmRiskAssessmentStore.is_edit = true
            BcmRiskAssessmentStore.is_from_info = true
            BcmRiskAssessmentStore.selectedProcessId = BcmRiskAssessmentStore.bcmRiskDetails?.processes?BcmRiskAssessmentStore.bcmRiskDetails?.processes[0]?.id:null
            this._route.navigateByUrl("/bcm/risk-assessment/edit");
            this._utilityService.detectChanges(this._cdr);
            break;
          case "export_to_excel":
            this.exportRiskContext();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
  
    })
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

  exportRiskContext() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    setTimeout(() => {
      let element: HTMLElement;
      element = document.getElementById("risk-context");
      let pthis = this;
      htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
        .then(function (dataUrl) {
          var reader = new FileReader();
          reader.readAsDataURL(dataUrl);
          reader.onloadend = function () {
            var base64data = reader.result;
            // console.log(base64data);
            pthis.downloadPdf(base64data);
          }
          // SubMenuItemStore.exportClicked = false;
          // pthis.closeLoaderPopUp();
        });
    }, 100);

  }

  downloadPdf(file) {
    this._imageService.getPdf(file).subscribe(res => {
      SubMenuItemStore.exportClicked = false;
      this.closeLoaderPopUp();
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

  pageChange(){
    var subMenuItems = []
    BcmRiskAssessmentStore.detailsLoaded = false
    this._bcmRiskAssessmentService.getItem(BcmRiskAssessmentStore.selectedId).subscribe(res=>{
      if (res['is_analysis_performed'] == 1) {
        this._bcmRiskAssessmentService.getContextChart(BcmRiskAssessmentStore.selectedId).subscribe(res => {
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
          { activityName: null, submenuItem: { type: 'edit_modal' } },
          {activityName: null, submenuItem: {type: 'close', path: "../"}},
        ]
        this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      }
      
      this._utilityService.detectChanges(this._cdr);
    })
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
    SubMenuItemStore.makeEmpty();
    if(this.reactionDisposer) this.reactionDisposer();
  }

}
