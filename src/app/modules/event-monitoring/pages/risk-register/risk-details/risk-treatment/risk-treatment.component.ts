import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { RiskControlPlanService } from 'src/app/core/services/masters/risk-management/risk-control-plan/risk-control-plan.service';
import { RiskTreatmentStatusesService } from 'src/app/core/services/masters/risk-management/risk-treatment-statuses/risk-treatment-statuses.service';
import { RiskManagementService } from 'src/app/core/services/risk-management/risk-management-service/risk-management.service';
import { RiskAssessmentService } from 'src/app/core/services/risk-management/risks/risk-assessment/risk-assessment.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RiskControlPlanMasterStore } from 'src/app/stores/masters/risk-management/risk-control-plan-store';
import { RiskTreatmentStatusesMasterStore } from 'src/app/stores/masters/risk-management/risk-treatment-statuses-store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { EventRiskTreatmentStore } from 'src/app/stores/event-monitoring/risk-register/risk-treatment.store';
import { RiskRegisterStore } from 'src/app/stores/event-monitoring/risk-register/risk-register-store';
import { RiskTreatmentService } from 'src/app/core/services/event-monitoring/risk-treatment/risk-treatment.service';
import { RiskRegisterService } from 'src/app/core/services/event-monitoring/risk-register/risk-register.service';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';


declare var $: any;

@Component({
  selector: 'app-risk-treatment',
  templateUrl: './risk-treatment.component.html',
  styleUrls: ['./risk-treatment.component.scss']
})
export class RiskTreatmentComponent implements OnInit {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('treatmentPopup') treatmentPopup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('updatePopup') updatePopup: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  updateForm: FormGroup;
  formErrors = null;
  SubmenuItemStore = SubMenuItemStore;
  RiskRegisterStore = RiskRegisterStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  percentage = [];
  strategy = '';
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

  riskDetailObject = {
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

  watcherDetailObject = {
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

  createdDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
    created_at: ''
  }

  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle: '',
    title: ''
  };
  statuses = [];
  controlData = null;

  fileUploadsArray: any = []; // Display Mutitle File Loaders
  activeProcess = null;
  AppStore = AppStore;
  activeTreatment = null;
  treatmentPopupOpened = false;
  deleteEventSubscription: any;
  fileUploadProgress = 0;
  sliderValue = null;
  AuthStore = AuthStore;
  // riskControlPlan = null;
  EventRiskTreatmentStore = EventRiskTreatmentStore
  RiskControlPlanMasterStore = RiskControlPlanMasterStore;
  RiskManagementSettingStore = RiskManagementSettingStore;
  RiskTreatmentStatusStore = RiskTreatmentStatusesMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  changePlan = false;
  // OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  controlPlan = null;
  historyEmptyList = "update_empty_title";
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };
  riskTreatmentObject = {
    component: 'BCP',
    values: null,
    type: null
  };

  updateObject = {
    component: 'BCP',
    values: null,
    type: null
  };
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  eventTreatmentModalSubscription: any;
  eventTreatmentUpdateModalSubscription: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _riskManagementService: RiskManagementService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _risksService: RisksService,
    private route: ActivatedRoute,
    private _riskControlPlanService: RiskControlPlanService,
    private _riskAssessmentService: RiskAssessmentService,
    private _riskManagementSettingsService: RiskManagementSettingsService,
    private _formBuilder: FormBuilder,
    private _risktreatmentStatusService: RiskTreatmentStatusesService,
    private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _sanitizer: DomSanitizer,
    private _eventFileService: EventFileServiceService,
    private _documentFileService: DocumentFileService,
    private _discussionBotService: DiscussionBotService,
    private _RiskTreatmentService: RiskTreatmentService,
    private _riskRegisterService: RiskRegisterService,
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    this.percentage = [];
    for (let i = 0; i <= 100; i = i + 5) {
      this.percentage.push(i);
    }

    EventRiskTreatmentStore.setCurrentPage(1)
    AppStore.showDiscussion = false;

    if (!(RiskRegisterStore.individualRiskRegisterDetails) && RiskRegisterStore.RiskRegisterId) {

      this._router.navigateByUrl('/event/event-risks/' + RiskRegisterStore.RiskRegisterId);
    }

    this._riskRegisterService.getItem(RiskRegisterStore.RiskRegisterId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

    this.reactionDisposer = autorun(() => {
      
      if (RiskRegisterStore.individualRiskRegisterDetails) {
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "new_modal":
              setTimeout(() => {
                this._utilityService.detectChanges(this._cdr);
                this.openFormModal();
              }, 1000);
              break;

            case "template":
              var fileDetails = {
                ext: 'xlsx',
                title: 'Risk Template.xlsx',
                size: null
              };
              this._riskManagementService.downloadFile('risk-treatment-template', null, null, fileDetails.title, null, fileDetails);
              break;
            case "export_to_excel":
              var fileDetails = {
                ext: 'xlsx',
                title: 'Risk Template.xlsx',
                size: null
              };
              this._riskManagementService.downloadFile('risk-treatment-export', null, null, fileDetails.title, null, fileDetails);
              break;

            case "close_risk":

              this.closeRisk();
              break;

            default:
              break;
          }
          // Don't forget to unset clicked item immediately after using it
          SubMenuItemStore.unSetClickedSubMenuItem();
        }
        if (NoDataItemStore.clikedNoDataItem) {
          EventRiskTreatmentStore.unsetTreatmentDetails()
          this.openFormModal();
          NoDataItemStore.unSetClickedNoDataItem();
        }
      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.updateForm = this._formBuilder.group({
      id:[null],
      percentage: [null, Validators.required],
      risk_treatment_status_id: [null, Validators.required],
      amount_used: ['', [Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]],
      comment: [''],
      actual_start_date: [null],
      revised_target_date: [null],
      documents: [[], ''],
    })

    this._riskManagementSettingsService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.eventTreatmentModalSubscription = this._eventEmitterService.addBcmRiskTreatmentModal.subscribe(res=>{
      this.closeFormModal();
      this._riskRegisterService.getItem(RiskRegisterStore.RiskRegisterId).subscribe(res=>{
        this.pageChange(EventRiskTreatmentStore.currentPage,true)
        this._utilityService.detectChanges(this._cdr);
      })
      
    });

    this.eventTreatmentUpdateModalSubscription = this._eventEmitterService.bcmRiskTreatmentUpdateModal.subscribe(res=>{
      this.closeUpdateModal();
      this._riskRegisterService.getItem(RiskRegisterStore.RiskRegisterId).subscribe(res=>{
        this.pageChange(EventRiskTreatmentStore.currentPage,true)
        this._utilityService.detectChanges(this._cdr);
      })
    });


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
    SubMenuItemStore.setNoUserTab(true);
    if (RiskRegisterStore.individualLoaded && !RiskRegisterStore?.individualRiskRegisterDetails?.is_analysis_performed) {
      NoDataItemStore.setNoDataItems({ title: "assessment_empty_message" });

    }
    DiscussionBotStore.setDiscussionMessage([]);
    DiscussionBotStore.setbasePath('/risk-treatments/');
    this.setDiscussionComment();
    this.downloadDiscussionThumbnial();
    this.getImagePrivew();
    this.showThumbnailImage();
    if(EventRiskTreatmentStore.riskTreatmentDetails&&EventRiskTreatmentStore.riskTreatmentDetails.id){
      this.getDiscussions();
    }
    this.pageChange(1)
    setTimeout(() => {
      if (RiskRegisterStore.individualRiskRegisterDetails?.is_analysis_performed) {
        this.getSummary()
        this._utilityService.detectChanges(this._cdr);
      }
      this.pageChange(1)
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  downloadAuditableItemDocument(type, auditableItem, auditableItemDocument) {

    event.stopPropagation();
    switch (type) {
      case "downloadAuditableItemDocument":
        this._eventFileService.downloadFile(
          "risk-treatment-documents",
          auditableItem.id,
          auditableItemDocument.id,
          null,
          auditableItemDocument.name,
          auditableItemDocument
        );
        break;

    }

  }

  viewAuditDocument(type, auditableItem, auditableItemDocument) {
    switch (type) {
      case "viewDocument":
        this._eventFileService
          .getFilePreview("risk-treatment-documents", auditableItem.id, auditableItemDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              auditableItem.name
            );
            this.openPreviewModal(type, resp, auditableItemDocument, auditableItem);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
    }
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  
// Common File Upload Details Page Function Starts Here

openPreviewModal(type, filePreview, documentFiles, document) {
  this.previewObject.component=type


  let previewItem = null;
  if (filePreview) {
    previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.preview_url = previewItem;
    this.previewObject.file_details = documentFiles;
    this.previewObject.componentId = document.id;
    

    this.previewObject.uploaded_user =
    document.updated_by ? document.updated_by : document.created_by;
    this.previewObject.created_at = document.created_at;
    $(this.filePreviewModal.nativeElement).modal("show");
    this._utilityService.detectChanges(this._cdr);
  }
}

*// Closes from preview
  closePreviewModal(event) {
  $(this.filePreviewModal.nativeElement).modal("hide");
  this.previewObject.preview_url = "";
  this.previewObject.uploaded_user = null;
  this.previewObject.created_at = "";
  this.previewObject.file_details = null;
  this.previewObject.componentId = null;
}

downloadDocumentFile(type, document, docs?) {
  event.stopPropagation();
  switch (type) {
    case "risk-treatment-documents":
      this._eventFileService.downloadFile(
        type,
        document.risk_treatment_update_id,
        document.id,
        null,
        document.title,
        document
      );
      break;
    case "document-version":
      this._documentFileService.downloadFile(
        type,
        document.document_id,
        docs.id,
        null,
        document.title,
        docs
      );
      break;
  }
}

viewDocument(type, documents, documentFile, history_id:number=null) {
  switch (type) {
    case "risk-treatment-documents":
      this._eventFileService
        .getFilePreview(type, EventRiskTreatmentStore.riskTreatmentDetails.id, history_id, documentFile.id)
        .subscribe((res) => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            documents.title
          );
          this.openPreviewModal(type, resp, documentFile, documents);
        }),
        (error) => {
          if (error.status == 403) {
            this._utilityService.showErrorMessage(
              "Error",
              "Permission Denied"
            );
          } else {
            this._utilityService.showErrorMessage(
              "Error",
              "Unable to generate Preview"
            );
          }
        };
      break;

      case "document-version":
        this._documentFileService
          .getFilePreview(type, documents.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;


  }
}

  setSubmenuitems(){
    var subMenuItems = [];
    console.log(RiskRegisterStore.individualRiskRegisterDetails);
    
    
        
          
          subMenuItems = [
            { activityName: 'CREATE_RISK_TREATMENT', submenuItem: { type: 'new_modal' } },
            // { activityName: 'GENERATE_RISK_TREATMENT_TEMPLATE', submenuItem: { type: 'template' } },
            { activityName: 'EXPORT_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },
            { activityName: 'CLOSE_RISK', submenuItem: { type: 'close_risk' } },
            { activityName: null, submenuItem: { type: 'close', path: '../' } },
          ]
        
        
        
        
      this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
    

  }

  getSummary(){
    this._RiskTreatmentService.getSummary('?risk_id=' + RiskRegisterStore.RiskRegisterId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openFormModal() {
    this.riskTreatmentObject.type = 'Add';
    this.riskTreatmentObject.values = null; 
    this._utilityService.detectChanges(this._cdr)
    this.treatmentModal()
  }

  treatmentModal(){
    setTimeout(() => {
      $(this.treatmentPopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr)
    }, 250);
  }

  closeFormModal() {
    this._utilityService.detectChanges(this._cdr);
    this.getSummary()
    EventRiskTreatmentStore.loaded = false
    this.pageChange(EventRiskTreatmentStore.currentPage,true)
    setTimeout(() => {
      this.riskTreatmentObject.type = null;
      this.riskTreatmentObject.values = null;
      $(this.treatmentPopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  changeZIndex() {
    if ($(this.treatmentPopup.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.treatmentPopup.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.treatmentPopup.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.historyPopup.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
  }

  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
      for (let i of items) {
        // for (let j of i.language) {
        //   item.push(j.pivot);
        // }
        item.push(i.title);
      }
    return this._helperService.getArraySeperatedString(',', type, items);
  }
  ngAfterViewChecked() {

    // First let's set the colors of our sliders
    const settings = {
      fill: '#00C73C',
      background: '#fff'
    }

    // First find all our sliders
    const sliders = document.querySelectorAll('.range-slider');

    // Iterate through that list of sliders
    // ... this call goes through our array of sliders [slider1,slider2,slider3] and inserts them one-by-one into the code block below with the variable name (slider). We can then access each of wthem by calling slider
    Array.prototype.forEach.call(sliders, (slider) => {
      // Look inside our slider for our input add an event listener
      //   ... the input inside addEventListener() is looking for the input action, we could change it to something like change
      slider.querySelector('input').addEventListener('input', (event) => {
        // 1. apply our value to the span
        if (this.updateForm.value.amount_used)
          slider.querySelector('span').innerHTML = event.target.value;
        else
          slider.querySelector('span').innerHTML = 0;

        // 2. apply our fill to the input
        applyFill(event.target);
      });
      // Don't wait for the listener, apply it now!
      applyFill(slider.querySelector('input'));
    });

    // This function applies the fill to our sliders by using a linear gradient background
    function applyFill(slider) {
      // Let's turn our value into a percentage to figure out how far it is in between the min and max of our input
      const percentage = 100 * (slider.value - slider.min) / (slider.max - slider.min);
      // now we'll create a linear gradient that separates at the above point
      // Our background color will change here
      const bg = `linear-gradient(90deg, ${settings.fill} ${percentage}%, ${settings.background} ${percentage + 0.1}%)`;
      slider.style.background = bg;
    }

    //   if(this.updateForm!=undefined){
    //     $(document).ready(function() {
    //       $("#master-single").slider({
    //        value: 60,
    //        orientation: "horizontal",
    //        range: "min",
    //        animate: true,
    //      });
    //      $("#eq-multi > span").each(function () {

    //        var value = parseInt($(this).text(), 10);
    //        var rangeValue= this.sliderValue/1000;
    //        $(this).empty().slider({
    //          value: rangeValue,
    //          range: "min",
    //          animate: true,
    //          orientation: "vertical",
    //          slide: (event, ui)=> {
    //            $('#slider-input').val(ui);  
    //          },

    //        });
    //      });
    //    })
    //   }
    //   this.setValue();

    // }

    // setSlider(){
    //   if(this.updateForm!=undefined){
    //     $(document).ready(function() {
    //       $("#master-single").slider({
    //        value: 60,
    //        orientation: "horizontal",
    //        range: "min",
    //        animate: true,
    //      });
    //      $("#eq-multi > span").each(function () {

    //        var value = parseInt($(this).text(), 10);
    //        var rangeValue= this.sliderValue/1000;

    //        $(this).empty().slider({
    //          value: rangeValue,
    //          range: "min",
    //          animate: true,
    //          orientation: "vertical",
    //          slide: (event, ui)=> {
    //            $('#slider-input').val(ui);  
    //          },

    //        });
    //      });
    //    })
    //   }
    // this.setValue();

  }

  // setValue(){
  //   this.sliderValue = $('#slider-input').val();
  //   // this.sliderValue = data;
  //   this.sliderValue = this.sliderValue*1000;
  //   // this.updateForm.patchValue({
  //   //   amount_used:this.sliderValue
  //   // })
  // }

  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createPieChartForRisk();
        this.getremainingDateChart();
        // this.createPieChartForAuditHours();
      });
    }, 1000);
  }

  setDiscussionComment() {
    DiscussionBotStore.setDiscussionAPI(EventRiskTreatmentStore.riskTreatmentDetails?.id + '/comments')
  }

  getDiscussions() {
    this._discussionBotService.getDiscussionMessage().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  // risk-treatments/1/comments/1/files/1/download
  downloadDiscussionThumbnial() {
    DiscussionBotStore.setThumbnailDownloadAPI(EventRiskTreatmentStore.riskTreatmentDetails?.id + '/comments/')
  }
  showThumbnailImage() {
    DiscussionBotStore.setShowThumbnailAPI(EventRiskTreatmentStore.riskTreatmentDetails?.id + '/comments/')
  }
  getImagePrivew() {
    DiscussionBotStore.setDiscussionThumbnailAPI('/risk-management/files/risk-treatment-comment-document/thumbnail?token=')
  }
  convertToNumber(data) {
    return parseInt(data);
  }
  createPieChartForRisk() {
    am4core.addLicense("CH199714744");




    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    // Add data
    chart.data = [
      {
        "year": "2003",
        // "europe": 2.5,
        // "namerica": 2.5,
        // "asia": 2.1,
        // "lamerica": 1.2,
        "meast": 0.2,
        "africa": 0.1
      },
      //{
      //   "year": "2004",
      //   "europe": 2.6,
      //   "namerica": 2.7,
      //   "asia": 2.2,
      //   "lamerica": 1.3,
      //   "meast": 0.3,
      //   "africa": 0.1
      // }, {
      //   "year": "2005",
      //   "europe": 2.8,
      //   "namerica": 2.9,
      //   "asia": 2.4,
      //   "lamerica": 1.4,
      //   "meast": 0.3,
      //   "africa": 0.1
      // }
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.title.text = "Local country offices";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Expenditure (M)";

    // Create series
    function createSeries(field, name, stacked) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "year";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);
    }

    // createSeries("europe", "Europe", false);
    // createSeries("namerica", "North America", true);
    // createSeries("asia", "Asia", false);
    // createSeries("lamerica", "Latin America", true);
    // createSeries("meast", "Middle East", true);
    // createSeries("africa", "Africa", true);

    // Add legend
    chart.legend = new am4charts.Legend();


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

  pageChange(newPage: number = null,refresh:boolean=false) {

    if (newPage) EventRiskTreatmentStore.setCurrentPage(newPage);
    this._RiskTreatmentService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (res['data']?.length > 0) {
        this.getRiskTreatment(res['data'][0].id,refresh);
        this.getCharts();
      }else{
        setTimeout(() => {
          this.setSubmenuitems()
        }, 100);
        if (RiskRegisterStore.individualRiskRegisterDetails?.is_analysis_performed)
          {
            NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: "common_nodata_subtitle", buttonText: "new_risk_treatment" });
          this._utilityService.detectChanges(this._cdr);
          }
        else
          {
            NoDataItemStore.setNoDataItems({ title: "assessment_empty_message" });
            this._utilityService.detectChanges(this._cdr);
          }
      }
      
    })

  }

  setControlPlan(plan) {
    this.controlPlan = plan.id;
    this.controlData = plan;
  }

  saveControlPlan(close: boolean = false) {
    AppStore.enableLoading();
    let saveData = {
      risk_control_plan_id: this.controlPlan,
      risk_treatment_plan: this.strategy
    }
    this._RiskTreatmentService.saveControlPlan(saveData).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.controlData.is_treatment!=1 && this.getResponsiblePresent(AuthStore.user.id)) {
        this.closeRisk();

      }

      this._risksService.getItem(RiskRegisterStore.RiskRegisterId).subscribe(response => {
        this.changePlan = false;

        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      })
    })

  }



  saveData() {
    let saveData = {
      percentage: this.updateForm.value.percentage,
      risk_treatment_status_id: this.updateForm.value.risk_treatment_status_id,
      amount_used: this.updateForm.value.amount_used ? this.updateForm.value.amount_used : '0.00',
      comment: this.updateForm.value.comment,
      actual_start_date: this._helperService.processDate(this.updateForm.value.actual_start_date, 'join'),
      revised_target_date: this._helperService.processDate(this.updateForm.value.revised_target_date, 'join'),
      documents: this.updateForm.value.documents,

    }
    return saveData;
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  updateTreatment(close: boolean = false) {
    this.updateForm.patchValue({
      documents: this._RiskTreatmentService.getDocuments(),
      amount_used: this.updateForm.value.amount_used ? parseInt(this.updateForm.value.amount_used).toFixed(2) : '',
    })

    this.formErrors = null;
    AppStore.enableLoading();
    EventRiskTreatmentStore.setHistoryCurrentPage(1);
    this._RiskTreatmentService.getUpdateData(EventRiskTreatmentStore.riskTreatmentDetails.id).subscribe(res => {

      this._utilityService.detectChanges(this._cdr);

    })

    this._RiskTreatmentService.updateTreatmentStatus(EventRiskTreatmentStore.riskTreatmentDetails.id, this.saveData()).subscribe(res => {
      // this._RiskTreatmentService.getItems().subscribe();
      // this._RiskTreatmentService.getItem(EventRiskTreatmentStore.riskTreatmentDetails.id, '?risk_id=' + RiskRegisterStore.RiskRegisterId).subscribe();
      AppStore.disableLoading();
      this._risksService.getItem(RiskRegisterStore.RiskRegisterId).subscribe(response => {
        this._utilityService.detectChanges(this._cdr);
      })



      if (close) {
        this.closeUpdateModal();
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 404) {
        this.closeUpdateModal();
        AppStore.disableLoading();
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getremainingDateChart() {


    am4core.addLicense("CH199714744");
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("dayChartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        category: "Days",
        value1: EventRiskTreatmentStore.riskTreatmentDetails?.total_days - EventRiskTreatmentStore.riskTreatmentDetails?.days_remaining,
        value2: EventRiskTreatmentStore.riskTreatmentDetails?.days_remaining,
      }
    ];

    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    // chart.legend = new am4charts.Legend();

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;


    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(50);
    series1.columns.template.tooltipText =
      "{value1} Days";
    series1.name = "Series 1";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "value1";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";

    let bullet1 = series1.bullets.push(new am4charts.LabelBullet());
    bullet1.interactionsEnabled = false;
    // bullet1.label.text = "{value1} Days";
    bullet1.label.fill = am4core.color("#000");
    bullet1.locationY = 0.5;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(50);
    series2.columns.template.tooltipText =
      "{value2} Days";
    series2.name = "Series 2";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";

    let bullet2 = series2.bullets.push(new am4charts.LabelBullet());
    bullet2.interactionsEnabled = false;
    bullet2.label.text = "{value2} Days";
    bullet2.locationY = 0.5;
    bullet2.label.fill = am4core.color("#ffffff");

  }

  getControlLength(control) {
    let count = 0;
    if (control?.length > 0) {
      for (let i of control) {
        if (i.control && i.control != null) {
          count++;
          return true;
        }

      }
      if (count == 0) {
        return false;
      }
    }
    else
      return false;

  }

  getRiskTreatment(id,refresh:boolean=false) {
    if (this.activeTreatment != id || refresh) {
      this.activeTreatment = id;
      this._RiskTreatmentService.getItem(id, '?risk_id=' + RiskRegisterStore.RiskRegisterId).subscribe(res => {
        if (res['process_details']&&res['process_details'][0])
          this.activeProcess = res['process_details'][0]?.process?.id;
        this._utilityService.detectChanges(this._cdr);
        DiscussionBotStore.setDiscussionMessage([]);
        this.historyPageChange(1);
        this.setDiscussionComment();
        this.downloadDiscussionThumbnial();
        this.getImagePrivew();
        this.showThumbnailImage();
        if(EventRiskTreatmentStore.riskTreatmentDetails&&EventRiskTreatmentStore.riskTreatmentDetails.id){
          this.getDiscussions();
        }
        setTimeout(() => {
          this.setSubmenuitems()
        }, 100);
        this._utilityService.detectChanges(this._cdr)
      })
    }


  }

  checkForPercentage(percentage) {
    if (percentage == 0) {
      this.updateForm.patchValue({
        risk_treatment_status_id: 1
      })

    }
    else if (percentage == 100) {
      this.updateForm.patchValue({
        risk_treatment_status_id: 3
      })

    }
  }

  checkForStatus(status) {
    if (status == 1) {
      this.updateForm.patchValue({
        percentage: 0
      })
    }
    else if (status == 3) {
      this.updateForm.patchValue({
        percentage: 100
      })

    }
    else {
      this.updateForm.patchValue({
        percentage: null
      })
    }
  }

  getStatus() {
    this.statuses = [];
    this._risktreatmentStatusService.getItems().subscribe(res => {
      for (let i of res['data']) {
        if (i.type == 'new' || i.type == 'wip' || i.type == 'resolved') {
          this.statuses.push(i);
        }
      }
      // res.forEach(data => {     
      //   if (data.id == 1 || data.id == 7) {
      //     this.processedDocumentStatusArray.push(data)
      //     this.quickUploadForm.patchValue({
      //       document_status_id: 1
      //     })
      //     this._utilityService.detectChanges(this._cdr)
      //   }             
      // })
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchStatus(event) {
    this.statuses = [];
    this._risktreatmentStatusService.getItems(false, '?q=' + event.term).subscribe(res => {
      for (let i of res['data']) {
        if (i.type == 'new' || i.type == 'wip' || i.type == 'resolved') {
          this.statuses.push(i);
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }


  openUpdateModal() {
    this.EventRiskTreatmentStore.clearDocumentDetails();
    this.getStatus();
    this.historyPageChange(1);
    this.updateForm.patchValue({
      percentage: EventRiskTreatmentStore.riskTreatmentDetails.percentage ? EventRiskTreatmentStore.riskTreatmentDetails.percentage : 0,
      risk_treatment_status_id: EventRiskTreatmentStore.riskTreatmentDetails.risk_treatment_status.id,
      amount_used: EventRiskTreatmentStore.riskTreatmentDetails.amount_used ? EventRiskTreatmentStore.riskTreatmentDetails.amount_used : '0.00',
      comment: EventRiskTreatmentStore.riskTreatmentDetails.comment ? EventRiskTreatmentStore.riskTreatmentDetails.comment : '',
      id:EventRiskTreatmentStore.riskTreatmentDetails.id?EventRiskTreatmentStore.riskTreatmentDetails.id:''
    })
    this.updateObject.type = "Add"
    this.sliderValue = EventRiskTreatmentStore.riskTreatmentDetails.amount_used;
    this._utilityService.detectChanges(this._cdr);
    $(this.updatePopup.nativeElement).modal('show');
  }

  openHistoryModal() {
    this.historyPageChange(1);
    setTimeout(() => {
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'auto');
      $(this.historyPopup.nativeElement).modal('show');
    }, 200);

  }

  clear(type) {
    if (type == 'start_date') {
      this.updateForm.patchValue({
        actual_start_date: null
      })
    }
    else {
      this.updateForm.patchValue({
        revised_target_date: null
      })
    }
  }

  historyPageChange(newPage: number = null) {
    if (newPage) EventRiskTreatmentStore.setHistoryCurrentPage(newPage);
    this._RiskTreatmentService.getUpdateData(EventRiskTreatmentStore.riskTreatmentDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);

    })
  }

  closeHistoryModal() {
    this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 99);
    this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'none');
    $(this.historyPopup.nativeElement).modal('hide');
  }


  /**
 * removing document file from the selected list
 * @param token -image token
 */
  removeDocument(token) {
    EventRiskTreatmentStore.unsetProductImageDetails('support-file', token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }


  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  closeUpdateModal() {
    this.fileUploadsArray = [];
    this.EventRiskTreatmentStore.clearDocumentDetails();
    this.updateForm.reset();
    this.updateObject.type = null
    $(this.updatePopup.nativeElement).modal('hide');
  }

  changeControlPlan() {
    this.changePlan = true;
    // RiskRegisterStore.individualRiskRegisterDetails.risk_control_plan = null;
  }

  exitControlSelection() {
    this.changePlan = false;
  }

  /**
 * 
 * @param progress File Upload Progress
 * @param file Selected File
 * @param success Boolean value whether file upload success 
 */
  assignFileUploadProgress(progress, file, success = false) {

    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }



  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._RiskTreatmentService.setImageDetails(imageDetails, logo_url, type);
      else
        this._RiskTreatmentService.setSelectedImageDetails(logo_url, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


  /**
   * Returns whether file extension is of imgage, pdf, document or etc..
   * @param ext File extension
   * @param extType Type - image,pdf,doc etc..
   */
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  /**
     * download all file in a document or single file
     * @param id - document id
     * @param filename - the downloading file name
     * @param file_id - file id in the document
     */
  downloadDocument(id, filename, file_id?, doc?) {

    if (file_id) {
      this._riskManagementService.downloadFile('risk-treatment-documents', EventRiskTreatmentStore.riskTreatmentDetails.id, id, filename, file_id, doc);
    }

  }

  
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


  checkForFileUploadsScrollbar() {
    if (EventRiskTreatmentStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }




  /**
   * 
   * @param type -document -will get thumbnail preview of document or else user profile picture
   * 
   * @param token -image token
   */
  createImageUrl(type, token) {
    if (type == 'document') {
      return this._riskManagementService.getThumbnailPreview('risk-treatment', token);
    }

    if (type == 'user') {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

    if(type=='document-version'){
      return this._documentFileService.getThumbnailPreview(type, token);
    }

    if(type=='risk-treatment-documents'){
      return this._eventFileService.getThumbnailPreview(type, token);
    }

  }


  onFileChange(event, type: string) {
    //this.fileUploadProgress = 0;
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {


        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          EventRiskTreatmentStore.document_preview_available = true;
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if (uploadEvent.loaded) {
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress, file);
                }


                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                let temp: any = uploadEvent['body'];

                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                  EventRiskTreatmentStore.document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  EventRiskTreatmentStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            EventRiskTreatmentStore.document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else {
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }

  }

  getValue(e) {
    this.updateForm.patchValue({
      amount_used: e.target.value
    })
  }

  /**
  * Delete the risk
  * @param id -risk id
  */
  delete(status) {
    if (status && this.deleteObject.id) {

      if (this.deleteObject.type == 'are_you_sure_confirm' && this.deleteObject.title == 'treatment') {
        this._RiskTreatmentService.closeTreatment(this.deleteObject.id).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
          this._RiskTreatmentService.getItems().subscribe();
          this.getSummary()
          // this._RiskTreatmentService.getItem(this.deleteObject.id);
          this.clearDeleteObject();
        })
      }
      else if (this.deleteObject.type == 'are_you_sure_confirm' && this.deleteObject.title == 'risk') {
        this._RiskTreatmentService.closeRisk(this.deleteObject.id).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
            // this._router.navigateByUrl('/bcm/risk-assessment');
            this._riskRegisterService.getItem(RiskRegisterStore.RiskRegisterId).subscribe(res=>{
              this.setSubmenuitems()
              this._utilityService.detectChanges(this._cdr);
            })
          // this._RiskTreatmentService.getItem(this.deleteObject.id);
          this.clearDeleteObject();
        })
      }
      else {

        this._RiskTreatmentService.delete(this.deleteObject.id).subscribe(resp => {
          setTimeout(() => {

            if (EventRiskTreatmentStore.currentPage > 1) {
              EventRiskTreatmentStore.currentPage = Math.ceil(EventRiskTreatmentStore.totalItems / 15);
              this.pageChange(EventRiskTreatmentStore.currentPage);
              this._utilityService.detectChanges(this._cdr);
            }
            else {
              this.pageChange(1);
            }
          }, 500);
          this.clearDeleteObject();

        });
      }
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup?.nativeElement).modal('hide');
    }, 250);

  }

  deleteRiskTreatment(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.title = '';
    this.deleteObject.subtitle = "delete_risk_treatment"

    $(this.deletePopup.nativeElement).modal('show');
  }

  closeRiskTreatment(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'are_you_sure_confirm';
    this.deleteObject.title = 'treatment';
    this.deleteObject.subtitle = "it_will_close_risk_treatment"

    $(this.deletePopup.nativeElement).modal('show');
  }

  isProperCloseUser() {
  
        return true;
    
  }

  closeRisk() {
    this.deleteObject.id = RiskRegisterStore.RiskRegisterId;
    this.deleteObject.type = 'are_you_sure_confirm';
    this.deleteObject.title = 'risk';
    this.deleteObject.subtitle = "close_risk_subtitle"

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.position = null;
  }


  getDays(day1) {
    let dt = new Date();
    return Math.round(this._helperService.getDatesDifference(dt,day1));
  }

  /**
   * changing the number of days in to month and years
   * @param days -number of days
   */
  createDaysString(days) {
    return this._helperService.daysConversion(days);
  }

  getPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.userDetailObject.first_name = user.first_name;
      this.userDetailObject.last_name = user.last_name;
      this.userDetailObject.designation = user.designation;
      this.userDetailObject.image_token = user.image.token;
      this.userDetailObject.email = user.email;
      this.userDetailObject.mobile = user.mobile;
      this.userDetailObject.id = user.id;
      this.userDetailObject.department = user.department ? user.department : null;
      this.userDetailObject.status_id = user.status.id ? user.status.id : 1;
      return this.userDetailObject;
    }
  }


  getRiskPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.riskDetailObject.first_name = user.first_name;
      this.riskDetailObject.last_name = user.last_name;
      this.riskDetailObject.designation = user.designation;
      this.riskDetailObject.image_token = user.image.token;
      this.riskDetailObject.email = user.email;
      this.riskDetailObject.mobile = user.mobile;
      this.riskDetailObject.id = user.id;
      this.riskDetailObject.department = user.department ? user.department : null;
      this.riskDetailObject.status_id = user.status.id ? user.status.id : 1;
      return this.riskDetailObject;
    }
  }

  getWatcherPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.watcherDetailObject.first_name = user.first_name;
      this.watcherDetailObject.last_name = user.last_name;
      this.watcherDetailObject.designation = user.designation;
      this.watcherDetailObject.image_token = user.image.token;
      this.watcherDetailObject.email = user.email;
      this.watcherDetailObject.mobile = user.mobile;
      this.watcherDetailObject.id = user.id;
      this.watcherDetailObject.department = user.department ? user.department : null;
      this.watcherDetailObject.status_id = user.status.id ? user.status.id : 1;
      return this.watcherDetailObject;
    }
  }

  getCreatedPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.createdDetailObject.first_name = user.first_name;
      this.createdDetailObject.last_name = user.last_name;
      this.createdDetailObject.designation = user.designation;
      this.createdDetailObject.image_token = user.image.token;
      this.createdDetailObject.email = user.email;
      this.createdDetailObject.mobile = user.mobile;
      this.createdDetailObject.id = user.id;
      this.createdDetailObject.department = user.department ? user.department : null;
      this.createdDetailObject.status_id = user.status.id ? user.status.id : 1;
      this.createdDetailObject.created_at = EventRiskTreatmentStore.riskTreatmentDetails.created_at;
      return this.createdDetailObject;
    }
  }

  getRiskControlPlan(index?) {
    this._riskControlPlanService.getItems().subscribe(res => {
      if (index) {
        if (RiskRegisterStore.individualRiskRegisterDetails?.risk_control_plan) {
          this.controlPlan = RiskRegisterStore.individualRiskRegisterDetails?.risk_control_plan.id;
          this.controlData = RiskRegisterStore.individualRiskRegisterDetails?.risk_control_plan;
          this.strategy = RiskRegisterStore.individualRiskRegisterDetails?.risk_treatment_plan;
        }
        else {
          this.controlPlan = res['data'][0].id;
          this.controlData = res['data'][0];
        }

      }
      this._utilityService.detectChanges(this._cdr);

    })
  }
  searchRiskControlPlan(event) {
    this._riskControlPlanService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  editTreatment() {
    EventRiskTreatmentStore.setEditFlag();
    this.riskTreatmentObject.type = 'Edit';
    this.riskTreatmentObject.values = null; 
    setTimeout(() => {
      $(this.treatmentPopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr)
    }, 250);
  }
  

  openProcess(id) {

    // this._riskAssessmentService.getItemByProcess(id).subscribe(res=>{

    this.setActiveProcess(id);
    //   this._utilityService.detectChanges(this._cdr);
    // })
  }


  setActiveProcess(id) {
    if (this.activeProcess == id) {
      this.activeProcess = null;
    }
    else
      this.activeProcess = id;
  }

  getResponsiblePresent(id) {

    var pos = RiskRegisterStore.individualRiskRegisterDetails?.responsible_users?.findIndex(e => e.id == id);
    if (pos != -1)
      return true;
    else
      if (RiskRegisterStore.individualRiskRegisterDetails?.risk_owner?.id == id)
        return true;
      else
        if (EventRiskTreatmentStore.riskTreatmentDetails?.responsible_user?.id == id)
          return true
        else {
          var pos2 = EventRiskTreatmentStore.riskTreatmentDetails?.watchers?.findIndex(v => v.id == id);

          if (pos2 != -1) {
            return true;
          }
          else {
            if (EventRiskTreatmentStore.riskTreatmentDetails?.created_by?.id == id)
              return true
            else {
              if (RiskRegisterStore.individualRiskRegisterDetails.created_by.id == id)
                return true;
              else
                return false;
            }

          }

        }

    // else
    //   return false;


  }

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    NoDataItemStore.unsetNoDataItems();
    EventRiskTreatmentStore.loaded = false
    EventRiskTreatmentStore.unsetTreatmentDetails()
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.eventTreatmentModalSubscription.unsubscribe()
    this.eventTreatmentUpdateModalSubscription.unsubscribe()
    // AppStore.showDiscussion = false;

  }

}
