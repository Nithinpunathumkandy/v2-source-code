import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HiraFileService } from 'src/app/core/services/hira/hira-file/hira-file.service';
import { HiraTreatmentService } from 'src/app/core/services/hira/hira/hira-treatment/hira-treatment.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RiskTreatmentStore } from 'src/app/stores/hira/hira/hira-treatment.store';
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HiraService } from 'src/app/core/services/hira/hira/hira.service';
import { RiskControlPlanService } from 'src/app/core/services/masters/risk-management/risk-control-plan/risk-control-plan.service';
import { RiskControlPlanMasterStore } from 'src/app/stores/masters/risk-management/risk-control-plan-store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { HiraAssessmentService } from 'src/app/core/services/hira/hira/hira-assessment/hira-assessment.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { RiskTreatmentStatusesService } from 'src/app/core/services/masters/risk-management/risk-treatment-statuses/risk-treatment-statuses.service';
import { RiskTreatmentStatusesMasterStore } from 'src/app/stores/masters/risk-management/risk-treatment-statuses-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { DomSanitizer } from '@angular/platform-browser';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  selector: 'app-hira-treatment',
  templateUrl: './hira-treatment.component.html',
  styleUrls: ['./hira-treatment.component.scss']
})
export class HiraTreatmentComponent implements OnInit {

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
  RisksStore = RisksStore;
  RiskTreatmentStore = RiskTreatmentStore;
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
  RiskControlPlanMasterStore = RiskControlPlanMasterStore;
  RiskManagementSettingStore = RiskManagementSettingStore;
  RiskTreatmentStatusStore = RiskTreatmentStatusesMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  changePlan = false;
  // OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  controlPlan = null;
  historyEmptyList = "update_empty_title";
  previewObject = {
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  public risk_title:string='risk_title'	
	public rm_risk_description:string='rm_risk_description'

  constructor(@Inject(PLATFORM_ID) private platformId,
  private zone: NgZone,
  private _helperService: HelperServiceService,
  private _utilityService: UtilityService,
  private _cdr: ChangeDetectorRef,
  private _hiraFileService: HiraFileService,
  private _router: Router,
  private _riskTreatmentService: HiraTreatmentService,
  private _renderer2: Renderer2,
  private _eventEmitterService: EventEmitterService,
  private _risksService: HiraService,
  private route: ActivatedRoute,
  private _riskControlPlanService: RiskControlPlanService,
  private _hiraAssessmentService: HiraAssessmentService,
  private _riskManagementSettingsService: RiskManagementSettingsService,
  private _formBuilder: FormBuilder,
  private _risktreatmentStatusService: RiskTreatmentStatusesService,
  private _imageService: ImageServiceService,
  private _humanCapitalService: HumanCapitalService,
  private _sanitizer: DomSanitizer,
  private _discussionBotService: DiscussionBotService) { }

  // Run the function only in the browser
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

    RiskTreatmentStore.setCurrentPage(1)
    AppStore.showDiscussion = false;

    if (!(RisksStore.individualRiskDetails) && RisksStore.riskId) {

      this._router.navigateByUrl('/risk-management/risks/' + RisksStore.riskId);
    }

    //     if(RisksStore.individual_risk_loaded && RisksStore?.individualRiskDetails?.is_analysis_performed){
    //   NoDataItemStore.setNoDataItems({title: "Looks like we don't have treatment to display here", subtitle: 'To add treatment, Simply tab the button below',buttonText: 'Add Treatment'});

    // }
    if (RisksStore.individual_risk_loaded && !RisksStore?.individualRiskDetails?.is_analysis_performed) {
      NoDataItemStore.setNoDataItems({ title: "assessment_empty_message" });

    }

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [];
      if (RisksStore.individualRiskDetails) {
        if (RisksStore.individualRiskDetails?.is_analysis_performed && RisksStore.individualRiskDetails?.risk_control_plan && RisksStore.individualRiskDetails?.risk_control_plan?.is_treatment == 1 && RisksStore.individualRiskDetails?.risk_status?.type != 'closed') {
          if (RisksStore.individualRiskDetails?.is_corporate) {
            if (RisksStore.isProperEditUser()) {
              if(this.properCloseUser(AuthStore.user.id)){
                subMenuItems = [
                  { activityName: 'CREATE_RISK_TREATMENT', submenuItem: { type: 'new_modal' } },
                  { activityName: 'EXPORT_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },
                  { activityName: 'CLOSE_RISK', submenuItem: { type: 'close_risk' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/risk-management/corporate-risks' } },
                ]
              }
              else{
                subMenuItems = [
                  { activityName: 'CREATE_RISK_TREATMENT', submenuItem: { type: 'new_modal' } },
                  { activityName: 'EXPORT_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/risk-management/corporate-risks' } },
                ]
              }
             
            }
            else {
              subMenuItems = [

                { activityName: 'EXPORT_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/risk-management/corporate-risks' } },
              ]
            }

          }
          else {
            if (RisksStore.isProperEditUser()) {
              if(this.properCloseUser(AuthStore.user.id)){
              subMenuItems = [
                { activityName: 'CREATE_RISK_TREATMENT', submenuItem: { type: 'new_modal' } },
                // { activityName: 'GENERATE_RISK_TREATMENT_TEMPLATE', submenuItem: { type: 'template' } },
                { activityName: 'EXPORT_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },
                { activityName: 'CLOSE_RISK', submenuItem: { type: 'close_risk' } },
                { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risks' } },
              ]
            }
            else{
              subMenuItems = [
                { activityName: 'CREATE_RISK_TREATMENT', submenuItem: { type: 'new_modal' } },
                { activityName: 'EXPORT_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risks' } },
              ]
            }
            }
            else {
              subMenuItems = [

                { activityName: 'EXPORT_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },
                { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risks' } },
              ]
            }

          }
          this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
        }
        else {
          if (RisksStore.individualRiskDetails?.is_corporate) {

            subMenuItems = [
              // { activityName: 'GENERATE_RISK_TREATMENT_TEMPLATE', submenuItem: { type: 'template' } },
              { activityName: 'EXPORT_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: '/risk-management/corporate-risks' } },
            ]
          }
          else {
            subMenuItems = [
              // { activityName: 'GENERATE_RISK_TREATMENT_TEMPLATE', submenuItem: { type: 'template' } },
              { activityName: 'EXPORT_RISK_TREATMENT', submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: '/risk-management/risks' } },
            ]
          }
          this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
        }

        // this._helperService.checkSubMenuItemPermissions(900, subMenuItems);


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
                title: 'RiskTreatmentTemplate.xlsx',
                size: null
              };
              this._hiraFileService.downloadFile('risk-treatment-template', null, null, fileDetails.title, null, fileDetails);
              break;
            case "export_to_excel":
              var fileDetails = {
                ext: 'xlsx',
                title: 'RiskTreatmentExport.xlsx',
                size: null
              };
              this._hiraFileService.downloadFile('risk-treatment-export', null, null, fileDetails.title, null, fileDetails);
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
          this.openFormModal();

          NoDataItemStore.unSetClickedNoDataItem();
        }
      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.updateForm = this._formBuilder.group({
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
    if (RisksStore.individualRiskDetails?.is_analysis_performed) {
      this._riskTreatmentService.getSummary('?risk_id=' + RisksStore.riskId).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    if (RisksStore.individualRiskDetails?.is_analysis_performed) {
      this.pageChange(1)
    }


    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
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
    // window.addEventListener('scroll', this.scrollEvent, true);

    // setTimeout(() => {

    //   this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    //   window.addEventListener('scroll', this.scrollEvent, true);
    //   this._utilityService.detectChanges(this._cdr);

    // }, 250);
    // this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    //   this.delete(item);
    // })
    this.getRiskControlPlan(true);
    SubMenuItemStore.setNoUserTab(true);

    // DiscussionBotStore.setDiscussionMessage([]);
    DiscussionBotStore.setbasePath('/risk-treatments/');
    // this.setDiscussionComment();
    // this.downloadDiscussionThumbnial();
    // this.getImagePrivew();
    // this.showThumbnailImage();
    // this.getDiscussions();

    this.callLabelFn()
  }

  callLabelFn(){
    if(RisksStore.individualRiskDetails?.risk_classification?.is_risk==1){
      this.rm_risk_description='rm_risk_description'
      this.risk_title='risk_title'      
    }else{
      this.rm_risk_description='description'
      this.risk_title='title'      
    }
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
    DiscussionBotStore.setDiscussionAPI(RiskTreatmentStore.riskTreatmentDetails?.id + '/comments')
  }

  getDiscussions() {
    this._discussionBotService.getDiscussionMessage().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  // risk-treatments/1/comments/1/files/1/download
  downloadDiscussionThumbnial() {
    DiscussionBotStore.setThumbnailDownloadAPI(RiskTreatmentStore.riskTreatmentDetails?.id + '/comments/')
  }
  showThumbnailImage() {
    DiscussionBotStore.setShowThumbnailAPI(RiskTreatmentStore.riskTreatmentDetails?.id + '/comments/')
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

  pageChange(newPage: number = null) {

    if (newPage) RiskTreatmentStore.setCurrentPage(newPage);
    this._riskTreatmentService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (res['data']?.length > 0) {
        this.getRiskTreatment(res['data'][0].id);
        this.getCharts();
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
    this._riskTreatmentService.saveControlPlan(saveData).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.controlData.is_treatment!=1 && this.properCloseUser(AuthStore.user.id)) {
        this.closeRisk();

      }

      this._risksService.getItem(RisksStore.riskId).subscribe(response => {
        this.changePlan = false;

        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      })
    })

  }

  viewDocument(document, history_id) {
    this._hiraFileService.getFilePreview('risk-treatment', RiskTreatmentStore.riskTreatmentDetails.id, history_id, document.id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, document.title);
      this.openPreviewModal(resp, document);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'Permission Denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
      }
    });
  }


  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(filePreview, itemDetails) {

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'risk-treatment-documents';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = RiskTreatmentStore?.riskTreatmentDetails?.created_by;
    this.previewObject.uploaded_user['image_token'] = RiskTreatmentStore?.riskTreatmentDetails?.created_by?.image?.token;
    this.previewObject.created_at = RiskTreatmentStore?.riskTreatmentDetails?.created_at;
    setTimeout(() => {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 9999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
      $(this.filePreviewModal.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);

  }

  closePreviewModal(event) {
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 99);
    this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.historyPopup.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.historyPopup.nativeElement, 'overflow', 'auto');
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';

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
      documents: this._riskTreatmentService.getDocuments(),
      amount_used: this.updateForm.value.amount_used ? parseInt(this.updateForm.value.amount_used).toFixed(2) : '',
    })

    this.formErrors = null;
    AppStore.enableLoading();
    RiskTreatmentStore.setHistoryCurrentPage(1);
    this._riskTreatmentService.getUpdateData(RiskTreatmentStore.riskTreatmentDetails.id).subscribe(res => {

      this._utilityService.detectChanges(this._cdr);

    })

    this._riskTreatmentService.updateTreatmentStatus(RiskTreatmentStore.riskTreatmentDetails.id, this.saveData()).subscribe(res => {
      // this._riskTreatmentService.getItems().subscribe();
      // this._riskTreatmentService.getItem(RiskTreatmentStore.riskTreatmentDetails.id, '?risk_id=' + RisksStore.riskId).subscribe();
      AppStore.disableLoading();
      this._risksService.getItem(RisksStore.riskId).subscribe(response => {
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
        value1: RiskTreatmentStore.riskTreatmentDetails?.total_days - RiskTreatmentStore.riskTreatmentDetails?.days_remaining,
        value2: RiskTreatmentStore.riskTreatmentDetails?.days_remaining,
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

  getRiskTreatment(id) {
    if (this.activeTreatment != id) {
      this.activeTreatment = id;
      this._riskTreatmentService.getItem(id, '?risk_id=' + RisksStore.riskId).subscribe(res => {
        if (res['process_details'][0])
          this.activeProcess = res['process_details'][0]?.process?.id;
        this._utilityService.detectChanges(this._cdr);
        DiscussionBotStore.setDiscussionMessage([]);
        this.historyPageChange(1);
        this.setDiscussionComment();
        this.downloadDiscussionThumbnial();
        this.getImagePrivew();
        this.showThumbnailImage();
        this.getDiscussions();
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


    this.RiskTreatmentStore.clearDocumentDetails();
    this.getStatus();
    this.historyPageChange(1);
    // this._riskTreatmentService.getUpdateData(RiskTreatmentStore.riskTreatmentDetails.id).subscribe(res=>{
    //   if(res['data'].length>0){
    //     if (res['data'][0].documents&& res['data'][0].documents.length > 0) {
    //       for (let i of res['data'][0].documents) {
    //         let docurl = this._hiraFileService.getThumbnailPreview('risk-treatment', i.token);
    //         let docDetails = {
    //           name: i.title,
    //           ext: i.ext,
    //           size: i.size,
    //           url: i.url,
    //           thumbnail_url: i.url,
    //           token: i.token,
    //           preview: docurl,
    //           id: i.id,
    //           user_document_detail_id: i.risk_treatment_update_id
    //         };
    //         this._riskTreatmentService.setImageDetails(docDetails, docurl, 'risk-treatment');
    //       }
    //       this.checkForFileUploadsScrollbar();

    //     }

    //     // }
    //   }

    // })


    this.updateForm.patchValue({
      percentage: RiskTreatmentStore.riskTreatmentDetails.percentage ? RiskTreatmentStore.riskTreatmentDetails.percentage : 0,
      risk_treatment_status_id: RiskTreatmentStore.riskTreatmentDetails.risk_treatment_status.id,
      amount_used: RiskTreatmentStore.riskTreatmentDetails.amount_used ? RiskTreatmentStore.riskTreatmentDetails.amount_used : '0.00',
      comment: RiskTreatmentStore.riskTreatmentDetails.comment ? RiskTreatmentStore.riskTreatmentDetails.comment : ''
    })
    // if(res.length>0){
    this.sliderValue = RiskTreatmentStore.riskTreatmentDetails.amount_used;
    // this.setSlider();
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
    if (newPage) RiskTreatmentStore.setHistoryCurrentPage(newPage);
    this._riskTreatmentService.getUpdateData(RiskTreatmentStore.riskTreatmentDetails?.id).subscribe(res => {
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
    RiskTreatmentStore.unsetProductImageDetails('support-file', token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }


  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  closeUpdateModal() {
    this.fileUploadsArray = [];
    this.RiskTreatmentStore.clearDocumentDetails();
    this.updateForm.reset();
    $(this.updatePopup.nativeElement).modal('hide');
  }

  changeControlPlan() {
    this.changePlan = true;
    // RisksStore.individualRiskDetails.risk_control_plan = null;
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
        this._riskTreatmentService.setImageDetails(imageDetails, logo_url, type);
      else
        this._riskTreatmentService.setSelectedImageDetails(logo_url, type);
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
      this._hiraFileService.downloadFile('risk-treatment-documents', RiskTreatmentStore.riskTreatmentDetails.id, id, filename, file_id, doc);
    }

  }

  
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


  checkForFileUploadsScrollbar() {
    if (RiskTreatmentStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
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
      return this._hiraFileService.getThumbnailPreview('risk-treatment', token);
    }

    if (type == 'user') {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
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
          RiskTreatmentStore.document_preview_available = true;
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

                  RiskTreatmentStore.document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  RiskTreatmentStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            RiskTreatmentStore.document_preview_available = false;
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

      if (this.deleteObject.type == 'Confirm' && this.deleteObject.title == 'treatment') {
        if(RiskTreatmentStore?.riskTreatmentDetails.risk_treatment_status.type=='resolved' && AuthStore.getActivityPermission(900,'CLOSE_RISK_TREATMENT')
        && RisksStore.individualRiskDetails?.risk_status?.type!='closed' && this.getResponsiblePresent(AuthStore.user.id)){
          this._riskTreatmentService.closeTreatment(this.deleteObject.id).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
            this._riskTreatmentService.getItems().subscribe();
            // this._riskTreatmentService.getItem(this.deleteObject.id);
            this.clearDeleteObject();
          })
        }
       
      }
      else if (this.deleteObject.type == 'Confirm' && this.deleteObject.title == 'risk') {
        SubMenuItemStore.closeRiskClicked = true;
        this._risksService.closeRisk(this.deleteObject.id).subscribe(res => {
          SubMenuItemStore.closeRiskClicked = false;
          this._utilityService.detectChanges(this._cdr);
          if (RisksStore.corporate)
            this._router.navigateByUrl('/risk-management/corporate-risks');
          else
            this._router.navigateByUrl('/risk-management/risks');
            
          // this._riskTreatmentService.getItem(this.deleteObject.id);
          this.clearDeleteObject();
        })
      }
      else {

        this._riskTreatmentService.delete(this.deleteObject.id).subscribe(resp => {
          setTimeout(() => {

            if (RiskTreatmentStore.currentPage > 1) {
              RiskTreatmentStore.currentPage = Math.ceil(RiskTreatmentStore.totalItems / 15);
              this.pageChange(RiskTreatmentStore.currentPage);
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
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
    }, 150);
   
  }

  closeRiskTreatment(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'treatment';
    this.deleteObject.subtitle = "close_risk_treatment"
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
    }, 150);
  
  }

  // isProperCloseUser() {
  
  //       return true;
    
  // }

  closeRisk() {
    this.deleteObject.id = RisksStore.riskId;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'risk';
    this.deleteObject.subtitle = "close_risk_subtitle?"

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.position = null;
  }


  getDays(day1) {
    let dt = new Date();
    return Math.round(this._helperService.daysFromDate(day1, dt));
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
      this.createdDetailObject.created_at = RiskTreatmentStore.riskTreatmentDetails.created_at;
      return this.createdDetailObject;
    }
  }

  getRiskControlPlan(index?) {
    this._riskControlPlanService.getItems().subscribe(res => {
      if (index) {
        if (RisksStore.individualRiskDetails?.risk_control_plan) {
          this.controlPlan = RisksStore.individualRiskDetails?.risk_control_plan.id;
          this.controlData = RisksStore.individualRiskDetails?.risk_control_plan;
          this.strategy = RisksStore.individualRiskDetails?.risk_treatment_plan;
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
    RiskTreatmentStore.setEditFlag();
    this._router.navigateByUrl('/risk-management/risks/' + RisksStore.riskId + '/edit-risk-treatment');
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


  properCloseUser(id){
    if (RisksStore.individualRiskDetails?.created_by?.id == id)
    return true;
    else
    return false;
  }

  getResponsiblePresent(id) {

    var pos = RisksStore.individualRiskDetails?.responsible_users?.findIndex(e => e.id == id);
    if (pos != -1)
      return true;
    else
      if (RisksStore.individualRiskDetails?.risk_owner?.id == id)
        return true;
      else
        if (RiskTreatmentStore.riskTreatmentDetails?.responsible_user?.id == id)
          return true
        else {
          var pos2 = RiskTreatmentStore.riskTreatmentDetails?.watchers?.findIndex(v => v.id == id);

          if (pos2 != -1) {
            return true;
          }
          else {
            if (RiskTreatmentStore.riskTreatmentDetails?.created_by?.id == id)
              return true
            else {
              if (RisksStore.individualRiskDetails.created_by.id == id)
                return true;
              else
                return false;
            }

          }

        }

    // else
    //   return false;


  }
  openFormModal() {
    // this.treatmentPopupOpened = true;
    // setTimeout(() => {
    //   $(this.treatmentPopup.nativeElement).modal('show');
    // }, 250);
    this._router.navigateByUrl('/risk-management/risks/' + RisksStore.riskId + '/add-risk-treatment');
  }

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    NoDataItemStore.unsetNoDataItems();
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.closeRiskClicked = false;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    // AppStore.showDiscussion = false;

  }

}
