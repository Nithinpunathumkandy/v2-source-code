import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';

// amChart imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;

  AuditProgramMasterStore = AuditProgramMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  addAuditProgramEventSubscription: any;
  addAuditProgramObject = {
    component: 'Master',
    values: null,
    type: null
  };

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  programInfoPage = "pie";
  auditHoursInfo = "pie";

  private pieChart: am4charts.PieChart;
  chartStatus: boolean = true;
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _auditProgranService: AuditProgramService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService) { }


  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {

    AppStore.showDiscussion = false;

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.gotoEditPage();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'edit_modal' },
      { type: 'close', path: '../' }
    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    // for closing the modal
    this.addAuditProgramEventSubscription = this._eventEmitterService.addAuditProgramModal.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    // getting details
    this.getAuditProgram();
  }

  getAuditProgram() {
    console.log("Audit program line no 119")
    this._auditProgranService.getItem(AuditProgramMasterStore.auditProgramId).subscribe(res => {
      this.getCharts();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createPieChartForRisk();
        //this.createPieChartForAuditHours();
      });
    }, 1000);
  }




  createPieChartForAuditHours() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("piechartAuditHoursdiv", am4charts.PieChart);

    // Add data
    chart.data = [{
      "audit": "Non Audit Hours",
      "hours": 50
    }, {
      "audit": "Audit Hours",
      "hours": 25
    }];

    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.maxWidth = 100;
    chart.legend.maxHeight = 150;
    chart.legend.scrollable = true;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "hours";
    pieSeries.dataFields.category = "audit";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;

    pieSeries.labels.template.radius = am4core.percent(-40);

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;



    this._utilityService.detectChanges(this._cdr);
  }


  createPieChartForRisk() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("piechartdiv", am4charts.PieChart);
    // Add data
    chart.data = AuditProgramMasterStore.individualAuditProgram.risk_rating_chart_data;
    const chartcolor=AuditProgramMasterStore.individualAuditProgram.risk_rating_chart_data.map(data=>{      
      if(data.color=="light-green"){
        {data.color="#81DF71"}
      }
    })

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RiskRatings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.category = "type";
    pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
    // pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.labels.template.relativeRotation = 90;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;

    pieSeries.labels.template.radius = am4core.percent(-40);

    pieSeries.labels.template.text = "";
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);

    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    this._utilityService.detectChanges(this._cdr);
  }

  // for opening modal
  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.getAuditProgram();
    this.addAuditProgramObject.type = null;
  }

  // edit function
  gotoEditPage() {

    this.addAuditProgramObject.values = {
      id: AuditProgramMasterStore.individualAuditPrograms.id,
      title: AuditProgramMasterStore.individualAuditPrograms.title,
      description: AuditProgramMasterStore.individualAuditPrograms.description,
      from: this._helperService.processDate(AuditProgramMasterStore.individualAuditPrograms.start_date, 'split'),
      to: this._helperService.processDate(AuditProgramMasterStore.individualAuditPrograms.end_date, 'split'),
    }
    this.addAuditProgramObject.type = 'Edit';
    this.openFormModal();

    this._utilityService.detectChanges(this._cdr);
  }

  assignUserValues(user){

    var userInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }

    userInfoObject.first_name = user?.first_name;
    userInfoObject.last_name = user?.last_name;
    userInfoObject.designation = user?.designation;
    userInfoObject.image_token = user?.image.token;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status.id
    userInfoObject.department = null;
     return userInfoObject;

  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

  

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addAuditProgramEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AuditProgramMasterStore.individualLoaded = false;

  }

}


