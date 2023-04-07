import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventRiskAssessmentStore } from 'src/app/stores/event-monitoring/event-risk-assessment/event-risk-assesment.store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import * as htmlToImage from 'html-to-image';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import { RiskImpactGuidelineService } from 'src/app/core/services/masters/risk-management/risk-impact-guideline/risk-impact-guideline.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventRiskAssessmentService } from 'src/app/core/services/event-monitoring/event-risk-assessment/event-risk-assessment.service';
import { RiskRegisterStore } from 'src/app/stores/event-monitoring/risk-register/risk-register-store';
import { EventRiskTreatmentStore } from 'src/app/stores/event-monitoring/risk-register/risk-treatment.store';

declare var $: any;

@Component({
  selector: 'app-event-risk-assessment',
  templateUrl: './event-risk-assessment.component.html',
  styleUrls: ['./event-risk-assessment.component.scss']
})
export class EventRiskAssessmentComponent implements OnInit {
  @ViewChild('performPopup') performPopup: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  reactionDisposer: IReactionDisposer;

  EventRiskAssessmentStore = EventRiskAssessmentStore
  RiskRegisterStore = RiskRegisterStore
  RiskRatingMasterStore = RiskRatingMasterStore
  EventRiskTreatmentStore = EventRiskTreatmentStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  riskAssessmentObject = {
    component: 'RA',
    values: null,
    type: null
  };
  openAll=false;
  downloadMessage: string = 'downloading';
  riskAssessmentModalSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _imageService:ImageServiceService,
    private _riskScoreService: RiskScoreService,
    private _riskRatingService: RiskRatingService,
    private _riskImpactGuidelineService:RiskImpactGuidelineService,
    private _eventRiskAssessmentService: EventRiskAssessmentService,
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    NoDataItemStore.setNoDataItems({ title: "assessment_empty_message", subtitle: 'assessment_subtitle', buttonText: 'perform_now' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close', path: "../"}},
      ]
      this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
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
    })
    // this._eventRiskAssessmentService.getItem(EventRiskAssessmentStore.selectedId).subscribe(res=>{
    //   this._utilityService.detectChanges(this._cdr);
    // })
    if (!(EventRiskAssessmentStore.eventRiskDetails) && EventRiskAssessmentStore.selectedId) {

      this._router.navigateByUrl('/event-monitoring/event-risks/' + EventRiskAssessmentStore.selectedId);
    }
    this.riskAssessmentModalSubscription = this._eventEmitterService.eventRiskAssessmentModal.subscribe(item => {
      this.closeFormModal()
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
    this._riskScoreService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskRatingService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this.getAssessment()
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
      });
      this.getAssessment()
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

  getAssessment(newPage: number = null) {
    var subMenuItems
    EventRiskAssessmentStore.assessmentLoaded = false
    this._eventRiskAssessmentService.getRiskAssessment(RiskRegisterStore.RiskRegisterId).subscribe(res=>{
      if(res.risk_analysis&&EventRiskAssessmentStore.eventRiskDetails?.risk_status?.id==2){
        subMenuItems = []
         subMenuItems = [
          // { activityName: null, submenuItem: { type: 'export_to_excel' } },
          {activityName: null, submenuItem: { type: "close", path: '../' }},
        ]
        this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      }else{
        subMenuItems = []
        if(res.risk_analysis){
          subMenuItems = [
            {activityName: null, submenuItem: {type: 'edit_modal'}},
            // { activityName: null, submenuItem: { type: 'export_to_excel' } },
            {activityName: null, submenuItem: { type: "close", path: '../' }},
          ]
        }else{
          subMenuItems = [
            {activityName: null, submenuItem: { type: "close", path: '../' }},
          ]
        }
         
        this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openPopup() {
  this._utilityService.detectChanges(this._cdr);
  this.openPerformPopup();
}

getRiskClass(type,total) {
  // let classType = null;
  // let totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
  for (let rating of RiskRatingMasterStore.allItems) {
    var pos = rating.risk_rating_values?.findIndex(e => e == total);
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
  this.riskAssessmentObject.type = 'Add'
  setTimeout(() => {
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.performPopup.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.performPopup.nativeElement, 'aria-hidden');
    setTimeout(() => {
      this._renderer2.addClass(this.performPopup.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }, 250);
}

getAnalysisScoreClass(ratingScore) {
  for (let i of RiskRatingMasterStore.allItems) {
    var pos = i.risk_rating_values?.findIndex(e => e == ratingScore)
    if (pos != -1) {
      return i.label;
    }
  }

}

closeFormModal() {
  this.getAssessment()
  setTimeout(() => {
    this.riskAssessmentObject.type = null;
    this.riskAssessmentObject.values = null;
    $(this.performPopup.nativeElement).modal('hide');
    setTimeout(() => {
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.performPopup.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.performPopup.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.performPopup.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }, 100);
}

getRiskImpactGuideline(){
  this._riskImpactGuidelineService.getRiskImpactGuidelines().subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })
}

changeZIndex() {
  if ($(this.performPopup.nativeElement).hasClass('show')) {
    this._renderer2.setStyle(this.performPopup.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.performPopup.nativeElement, 'overflow', 'auto');
  }

}

  ngOnDestroy(){
    //BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.riskAssessmentModalSubscription.unsubscribe()
  }

}
