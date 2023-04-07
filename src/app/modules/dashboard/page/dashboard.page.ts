import { Component, ChangeDetectionStrategy, OnInit, Inject, OnDestroy, ChangeDetectorRef, NgZone, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ITheme } from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { RiskDashboardService } from 'src/app/core/services/risk-management/risk-dashboard/risk-dashboard.service';
import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { IncidentDashBoardStore } from 'src/app/stores/incident-management/incident-dashboard/incident-dashboard.store';
import { IncidentDshboardService } from 'src/app/core/services/incident-management/incident-dash-board/incident-dshboard.service';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';

import { ControlStore } from "src/app/stores/bpm/controls/controls.store";
import { ControlsService } from "src/app/core/services/bpm/controls/controls.service";

import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { IssueListService } from "src/app/core/services/organization/context/issue-list/issue-list.service";

import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';

import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';

import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import {AuditStore} from 'src/app/stores/internal-audit/audit/audit-store';

import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import {AuditFindingsStore} from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';

import { AppStore } from 'src/app/stores/app.store';

import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import {DocumentsStore} from 'src/app/stores/knowledge-hub/documents/documents.store';

import { ComplianceDashboardService } from 'src/app/core/services/compliance-management/compliance-dashboard/compliance-dashboard.service';
import { ComplianceDashboardStore } from 'src/app/stores/compliance-management/compliance-dashboard/compliance-dashboard-store';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { AuthStore } from 'src/app/stores/auth.store';

import { ComplianceRegisterService } from "src/app/core/services/compliance-management/compliance-register/compliance-register.service";
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { SlaContractService } from "src/app/core/services/compliance-management/sla-contract/sla-contract.service";
import { Router } from '@angular/router';
import { ISMSDashboardStore } from 'src/app/stores/isms/dashboard/isms-dashboard-store';
import { IsmsDashboardService } from 'src/app/core/services/isms/dashboard/isms-dashboard.service';
import { AssetDashboardStore } from 'src/app/stores/asset-management/asset-dashboard/asset-dashboard-store';
import { AssetDashboardService } from 'src/app/core/services/asset-management/asset-dashboard/asset-dashboard.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-dashboard-page',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild('riskchartdiv') riskchartdiv: ElementRef;
  @ViewChild('ibarChart1') ibarChart1: ElementRef;
  @ViewChild('ibarChart2') ibarChart2: ElementRef;
  @ViewChild('ibarChart3') ibarChart3: ElementRef;
  @ViewChild('chartdivcompliancestatus') chartdivcompliancestatus: ElementRef;
  @ViewChild('chartdivsladocumentstatus') chartdivsladocumentstatus: ElementRef;
  @ViewChild('IsmsInherentRatings') IsmsInherentRatings: ElementRef;
  @ViewChild('chartAssetCriticalityRating') chartAssetCriticalityRating: ElementRef;


    ISMSDashboardStore = ISMSDashboardStore;
    AssetDashboardStore = AssetDashboardStore;

    RiskDashboardStore = RiskDashboardStore;
    OrganizationModulesStore = OrganizationModulesStore;
    IncidentDashBoardStore = IncidentDashBoardStore;
    ComplianceRegisterStore = ComplianceRegisterStore;
    SLAContractStore = SLAContractStore;
    ThemeStructureSettingStore = ThemeStructureSettingStore;
    ProcessStore = ProcessStore;
    ControlStore = ControlStore;
    IssueListStore = IssueListStore;
    MeetingsStore = MeetingsStore;
    UsersStore = UsersStore;
    IncidentStore = IncidentStore;
    AuditStore = AuditStore;
    AuditFindingsStore = AuditFindingsStore;
    DocumentsStore = DocumentsStore;
    AppStore = AppStore;
    AuthStore = AuthStore;
    ComplianceDashboardStore = ComplianceDashboardStore;
    extreme_count:number = 0;
    significant_count:number = 0;
    high_count:number = 0;
    moderate_count:number = 0;
    low_count:number = 0;
    showPieNoDataMap: boolean = false;
    showPieNoDataMapISMSRisk: boolean = false;
    showPieNoDataMapCriticalRating:boolean=false;
    showSlaPieNoDataMap: boolean = false;
    showCompPieNoDataMap: boolean = false;
    riskPieChartInfo = "pie";
    complianceStatusPieChart = "pie";
    slaDocumentStatusPieChart="pie";
    noDataSource = "pie";
    assetCriticalityRatingPieChart = "pie";
    Dashboard_loader: boolean = false;
    clientOptions: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: true,
        pullDrag: false,
        dots: true,
        navSpeed: 700,
        autoplay: true,
        navText: ['<', '>'],
        responsive: {
          0: {
            items: 1,
          },
          400: {
            items: 1,
          },
          740: {
            items: 1,
          },
          940: {
            items: 1,
          },
        },
        nav: false,
        rtl: AuthStore.user.language.is_rtl ? true : false
      };
    incidentDashboard = 1;
    reactionDisposer: IReactionDisposer;
    constructor(
        @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
        private _rightSidebarFilterService: RightSidebarFilterService,
        private _riskDashboardService:RiskDashboardService, private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef, private _incidentDashboardService: IncidentDshboardService, 
        private _processService: ProcessService, private _controlService: ControlsService,
        private _issueListService: IssueListService, private _meetingsService: MeetingsService,
        private _usersService: UsersService, private _incidentService: IncidentService,
        private _auditService: AuditService, private _findingsService: AuditFindingsService,
        private _documentsService: DocumentsService, private _complianceDashboardService: ComplianceDashboardService,
        private _themestructureService: ThemeStructureSettingsService, private _helperService: HelperServiceService,
        private _slaContractsService: SlaContractService, private _complianceRegisterService: ComplianceRegisterService,
        private _ismsDashboardService: IsmsDashboardService,private _router: Router,
        private _assetDashboardService: AssetDashboardService,
    ) { }

    // Run the function only in the browser
    browserOnly(f: () => void) {
        if (isPlatformBrowser(this.platformId)) {
        this.zone.runOutsideAngular(() => {
            f();
        });
        }
    }

    ngOnInit() {
      AppStore.showDiscussion = false;
      AppStore.showTutorial = false;
      this.incidentDashboard = 1;
      this.showPieNoDataMap = false;
      this.reactionDisposer = autorun(() => {
        if(toJS(AuthStore.userPermissions).length > 0) {
          this.getListAPIs();
          if(AuthStore.getActivityPermission(100,'INCIDENT_DASHBOARD_COUNT_BY_MONTH')) this.incidentDashboard = 1;
          else if(AuthStore.getActivityPermission(100,'INCIDENT_DASHBOARD_COUNT_BY_YEAR')) this.incidentDashboard = 2;
          else if(AuthStore.getActivityPermission(100,'INCIDENT_DASHBOARD_COUNT_BY_DEPARTMENT')) this.incidentDashboard = 3;
          else this.incidentDashboard = null;
          setTimeout(() => {
            this.getChartApis();
           this.Dashboard_loader = true;
          }, 100);
        }
      })
      this._utilityService.detectChanges(this._cdr);
    }
  

    getListAPIs(){
      if(AuthStore.getActivityPermission(100,'CONTROL_LIST')) this.getControls();
      if(AuthStore.getActivityPermission(100,'PROCESS_LIST')) this.getProcesses();
      if(AuthStore.getActivityPermission(100,'ORGANIZATION_ISSUE_LIST')) this.getIssues();
      if(AuthStore.getActivityPermission(100,'MEETING_LIST')) this.getMeetings();
      if(AuthStore.getActivityPermission(100,'AUDIT_LIST')) this.getAudits();
      if(AuthStore.getActivityPermission(100,'USER_LIST')) this.getUsers();
      if(AuthStore.getActivityPermission(100,'FINDING_LIST')) this.getFindings();
      if(AuthStore.getActivityPermission(100,'INCIDENT_LIST')) this.getIncidents();
      if(AuthStore.getActivityPermission(100,'COMPLIANCE_REGISTER_LIST')) this.getCompliance();
      if(AuthStore.getActivityPermission(100,'SERVICE_LEVEL_AGREEMENT_AND_CONTRACT_LIST')) this.getSLaContracts();
      if(AuthStore.getActivityPermission(100,'DOCUMENT_LIST')) this.getDocuments(); 
    }

    ngAfterViewInit(){
      setTimeout(() => {
        if(!ThemeStructureSettingStore.structureDetails && !ThemeStructureSettingStore.structureDetailsById){
          this._themestructureService.getItems().subscribe(() => {
            this._themestructureService.getItemsById(ThemeStructureSettingStore.structureDetails[0]?.id).subscribe(() => {
              this.getCharts();
              this.getChartApis();
            });
          })
        }
        else{
          this.getChartApis();
          this.getCharts();
        }
      }, 1000);
    }

    getChartApis(){
      this.getRiskDetails();
      this.getSecondRiskDetails();
      this.getIsmsRisk()
      if(AuthStore.getActivityPermission(100,'DASHBOARD_ISMS_RISK_COUNT'))this.getIsmsRiskCount();
      this.getIsmsInherentRating()
      this.getAssetCriticalityRating()
      if(AuthStore.getActivityPermission(100,'ASSET_DASHBOARD_COUNT')) this.getAssetCount();
      if(AuthStore.getActivityPermission(100,'DASHBOARD_RISK_COUNT_BY_STATUSES')) this.getRiskCount();
      if(AuthStore.getActivityPermission(100,'DASHBOARD_RISK_COUNT_BY_INHERENT_RISK_RATINGs')) this.getRiskCountByInherentRiskRatings();
      if(AuthStore.getActivityPermission(100,'INCIDENT_DASHBOARD_COUNT_BY_MONTH')) this.getIncidentCountByMonths(1);
      if(AuthStore.getActivityPermission(100,'INCIDENT_DASHBOARD_COUNT_BY_YEAR')) this.getIncidentCountByYears()
      if(AuthStore.getActivityPermission(100,'INCIDENT_DASHBOARD_COUNT_BY_DEPARTMENT')) this.getIncidentCountByDepartments();
      if(AuthStore.getActivityPermission(100,'DASHBOARD_SLA_AND_CONTRACT_STATUS')) this.getSlaContractDocumentStatus();
      if(AuthStore.getActivityPermission(100,'DASHBOARD_COMPLIANCE_STATUS')) this.getComplianceStatusByStatus();
      this.getCharts();
    }

    getProcesses(){
      ProcessStore.setCurrentPage(1);
      this._processService.getAllItems(false,null).subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
    }

    getControls(){
      ControlStore.setCurrentPage(1);
      this._controlService.getAllItems().subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
    }

    getIssues(){
      IssueListStore.setCurrentPage(1);
      this._issueListService.getItems(false,null).subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
    }

    getMeetings(){
      MeetingsStore.setCurrentPage(1);
      this._meetingsService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }

    getAudits(){
      AuditStore.setCurrentPage(1);
      this._auditService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }

    getCompliance(){
      ComplianceRegisterStore.setCurrentPage(1);
      this._complianceRegisterService.getItems().subscribe(()=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }

    getSLaContracts(){
      SLAContractStore.setCurrentPage(1);
      this._slaContractsService.getItems().subscribe(()=>{
        this._utilityService.detectChanges(this._cdr)
      })
    }

    getIncidents(){
      IncidentStore.setCurrentPage(1);
      this._incidentService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }

    getFindings(){
      AuditFindingsStore.setCurrentPage(1);
      this._findingsService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }

    getDocuments(){
      this._documentsService.getAccessibleDocuments().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr)
      })
    }

    getUsers(){
      this._usersService.getUserCount().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr)
      })
    }

    getRiskCount(){
        this._riskDashboardService.getRiskCount().subscribe(res=>{
        })
    }

    getRiskDetails(){
        this._riskDashboardService.getRisk().subscribe(res=>{
            this._utilityService.detectChanges(this._cdr);
        })
    }

    getSecondRiskDetails(){
      this._riskDashboardService.getSecondTopRisk().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }

    getComplianceStatusByStatus(){
      this._complianceDashboardService.getComplianceStatusPieGraph().subscribe(res=>{
        this.createPieChartForComplianceStatus();
      })
    }
   
    getSlaContractDocumentStatus(){
      this._complianceDashboardService.getSlaContractDocumentStatus().subscribe(res=>{
        this.createPieChartForSlaDocumentStatus();
      })
    }

    getAssetCount(){
      this._assetDashboardService.getAssetCount().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }

    getIsmsInherentRating(){
      this._ismsDashboardService.getIsmsInherentRating().subscribe((res)=>{
        this.createPieChartForIsmsInherentRating();
      })
    }

    getIsmsRisk(){
      this._ismsDashboardService.getRisk(false, null).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      })
    }

    getIsmsRiskCount(){
      this._ismsDashboardService.getIsmsRiskCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      })
    }

    getAssetCriticalityRating(){
      this._assetDashboardService.getAssetCriticalityRating().subscribe((res)=>{
            this.createPieChartCriticalityRating();
        this._utilityService.detectChanges(this._cdr);
      })
    }

    getIncidentCountByYears(dashboardItem?:number){
      if(AuthStore.getActivityPermission(100,'INCIDENT_DASHBOARD_COUNT_BY_YEAR')){
        if(dashboardItem) this.incidentDashboard = dashboardItem;
        this._incidentDashboardService.getIncidentCountByYears().subscribe((res)=>{
          this._utilityService.detectChanges(this._cdr);
          this.createBarChartForIncident(2)
        }) 
      }
    }
  
    getIncidentCountByMonths(dashboardItem?:number){
      if(AuthStore.getActivityPermission(100,'INCIDENT_DASHBOARD_COUNT_BY_MONTH')){
        if(dashboardItem) this.incidentDashboard = dashboardItem;
        this._incidentDashboardService.getIncidentCountByMonths().subscribe((res)=>{
          this.createBarChartForIncident(1)
          this._utilityService.detectChanges(this._cdr);
        })
      }
    }
  
    getIncidentCountByDepartments(dashboardItem?:number){
      if(AuthStore.getActivityPermission(100,'INCIDENT_DASHBOARD_COUNT_BY_DEPARTMENT')){
        if(dashboardItem) this.incidentDashboard = dashboardItem;
        this._incidentDashboardService.getIncidentCountByDepartments().subscribe((res)=>{
          this.createBarChartForIncident(3)
          this._utilityService.detectChanges(this._cdr);
        }) 
      }
    }

    createPieChartForIsmsInherentRating() {
      am4core.addLicense("CH199714744");
      // Create chart instance
      if(!this.checkDataIsPresent(ISMSDashboardStore.ismsInherentRating,'count')){
        this.showPieNoDataMapISMSRisk=true;
        return
      }else{
        this.showPieNoDataMapISMSRisk=false;
      }
      let chart = am4core.create(this.IsmsInherentRatings?.nativeElement, am4charts.PieChart);
      chart.data = ISMSDashboardStore.ismsInherentRating
      chart.exporting.menu = new am4core.ExportMenu();
      chart.exporting.filePrefix = "risk_rating"
      chart.exporting.menu.align = "right";
      chart.exporting.menu.verticalAlign = "top";
      // Add label
      chart.innerRadius = am4core.percent(50);
      let label = chart.seriesContainer.createChild(am4core.Label);
      label.text = this._helperService.translateToUserLanguage('risk_rating');
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 15;
      chart.legend = new am4charts.Legend();
      chart.legend.labels.template.disabled = true;
      chart.legend.itemContainers.template.togglable = false;
      chart.rtl = AuthStore.user.language.is_rtl ? true : false;
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 11;
      markerTemplate.height = 11;
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "isms_risk_ratings";
      pieSeries.labels.template.text = "";
      pieSeries.slices.template.events.on("hit", this.ismsInherent, this);
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
      this._utilityService.detectChanges(this._cdr);
    }

    ismsInherent(ev){
      ComplianceDashboardStore.setDashboardParam(`&inherent_risk_rating_ids=${ev?.target?.dataItem?.dataContext?.id}`)
      this._router.navigateByUrl('/isms/isms-risks');
    }

    createPieChartCriticalityRating() {
      am4core.addLicense("CH199714744");
      // Create chart instance
      if(!this.checkDataIsPresent(AssetDashboardStore.AssetCriticalityRating,'count')){
        this.showPieNoDataMapCriticalRating=true;
        return
      }else{
        this.showPieNoDataMapCriticalRating=false;
      }
      let chart = am4core.create(this.chartAssetCriticalityRating?.nativeElement, am4charts.PieChart);
      chart.data = AssetDashboardStore.AssetCriticalityRating
  
      chart.legend = new am4charts.Legend();
  
      chart.legend.position = 'bottom'
      chart.legend.valueLabels.template.disabled = true;
      chart.legend.fontSize = 10
      chart.legend.scrollable = true;
      chart.legend.maxHeight = 50;
      chart.legend.valueLabels.template.disabled = true;
      chart.legend.itemContainers.template.togglable = false;
      chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
      chart.legend.valueLabels.template.align = "left"
      chart.legend.valueLabels.template.textAlign = "end"
      chart.legend.itemContainers.template.padding(0, 0, 0, 0);
  
      // chart.legend.labels.template.disabled = true;
      chart.rtl = AuthStore.user.language.is_rtl ? true : false;
  
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 11;
      markerTemplate.height = 11;
      markerTemplate.fontSize = 10;
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.slices.template.propertyFields.fill = "asset_rating_color_code";
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "asset_rating";
      pieSeries.labels.template.text = "";
      pieSeries.labels.template.fontSize =10;
      pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      pieSeries.slices.template.events.on("hit", this.criticalityChartClick,this)
     
      this._utilityService.detectChanges(this._cdr);
      
    }

    criticalityChartClick(event){
      this.AssetDashboardStore.assetDashboardParam = event.target.dataItem.dataContext.id;
      AssetDashboardStore.setDashboardParam('asset_rating_ids='+this.AssetDashboardStore.assetDashboardParam)
        this._router.navigateByUrl('/asset-management/assets');
    }

    createPieChartForComplianceStatus() {
      am4core.addLicense("CH199714744");
      // Create chart instance
      let chart = am4core.create(this.chartdivcompliancestatus?.nativeElement, am4charts.PieChart);
      
     
      if(!this.checkDataIsPresent(ComplianceDashboardStore.ComplianceStatusCountByStatus,'count')){
        this.showCompPieNoDataMap=true;
        return
      }else{
        this.showCompPieNoDataMap=false;
      }
      chart.data = this.processData(ComplianceDashboardStore.ComplianceStatusCountByStatus);
      chart.rtl = AuthStore.user.language.is_rtl ? true : false;
      // Add label
      chart.innerRadius = am4core.percent(50);
      let label = chart.seriesContainer.createChild(am4core.Label);
      label.text = this._helperService.translateToUserLanguage('compliance_status');
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 12;
  
      chart.legend = new am4charts.Legend();
      chart.legend.labels.template.disabled = false;

      chart.legend.position = 'bottom'
      // chart.legend.labels.template.disabled = true;
      chart.legend.fontSize = 10
      chart.legend.maxHeight = 50;
      chart.legend.maxWidth = 50;
      // chart.legend.scrollable = true;
      chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
      chart.legend.labels.template.maxWidth = 100;
      // chart.legend.labels.template.truncate = true;
      chart.legend.labels.template.wrap = true;
      chart.legend.itemContainers.template.togglable = true;
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 13;
      markerTemplate.height = 13;
      chart.legend.marginTop = 15;
      chart.legend.maxHeight = 40;
      chart.legend.valueLabels.template.align = "left"
      chart.legend.valueLabels.template.textAlign = "end"
      chart.legend.itemContainers.template.padding(3,0,3,0);

      // chart.legend.maxWidth = 100;
      // chart.legend.maxHeight = 80;
      // chart.legend.scrollable = true;
      
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "status";
      pieSeries.labels.template.text = "";
      pieSeries.slices.template.events.on("hit", this.complianceStatus, this);
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
      // setTimeout(() => {
      //   ComplianceDashboardStore.dashboardLoaded = true;
      // }, 250);
      this._utilityService.detectChanges(this._cdr);
    }

    complianceStatus(ev){
      ComplianceDashboardStore.setDashboardParam(`&compliance_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
      this._router.navigateByUrl('/compliance-management/compliance-registers');
    }

    createPieChartForSlaDocumentStatus() {
      am4core.addLicense("CH199714744");
      // Create chart instance
      let chart = am4core.create(this.chartdivsladocumentstatus?.nativeElement, am4charts.PieChart);
      if(!this.checkDataIsPresent(ComplianceDashboardStore.SlaContractDocumentStatus,'count')){
        this.showSlaPieNoDataMap=true;
        return
      }else{
        this.showSlaPieNoDataMap=false;
      }
      chart.data = this.processData(ComplianceDashboardStore.SlaContractDocumentStatus);
      chart.rtl = AuthStore.user.language.is_rtl ? true : false;
      chart.legend = new am4charts.Legend();
      chart.legend.labels.template.disabled = false;
      chart.legend.position = 'bottom'
      // chart.legend.labels.template.disabled = true;
      chart.legend.fontSize = 10
      chart.legend.maxHeight = 50;
      chart.legend.maxWidth = 50;
      // chart.legend.scrollable = true;
      chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
      chart.legend.valueLabels.template.align = "left"
      chart.legend.valueLabels.template.textAlign = "end"
      chart.legend.itemContainers.template.padding(0, 0, 0, 0);
      chart.legend.labels.template.maxWidth = 100;
      // chart.legend.labels.template.truncate = true;
      chart.legend.labels.template.wrap = true;
      chart.legend.itemContainers.template.togglable = true;

      

      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 11;
      markerTemplate.height = 11;
      
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "title";
      pieSeries.labels.template.text = "";
      // pieSeries.slices.template.events.on("hit", this.slaStatus, this);
      this._utilityService.detectChanges(this._cdr);
    }

    // slaStatus(ev){
    //   SLAContractStore.setDashboardParam(`&sla_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    //   this._router.navigateByUrl('/compliance-management/sla-and-contracts');
    // }

    checkDataIsPresent(dataArray:any[],field){
      if(dataArray.length > 0){
        let dataNotPresent = 0;
        for(let i of dataArray){
          if(i[field] == 0) dataNotPresent++;
        }
        if(dataNotPresent == dataArray.length) return false;
        else return true;
      }
      else{
        return false;
      }
    }

    createBarChartForIncident(filter:number = 1){
      let x;
      let y;
      am4core.addLicense("CH199714744");
      let chartItem = filter == 1 ? this.ibarChart1?.nativeElement : filter == 2 ? this.ibarChart2?.nativeElement : this.ibarChart3?.nativeElement;
      let chart = am4core.create(chartItem, am4charts.XYChart);
      if(filter == 1){
        chart.data = IncidentDashBoardStore.incidentCountByMonths
        y = "total_count"
        x = 'month'
      }
      if(filter == 2){
        chart.data = IncidentDashBoardStore.incidentCountByYears
        y = "total_count"
        x = 'year'
      }
      if(filter == 3){
        chart.data = IncidentDashBoardStore.incidentCountByDepartments
        y = "count"
        x = 'department_code'
      }
      
      chart.numberFormatter.numberFormat = "#";
      
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = x;
      categoryAxis.fontSize = 12;
  
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 15;
      categoryAxis.renderer.cellStartLocation = 0.4;
      categoryAxis.renderer.cellEndLocation = 0.6;
      chart.exporting.menu = new am4core.ExportMenu();
      chart.exporting.filePrefix = "Incident"
      chart.exporting.menu.align = "right";
      chart.exporting.menu.verticalAlign = "top";
      chart.rtl = AuthStore.user.language.is_rtl ? true : false;
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.fontSize = 12;
  
  
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = y;
      series.dataFields.categoryX = x;
      series.name = "Visits";
      // series.columns.template.stroke =filter==1? am4core.color("#4670C0"):filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
      // series.columns.template.fill = filter==1? am4core.color("#4670C0"):filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = 1;
      if(ThemeStructureSettingStore?.structureDetails?.length > 0 && ThemeStructureSettingStore?.structureDetails[0]?.hasOwnProperty('bar_chart_color') && ThemeStructureSettingStore?.structureDetails[0]?.bar_chart_color){
        series.columns.template.fill = am4core.color(ThemeStructureSettingStore.structureDetails[0].bar_chart_color);
        series.columns.template.stroke = am4core.color(ThemeStructureSettingStore.structureDetails[0].bar_chart_color);
      } 
      if(filter == 1){
        series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
        series.columns.template.events.on("hit",this.monthsChartClick,this)
       }
       if(filter == 2){
        series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
        series.columns.template.events.on("hit",this.yearChartClick,this)
       }
       if(filter == 3){
        series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
        series.columns.template.events.on("hit",this.departmentChartClick,this)
       }
      
      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      
      this._utilityService.detectChanges(this._cdr);
    }

    monthsChartClick(event){
      this.IncidentDashBoardStore.incidentDashboardParam = event.target.column.dataItem.dataContext.month_num;
      IncidentDashBoardStore.setIncidentDashboardParam('&month='+this.IncidentDashBoardStore.incidentDashboardParam)
        this._router.navigateByUrl('/incident-management/incidents');
    }
  
    yearChartClick(event){
      this.IncidentDashBoardStore.incidentDashboardParam = event.target.column.dataItem.dataContext.year;
      IncidentDashBoardStore.setIncidentDashboardParam('&year='+this.IncidentDashBoardStore.incidentDashboardParam)
        this._router.navigateByUrl('/incident-management/incidents');
    }
  
    departmentChartClick(event){
      this.IncidentDashBoardStore.incidentDashboardParam = event.target.column.dataItem.dataContext.id;
      IncidentDashBoardStore.setIncidentDashboardParam('&department_ids='+this.IncidentDashBoardStore.incidentDashboardParam)
        this._router.navigateByUrl('/incident-management/incidents');
    }

    calculatePercentage(count,total){
        if(count)
            return (count/total) * 100;
        else return 0;
    }

    processData(dataArray){
      for(var i of dataArray){
              let c = i.label.split('-');
              i['color'] = c[0];
              }
      return dataArray;
    } 

    getCharts() {
      setTimeout(() => {
        // Chart code goes in here
        let theme = 'am4themes_animated';
        if(ThemeStructureSettingStore.structureDetailsById) theme = ThemeStructureSettingStore.structureDetailsById.charts_theme;
        let iTheme: ITheme = this._helperService.getThemes(theme);
        this.browserOnly(() => {
          am4core.useTheme(iTheme);
          // this.createPieChartForComplianceStatus();
          // this.createBarChartForIncident(1);
          // this.createPieChartForRisk();
          // this.createPieChartForSlaDocumentStatus();
        });
      }, 1000);
    }


    getRiskCountByInherentRiskRatings(){
        this._riskDashboardService.getRiskCountByInherentRiskRatings().subscribe(res=>{
          if(!this.checkDataIsPresent(RiskDashboardStore.riskCountByInherentRiskRatings,'count')){
            this.showPieNoDataMap=true;
            return
          }else{
            this.showPieNoDataMap=false;
          }
          if(res.length!=0){
            res.forEach(element=>{
              if(element.id==1){
                this.extreme_count = element.count
              }
              if(element.id==2){
                this.significant_count = element.count
              }
              if(element.id==3){
                this.high_count = element.count
              }
              if(element.id==4){
                this.moderate_count = element.count
              }
              if(element.id==5){
                this.low_count = element.count
              }
            })
          }else{
            this.extreme_count= 0;
            this.significant_count= 0;
            this.high_count= 0;
            this.moderate_count= 0;
            this.low_count= 0;
          }
          this.createPieChartForRisk();
          // this.getCharts();
        })
    }

    createPieChartForRisk() {
        am4core.addLicense("CH199714744");
        // Create chart instance
        let chart = am4core.create(this.riskchartdiv?.nativeElement, am4charts.PieChart);
        
        // Add data
        // chart.data = [
        //   { "text": "Very High", "value": 6.6, "color": "red" },
        //   { "text": "High", "value": 0.6, "color": "orange" },
        //   { "text": "Medium", "value": 23.2, "color": "yellow" },
        //   { "text": "Low", "value": 2.2, "color": "#18e309" }
        // ];
        chart.data = RiskDashboardStore.riskCountByInherentRiskRatings;
        // for exporting the data
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.filePrefix = "RiskRatings"
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";
        chart.rtl = AuthStore.user.language.is_rtl ? true : false;
        // Add label
        chart.innerRadius = am4core.percent(50);
      
        let label = chart.seriesContainer.createChild(am4core.Label);
        label.text = this._helperService.translateToUserLanguage('risk_zone');
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 20;
    
        chart.legend = new am4charts.Legend();
        chart.legend.labels.template.disabled = true;
        let markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 11;
        markerTemplate.height = 11;
        
        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.slices.template.propertyFields.fill = "color";
        pieSeries.dataFields.value = "count";
        pieSeries.dataFields.category = "risk_ratings";
        // pieSeries.dataFields.radiusValue = '10';
        pieSeries.labels.template.text = "";
        // pieSeries.labels.template.propertyFields.fontSize = '50';
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
        // setTimeout(() => {
        //   RiskDashboardStore.dashboardLoaded = true;
        // }, 250);
        this._utilityService.detectChanges(this._cdr);
      }

      redirectToListPage(status, count:number=0){
        if(count!=0){
          switch (status) {
            case 'users':
              this._router.navigateByUrl('/human-capital/users');
              break;
            case 'processes':
              this._router.navigateByUrl('/bpm/process');
              break;
            case 'controls':
              this._router.navigateByUrl('/bpm/controls');
              break;
            case 'documents':
              this._router.navigateByUrl('/knowledge-hub/documents');
              break;
            case 'issues':
              this._router.navigateByUrl('/organization/context/issue-lists');
              break;
            case 'meetings':
              this._router.navigateByUrl('/mrm/meetings');
              break;
            case 'total_risks':
              this._router.navigateByUrl('/risk-management/risks');
              break;
            case 'audits':
              this._router.navigateByUrl('/internal-audit/audits');
              break;
            case 'findings':
              this._router.navigateByUrl('/internal-audit/findings');
              break;
            case 'incidents':
              this._router.navigateByUrl('/incident-management/incidents');
              break;
            case 'compliance':
              this._router.navigateByUrl('/compliance-management/compliance-registers');
              break;
            case 'sla_contracts':
              this._router.navigateByUrl('/compliance-management/sla-and-contracts');
              break;
              case 'isms_total_risks':
              this._router.navigateByUrl('isms/corporate-isms-risks');
              break;
              case 'asset_total':
              this._router.navigateByUrl('asset-management/assets');
              break;
            default:
              break;
          }
          }
      }

    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      this._rightSidebarFilterService.resetFilter();
      am4core.disposeAllCharts();
      SLAContractStore.unsetSLAContracts();
    }
}
