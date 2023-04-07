import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ControlEfficiencyMeasuresService } from 'src/app/core/services/masters/risk-management/control-efficiency-measures/control-efficiency-measures.service';
import { RiskMatrixRatingLevelsService } from 'src/app/core/services/masters/risk-management/risk-matrix-rating-levels/risk-matrix-rating-levels.service';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { RiskAssessmentService } from 'src/app/core/services/risk-management/risks/risk-assessment/risk-assessment.service';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ControlEfficiencyMeasuresMasterStore } from 'src/app/stores/masters/risk-management/control-efficiency-measures-store';
import { RiskMatrixRatingLevelsMasterStore } from 'src/app/stores/masters/risk-management/risk-matrix-rating-levels-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { RiskAssessmentStore } from 'src/app/stores/risk-management/risks/risk-assessment.store';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { RiskScoreStore } from 'src/app/stores/risk-management/risk-configuration/risk-score.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import * as htmlToImage from 'html-to-image';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RiskImpactGuidelineService } from 'src/app/core/services/masters/risk-management/risk-impact-guideline/risk-impact-guideline.service';
import { RiskImpactGuidelineMasterStore } from 'src/app/stores/masters/risk-management/risk-impact-guideline-store';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;
@Component({
  selector: 'app-risk-assessment',
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.scss']
})
export class RiskAssessmentComponent implements OnInit {
  @ViewChild('performPopup') performPopup: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @ViewChild('assessment') assessment: ElementRef;
  @ViewChild('content') content: ElementRef;
  currentTab = 0;
  nextButtonText = 'Next';
  previousButtonText = "Previous";
  AppStore = AppStore;
  RisksStore = RisksStore;
  emptyMessage="no_data_found";
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationGeneral
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

  cancelObject = {
    type: '',
    title: '',
    subtitle: ''
  };
  formErrors = null;
  ImpactStore = ImpactStore;
  LikelihoodStore = LikelihoodStore;
  RiskScoreStore = RiskScoreStore;
  activeImpact = null;
  activeLikelihood = null;
  impactJustification = '';
  likelihoodJustification = '';
  ControlEfficiencyMeasuresMasterStore = ControlEfficiencyMeasuresMasterStore;
  activeControlEfficiency = [];
  activeProcess = null;
  RiskAssessmentStore = RiskAssessmentStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  RiskMatrixRatingLevelsMasterStore = RiskMatrixRatingLevelsMasterStore;
  reactionDisposer: IReactionDisposer;
  ratingLevel;
  cancelEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  SubMenuItemStore = SubMenuItemStore;
  RiskManagementSettingStore = RiskManagementSettingStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationModulesStore = OrganizationModulesStore;
  AuthStore = AuthStore;
  openAll=false;
 
  processEmptyList = "process_empty_list_message";
  controlEmptyList = "control_empty_list_message";
  downloadMessage: string = 'downloading';
  ownerDetailObject = {
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
  filterdOptions = [];

  public rm_risk_description:string='rm_risk_description'	
	public risk_causes:string='risk_causes'

  closeRiskList = '/risk-management/risks';
  closeCorporateRisks = '/risk-management/corporate-risks';

  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _impactService: ImpactService,
    private _likelihoodService: LikelihoodService,
    private _riskScoreService: RiskScoreService,
    private _controlEfficiencyMeasureService: ControlEfficiencyMeasuresService,
    private _riskAssessmentService: RiskAssessmentService,
    private _riskRatingService: RiskRatingService,
    private _riskMatrixRatingLevelsService: RiskMatrixRatingLevelsService,
    private _renderer2: Renderer2,
    private _riskManagementSettingsService: RiskManagementSettingsService,
    private _riskImpactGuidelineService:RiskImpactGuidelineService,
    private _imageService:ImageServiceService,
    private _riskService: RisksService,) { }

  ngOnInit(): void {
    this.getRiskDetails(RisksStore.riskId)
    if (!RisksStore.individualRiskDetails) {
      this._router.navigateByUrl('/risk-management/risks/' + RisksStore.riskId);
    }
    if(RisksStore.isProperEditUser())
    NoDataItemStore.setNoDataItems({ title: "assessment_empty_message", subtitle: 'assessment_subtitle', buttonText: 'perform_now' });
    else{
      NoDataItemStore.setNoDataItems({ title: "assessment_empty_message"});
   
    }
    this.reactionDisposer = autorun(() => {
      if (RisksStore.componentFrom == 'strategy_risk') {
        this.closeRiskList = '/strategy-management/risk-list';
        this.closeCorporateRisks = '/strategy-management/risk-list';
      }

      if (RisksStore.individualRiskDetails?.is_corporate) {
        if (RisksStore.individualRiskDetails?.is_residual_analysis_performed || RisksStore.individualRiskDetails?.risk_status?.type == 'closed' || !RisksStore.isProperEditUser()) {
          var subMenuItems = [
            // { activityName: null, submenuItem: { type: 'export_to_excel' } },
            { activityName: null, submenuItem: { type: 'close', path: this.closeCorporateRisks } },
          ]
        }
        else {
          subMenuItems = [
            // { activityName: null, submenuItem: { type: 'export_to_excel' } },
            { activityName: null, submenuItem: { type: 'close', path: this.closeCorporateRisks } },
            { activityName: 'CREATE_RISK_ANALYSIS', submenuItem: { type: 'edit_modal', path: null } },

          ]
        }

      }
      else {
        if (RisksStore.individualRiskDetails?.is_residual_analysis_performed || RisksStore.individualRiskDetails?.risk_status?.type == 'closed' || !RisksStore.isProperEditUser()) {
          subMenuItems = [
            // { activityName: null, submenuItem: { type: 'export_to_excel' } },

            { activityName: null, submenuItem: { type: 'close', path: this.closeRiskList } },
          ]
        }
        else {
          subMenuItems = [
            // { activityName: null, submenuItem: { type: 'export_to_excel' } },
            { activityName: null, submenuItem: { type: 'close', path: this.closeRiskList } },
            { activityName: 'CREATE_RISK_ANALYSIS', submenuItem: { type: 'edit_modal', path: null } },
          ]
        }
      }
      // }
      // else{
      //   var subMenuItems = [
      //     {activityName: null, submenuItem: {type: 'new_modal',path:null}},
      //     {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
      //   ]
      // }




      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
      if (NoDataItemStore.clikedNoDataItem) {
        this.openPopup();

        NoDataItemStore.unSetClickedNoDataItem();
      }

      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.openPopup();
              // RisksStore.setEditFlag();
              // this._router.navigateByUrl('/risk-management/risks/edit-risk');
            }, 1000);
            break;
            case "export_to_excel":
            this.exportRiskAssessment();
              break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();


      }


      // NoDataItemStore.setNoDataItems({title: "process_empty_list_message"});
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    AppStore.showDiscussion = false;


    setTimeout(() => {
      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);


    }, 250);


    // <script>
    //step-form-small starts
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $(".next").click(function () {
      if (animating) return false;
      animating = true;

      current_fs = $(this).parent();
      next_fs = $(this).parent().next();

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate({
        opacity: 0
      }, {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale current_fs down to 80%
          scale = 1 - (1 - now) * 0.2;
          //2. bring next_fs from the right(50%)
          left = (now * 50) + "%";
          //3. increase opacity of next_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            'transform': 'scale(' + scale + ')'
          });
          next_fs.css({
            'left': left,
            'opacity': opacity
          });
        },
        duration: 500,
        complete: function () {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeOutQuint'
      });
    });

    $(".previous").click(function () {
      if (animating) return false;
      animating = true;

      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();

      //de-activate current step on progressbar
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

      //show the previous fieldset
      previous_fs.show();
      //hide the current fieldset with style
      current_fs.animate({
        opacity: 0
      }, {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale previous_fs from 80% to 100%
          scale = 0.8 + (1 - now) * 0.2;
          //2. take current_fs to the right(50%) - from 0%
          left = ((1 - now) * 50) + "%";
          //3. increase opacity of previous_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            'left': left
          });
          previous_fs.css({
            'transform': 'scale(' + scale + ')',
            'opacity': opacity
          });
        },
        duration: 500,
        complete: function () {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeOutQuint'
      });
    });

    $(".submit").click(function () {
      return false;
    })

    this._riskManagementSettingsService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    if (RisksStore?.individualRiskDetails?.is_analysis_performed == 1) {



      this._riskAssessmentService.getItem().subscribe(res => {

        this.activeImpact = res['risk_analysis'].impact;
        this.activeLikelihood = res['risk_analysis'].likelihood;
        this.impactJustification = res['risk_analysis'].impact_justification;
        this.likelihoodJustification = res['risk_analysis'].likelihood_justification;
        if (res.risk_analysis?.process_details && res?.risk_analysis?.process_details?.length>0) {
          this.openProcess(res['risk_analysis'].process_details[0]?.id)
        }
        if(res.risk_controls.length>0){
          this.setActiveProcess('control')
        }

        this.setActiveImpact(this.activeImpact)
        this._utilityService.detectChanges(this._cdr);
      })
    }
    // else{

    // }

    // </script>
    ImpactStore.orderBy = "desc";
    LikelihoodStore.orderBy = "desc";
    ImpactStore.orderItem = "score";
    LikelihoodStore.orderItem = "score";
    ControlEfficiencyMeasuresMasterStore.orderItem = "score";
    ControlEfficiencyMeasuresMasterStore.orderBy = "desc";
    this._impactService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.activeImpact == null)
        this.activeImpact = res['data'][0];
        this.setActiveImpact(this.activeImpact)

    })
    this._riskScoreService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this._likelihoodService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.activeLikelihood == null)
        this.activeLikelihood = res['data'][0];
    })

    this._controlEfficiencyMeasureService.getItems().subscribe(res => {
      if (!(RisksStore?.individualRiskDetails?.is_analysis_performed == 1)) {
        for (let i of RisksStore.individualRiskDetails?.processes) {
          if (i.controls?.length > 0) {
            for (let j of i.controls) {
              j['activeControlEfficiency'] = res['data'][0];
            }
          }
        }

        for (let j of RisksStore.individualRiskDetails?.controls) {
          // if (i.controls?.length > 0) {
          // for (let j of i.controls) {
          j['activeControlEfficiency'] = res['data'][0];
          // }
          // }
        }
      }

      this._utilityService.detectChanges(this._cdr);

    })

    this._riskRatingService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.closeCancel(item);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    this.getRiskImpactGuideline()
    this.callLabelFn()
  }

  callLabelFn(){
    if(RisksStore.individualRiskDetails?.risk_classification?.is_risk==1){
      this.rm_risk_description='rm_risk_description'      
      this.risk_causes='risk_causes'
    }else{
      this.rm_risk_description='description'      
      this.risk_causes='causes'
    }
  }

  getRiskImpactGuideline(){
    this._riskImpactGuidelineService.getRiskImpactGuidelines().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskDetails(id) {
    this._riskService.getItem(id).subscribe(res=>{
      // In a real app: dispatch action to load the details here.
   
   this._utilityService.detectChanges(this._cdr);
   })
  }

  
  exportRiskAssessment(){
    this.openAll=true
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    setTimeout(() => {
      let element: HTMLElement;
      element = document.getElementById("assessment");
      let pthis = this;
      htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
      .then(function (dataUrl) {
        var reader = new FileReader();
          reader.readAsDataURL(dataUrl); 
          reader.onloadend = function() {
            var base64data = reader.result;
            // console.log(base64data);
            pthis.downloadPdf(base64data);
          }
        // var link = document.createElement('a');
        // link.download = `risk-analysis.jpeg`;
        // link.href = dataUrl;
        // link.click();
        // SubMenuItemStore.exportClicked = false;
        // pthis.openAll=false;
        // pthis.closeLoaderPopUp();
      });
    }, 500);
}

downloadPdf(file){
  this._imageService.getPdf(file).subscribe(res=>{
    SubMenuItemStore.exportClicked = false;
    this.openAll=false;
    this.closeLoaderPopUp();
  },(error=>{
    SubMenuItemStore.exportClicked = false;
    this.openAll=false;
    this.closeLoaderPopUp();
  }))
}

  closeLoaderPopUp(){
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  changeZIndex() {
    if ($(this.performPopup.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.performPopup.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.performPopup.nativeElement, 'overflow', 'auto');
    }

  }

  setSelectedControl(pIndex,cIndex,event){
   
      RisksStore.individualRiskDetails.processes[pIndex].controls[cIndex]['active']=event.target.checked;
    
  }

  selectedControl(pIndex,cIndex){
    
      if(RisksStore.individualRiskDetails.processes[pIndex].controls[cIndex]['active'] &&RisksStore.individualRiskDetails.processes[pIndex].controls[cIndex]['active']==true){
       
        return true;
      }
      else
      return false;
    
  }

  openPopup() {
      // $('#performPopup').click(function() {
     
  // });
  
    // $("#progressbar li").get(0).click();
    // $("#progressbar li").eq($("fieldset").index(0)).setStyle('opacity','1');
    this._utilityService.detectChanges(this._cdr);
    this.openPerformPopup();
  }

  setActiveImpact(impact) {
    this.activeImpact = impact;
    this.filterdOptions = RiskImpactGuidelineMasterStore?.RiskRatingImpactGuideline.filter(function(item){
      return item.id==impact.id
    });
  }

  setActiveLikelihood(likelihood) {
    this.activeLikelihood = likelihood;
  }

  gotoUser(id) {
    this._router.navigateByUrl('/human-capital/users/' + id);
  }

  getPopupDetails(user) {
    // $('.modal-backdrop').remove();
    this.userDetailObject.first_name = user.first_name;
    this.userDetailObject.last_name = user.last_name;
    this.userDetailObject.designation = user.designation;
    this.userDetailObject.image_token = user.image.token;
    this.userDetailObject.email = user.email;
    this.userDetailObject.mobile = user.mobile;
    this.userDetailObject.id = user.id;
    this.userDetailObject.department = user.department?.title ? user.department?.title : null;
    this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
    return this.userDetailObject;
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

  getFormatedValue(seperator, items) {
    if(items){
      var result = items.map(function (val) {
        return val;
      }).join(seperator);
      return result;
    }
  
  }

  controlLength(process) {
    let count = 0
    if (process && process.length > 0) {
      for (let i of process) {
        if (i.controls && i.controls.length > 0) {
          count++;
          return count;

        }
       
      }
      return count;
    }
    else {
      return count;
    }
  }

  confirmCancel() {
    this.cancelObject.type = 'Cancel';
    this.cancelObject.title = 'Cancel assessment Creation?';
    this.cancelObject.subtitle = 'assessment_cancel_confirmation';
    $(this.cancelPopup.nativeElement).modal('show');
  }
  nextPrev(n) {

    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }


    // Hide the current tab:
    // x[this.currentTab]?.style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      // x[this.currentTab].style.display = "block";
      // this.submitForm();

      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }


  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      // this.getSelectedValues();
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Save";
    } else {
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n)
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  // setControls() {
  //   for (let j of RisksStore.individualRiskDetails.processes) {
  //     for (let i of RiskAssessmentStore.riskAssessmentDetails.risk_processes) {
  //       if (i.controls) {

  //       }
  //     }
  //   }

  // }

  getOwnerPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.ownerDetailObject.first_name = user.first_name;
      this.ownerDetailObject.last_name = user.last_name;
      this.ownerDetailObject.designation = user.designation ? user.designation : user.designation_title;
      this.ownerDetailObject.image_token = user.image?.token ? user.image?.token : user.image_token;
      this.ownerDetailObject.email = user.email;
      this.ownerDetailObject.mobile = user.mobile;
      this.ownerDetailObject.id = user.id;
      this.ownerDetailObject.department = user.department?.title ? user.department?.title : null;
      this.ownerDetailObject.status_id = user.status_id ? user.status_id : 1;
      return this.ownerDetailObject;
    }

  }

  getProcessControlLength(data) {
    let controlCount = 0;
    if (data && data?.length > 0) {
      for (let i of data) {
        if (i.controls?.length > 0) {
          controlCount++;
        }
      }
      if (controlCount == 0)
        return true;
      else
        return false;
    }
    else
      return false;
  }

  getProcessControlLengthByProcess(data) {
    let controlCount = 0;
    if (data && data?.length > 0) {
      for (let i of data) {
        if (i.control) {
          controlCount++;
        }
      }
      if (controlCount == 0)
        return true;
      else
        return false;
    }
    else
      return false;

  }


  setActiveControlEfficiency(measure, processIndex, controlIndex?, control?) {
    if (control) {
      if (RisksStore.individualRiskDetails?.is_analysis_performed) {
        if (RiskAssessmentStore?.riskAssessmentDetails?.risk_controls[controlIndex]?.pivot?.old_control_efficiency_measure_id) {
          RiskAssessmentStore.riskAssessmentDetails.risk_controls[controlIndex].pivot.old_control_efficiency_measure_id = measure.id;
          RiskAssessmentStore.riskAssessmentDetails.risk_controls[controlIndex].pivot.old_control_efficiency_measure_title = measure.control_efficiency_measure_title;
          RiskAssessmentStore.riskAssessmentDetails.risk_controls[controlIndex].pivot.old_control_efficiency_measure_score = measure.score;


        }

      }
      else {
        RisksStore.individualRiskDetails.controls[controlIndex]['activeControlEfficiency'] = measure;
      }
    }
    else {
      if (RisksStore.individualRiskDetails?.is_analysis_performed) {
        if (RiskAssessmentStore?.riskAssessmentDetails?.risk_processes[processIndex]?.controls[controlIndex]?.efficiency) {
          RiskAssessmentStore.riskAssessmentDetails.risk_processes[processIndex].controls[controlIndex].efficiency = measure;
        }

      }
      else {

        RisksStore.individualRiskDetails.processes[processIndex].controls[controlIndex]['activeControlEfficiency'] = measure;


      }
    }


    this._utilityService.detectChanges(this._cdr);
  }

  getScorePercentage(data, control?) {
    let scoreSum = 0;
    let count = 0;
    if (control) {
      if (data.length > 0) {
        for (let i of data) {
          
          count++;
          if (i.pivot?.old_control_efficiency_measure_score) {
            scoreSum = scoreSum + i.pivot?.old_control_efficiency_measure_score;
          }
          else {
            scoreSum = scoreSum + i.activeControlEfficiency?.score;
          }
        }
        return Math.round(scoreSum / count);
      }
      else
        return 0;

    }
    else {
      
      if (data.controls?.length > 0) {
        for (let i of data.controls) {
          if((i.active && i.active==true) || RisksStore.individualRiskDetails?.is_analysis_performed ){
            count++;
            if (i.efficiency?.score) {
              scoreSum = scoreSum + i.efficiency.score;
            }
            else {
              scoreSum = scoreSum + i.activeControlEfficiency?.score;
            }
          }
         
        }
        return Math.round(scoreSum / count);
      }
      else
        return 0;

    }

  }

  setActiveProcess(id) {
    if (this.activeProcess == id) {
      this.activeProcess = null;
    }
    else
      this.activeProcess = id;
  }

  openProcess(id) {

    this._riskAssessmentService.getItemByProcess(id).subscribe(res => {

      this.setActiveProcess(id);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  submitAssessment() {
    AppStore.enableLoading();
    this.formErrors = null;
    let saveData = {
      risk_matrix_impact_id: this.activeImpact.id,
      risk_matrix_likelihood_id: this.activeLikelihood.id,
      risk_controls: this.getRiskControls(),
      controls: this.getControlArray(),
      impact_justification: this.impactJustification,
      likelihood_justification: this.likelihoodJustification
    }

    this._riskAssessmentService.updateItem(saveData).subscribe(res => {

      AppStore.disableLoading();
      RisksStore.individualRiskDetails.is_analysis_performed = 1;
      this.closePerformPopup();
      this._utilityService.detectChanges(this._cdr);
      // setTimeout(() => {
      // this._router.navigateByUrl('risk-management/risks/' + RisksStore.riskId + '/risk-assessment');
      //}, 100);
    }, (err: HttpErrorResponse) => {
      this.closePerformPopup();
      AppStore.disableLoading();
      if (err.status == 422) {
        this.showTab(1);

        this.formErrors = err.error.errors;

      }
      else if (err.status == 500 || err.status == 403) {
        this.closePerformPopup();

      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  getControlArray() {
    let controlData = [];
    if (RisksStore.individualRiskDetails?.is_analysis_performed) {
      if (RiskAssessmentStore.loaded) {
        for (let i of RiskAssessmentStore.riskAssessmentDetails?.risk_controls) {

          controlData.push({ control_id: i.id, control_efficiency_measure_id: i.pivot?.old_control_efficiency_measure_id })
        }
      }
    }
    else {
      if (RisksStore.individualRiskDetails.controls?.length > 0) {
        for (let i of RisksStore.individualRiskDetails.controls) {
          controlData.push({ control_id: i.id, control_efficiency_measure_id: i['activeControlEfficiency']?.id });
        }
      }

    }
    return controlData;

  }

  getRiskControls() {
    let riskData = []
    if (RisksStore.individualRiskDetails?.is_analysis_performed) {
      if (RiskAssessmentStore.loaded) {


        for (let i of RiskAssessmentStore.riskAssessmentDetails?.risk_processes) {
          if (!i.controls || i.controls?.length == 0) {
            riskData.push({ process_id: i.process.id, control_id: null })
          }
          else {
            for (let j of i.controls) {
              riskData.push({ process_id: i.process.id, control_id: j.control.id, control_efficiency_measure_id: j.efficiency?.id });
            }
          }

        }


      }
    }
    else {
      if (RisksStore.individualRiskDetails.processes.length > 0) {
        for (let i of RisksStore.individualRiskDetails.processes) {
          if (!i.controls || i.controls?.length == 0) {
            riskData.push({ process_id: i.id, control_id: null })
          }
          else {
            let count=0;
            for (let j of i.controls) {
              if(j['active'] && j['active']==true){
                count++;
              riskData.push({ process_id: i.id, control_id: j.id, control_efficiency_measure_id: j['activeControlEfficiency']?.id });
              }
            }
            if(count==0){
              riskData.push({ process_id: i.id, control_id: null, control_efficiency_measure_id:null});
            
            }
          }

        }
      }


    }

    return riskData;
  }

  getRiskClass(type) {
    // let classType = null;
    // ({{?activeImpact.score+activeLikelihood.score:RisksStore.calculationMethod?.is_multiplication?activeImpact.score*activeLikelihood.score:RisksStore.calculationMethod?.is_substraction?activeImpact.score>activeLikelihood.score?activeImpact.score-activeLikelihood.score:activeLikelihood.score-activeImpact.score:activeLikelihood.score>activeImpact.score?activeLikelihood.score/activeImpact.score:activeImpact.score/activeLikelihood.score}})
                                                          
    let totalScore=0;
    if(RisksStore.calculationMethod?.is_addition)
    totalScore = this.activeImpact?.score + this.activeLikelihood?.score;
    else if(RisksStore.calculationMethod?.is_multiplication)
    totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
    else if(RisksStore.calculationMethod?.is_division){
      if(this.activeImpact?.score > this.activeLikelihood?.score)
      totalScore = this.activeImpact?.score / this.activeLikelihood?.score;
      else
      totalScore =this.activeLikelihood?.score/this.activeImpact?.score;
    }
    else{
      if(this.activeImpact?.score > this.activeLikelihood?.score)
      totalScore = this.activeImpact?.score - this.activeLikelihood?.score;
      else
      totalScore =this.activeLikelihood?.score-this.activeImpact?.score;
    }

   
    // if(RisksStore.calculationMethod?.is_addition)
    // totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
    for (let rating of RiskRatingMasterStore.allItems) {
      var pos = rating.risk_rating_values?.findIndex(e => e == totalScore);
      if (pos != -1) {
        if (type)
          return rating.title;
        else
          return rating.label;
      }
      // if (totalScore >= rating.score_from && totalScore <= rating.score_to) {
      //   if (type)
      //     return rating.title;
      //   else
      //     return rating.label
      // }
    }
  }

  openPerformPopup() {

    this.getRiskImpactGuideline();
    this._renderer2.setStyle(this.performPopup.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.performPopup.nativeElement, 'overflow', 'auto');

    $(this.performPopup.nativeElement).modal('show');
    NoDataItemStore.unsetNoDataItems();
    setTimeout(() => {
      NoDataItemStore.setNoDataItems({ title: "control_empty_message" });
      this._utilityService.detectChanges(this._cdr);
    }, 250);

  }

  closePerformPopup() {

    // location.reload();
    // $("#progressbar li").eq($("fieldset").index(2)).removeClass("active");
    // $("#progressbar li").eq($("fieldset").index(3)).removeClass("active");
    // $("#progressbar li").eq($("fieldset").index(4)).removeClass("active");
    // $("#progressbar li").eq($("fieldset").index(0)).addClass("active");

    setTimeout(() => {
      $(this.performPopup.nativeElement).modal('hide');
      this._renderer2.setStyle(this.performPopup.nativeElement, 'z-index', 0);
      this._renderer2.setStyle(this.performPopup.nativeElement, 'overflow', 'none');
    }, 100);

  }

  clearCancelObject() {

    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';

  }
  closeCancel(status) {
    $(this.cancelPopup.nativeElement).modal('hide');
    if (status) {
      AppStore.disableLoading();
      this.clearCancelObject();
      NoDataItemStore.unsetNoDataItems();
      NoDataItemStore.setNoDataItems({ title: "assessment_empty_message", subtitle: 'assessment_subtitle', buttonText: 'perform_now' });
      this._utilityService.detectChanges(this._cdr);
      this.closePerformPopup();

    }
    else {
      this.clearCancelObject();
    }
    // setTimeout(() => {

    // }, 250);
  }

  // confirmCancel() {
  //   this.cancelObject.type = 'Cancel';
  //   this.cancelObject.title = 'Cancel Risk Assessment?';
  //   this.cancelObject.subtitle = 'Are you sure you want to cancel?';
  //   $(this.cancelPopup.nativeElement).modal('show');
  // }


  getScoreClass(rating) {
    if(rating.risk_rating_values){
      let classType = null;
                                                             
    let totalScore=0;
    if(RisksStore.calculationMethod?.is_addition)
    totalScore = this.activeImpact?.score + this.activeLikelihood?.score;
    else if(RisksStore.calculationMethod?.is_multiplication)
    totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
    else if(RisksStore.calculationMethod?.is_division){
      if(this.activeImpact?.score > this.activeLikelihood?.score)
      totalScore = this.activeImpact?.score / this.activeLikelihood?.score;
      else
      totalScore =this.activeLikelihood?.score/this.activeImpact?.score;
    }
    else{
      if(this.activeImpact?.score > this.activeLikelihood?.score)
      totalScore = this.activeImpact?.score - this.activeLikelihood?.score;
      else
      totalScore =this.activeLikelihood?.score-this.activeImpact?.score;
    }

      // let totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
      var pos = rating.risk_rating_values?.findIndex(e => e == totalScore);
      if (pos != -1) {
        return rating.label
      }
    }
    else return '';

    // if (totalScore >= rating.score_from && totalScore <= rating.score_to && rating.id == 4) {
    //   classType = 'low';
    // }
    // else if (totalScore >= rating.score_from && totalScore <= rating.score_to && rating.id == 3) {
    //   classType = 'medium';
    // }
    // else if (totalScore >= rating.score_from && totalScore <= rating.score_to && rating.id == 2) {
    //   classType = 'high';
    // }
    // else if (totalScore >= rating.score_from && totalScore <= rating.score_to && rating.id == 1) {
    //   classType = 'very-high';
    // }
    // return classType;

  }

  getAnalysisScoreClass(ratingScore) {
    for (let i of RiskRatingMasterStore.allItems) {
      var pos = i.risk_rating_values?.findIndex(e => e == ratingScore)
      if (pos != -1) {
        return i.label;
      }
      // if (ratingScore >= i.score_from && ratingScore <= i.score_to) {
      //   return i.label;
      // }
    }

  }
  getControlEfficiencyAverage() {
    let scoreTotal = 0;
    let count = 0
    if (RisksStore.individualRiskDetails?.is_analysis_performed) {
      if (RiskAssessmentStore.loaded) {

        // if(control){
        for (let i of RiskAssessmentStore.riskAssessmentDetails?.risk_controls) {
          scoreTotal = scoreTotal + i.pivot?.old_control_efficiency_measure_score;
          count++;
        }
        // }
        // else{
        for (let i of RiskAssessmentStore.riskAssessmentDetails?.risk_processes) {
          if (i.controls?.length > 0) {
            for (let j of i.controls) {
              scoreTotal = scoreTotal + j.efficiency.score;
              count++;
            }
          }
        }
      }


      // }
    }
    else {
      // if(control){
      if (RisksStore.individualRiskDetails?.controls) {
        for (let i of RisksStore.individualRiskDetails?.controls) {
          scoreTotal = scoreTotal + i['activeControlEfficiency']?.score;
          count++;
        }
      }
      // }
      // else{
      if (RisksStore.individualRiskDetails?.processes) {
        for (let i of RisksStore.individualRiskDetails?.processes) {
          if (i.controls?.length > 0) {
            for (let j of i.controls) {
              if((j['active'] && j['active']==true)){
              scoreTotal = scoreTotal + j['activeControlEfficiency']?.score;
              count++;
              }
            }
          }

        }
      }
      // }

    }

    return Math.round(scoreTotal / count);
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  ngOnDestroy() {
    this.cancelEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    RiskAssessmentStore.unsetAssessmentDetails();
    SubMenuItemStore.makeEmpty();

  }

}


