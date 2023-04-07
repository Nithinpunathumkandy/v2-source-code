import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ITheme } from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ComplianceDashboardService } from 'src/app/core/services/compliance-management/compliance-dashboard/compliance-dashboard.service';
import { ComplianceDashboardStore } from 'src/app/stores/compliance-management/compliance-dashboard/compliance-dashboard-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UserAclService } from 'src/app/core/services/human-capital/user/user-setting/user-acl/user-acl.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compliance-dashboard',
  templateUrl: './compliance-dashboard.component.html',
  styleUrls: ['./compliance-dashboard.component.scss']
})
export class ComplianceDashboardComponent implements OnInit {
  @ViewChild('chartElementForRequirement') chartElementForRequirement: ElementRef<HTMLElement>;
  @ViewChild('chartElementForCompliance') chartElementForCompliance: ElementRef<HTMLElement>;
  @ViewChild('chartElementForSlaContract') chartElementForSlaContract: ElementRef<HTMLElement>;
 
  complianceStatusPieChart = "pie";
  complianceStatusChart = "bar";
  slaCategoryPieChart="pie";
  slaDocumentStatusPieChart="pie";
  complianceChart="bar";
  slaContractChart="bar";

  showSlaContractNoDataMap: boolean = false;
  showSlaStatusPieNoDataMap: boolean = false;
  showComplianceNoDataMap: boolean = false;
  showContractPieNoDataMap: boolean = false;
  showPieNoDataMap:boolean =false;
  showNoDataMap:boolean=false;
  showNoComplianceByProducts: boolean = false;
  showNoSlaByProducts: boolean = false;
  filterSubscription: Subscription = null;

  reactionDisposer:IReactionDisposer;

  ComplianceDashboardStore = ComplianceDashboardStore;
  OrganizationModulesStore = OrganizationModulesStore;
  AuthStore = AuthStore;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
              private _complianceDashboardService:ComplianceDashboardService,
              private _utilityService:UtilityService,
              private _cdr:ChangeDetectorRef, 
              private _router: Router,
              private _themestructureService: ThemeStructureSettingsService,
              private _helperService: HelperServiceService,
              private _eventEmitterService: EventEmitterService,
              private _rightSidebarFilterService: RightSidebarFilterService,
              private _userAclService: UserAclService) { }

   // Run the function only in the browser
   browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(){
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ComplianceDashboardStore.dashboardLoaded = false;
      this.getComplianceCount();
      this.getComplianceStatusByStatus();
      this.getSlaContractByCategory();
      this.getSlaContractDocumentStatus();
      this.getComplianceRequirementType();
      this.getComplianceForCompliance();
      this.getSlaForContract();
      this.getSlaByProducts();
      this.getComplianceByProducts();
      setTimeout(() => {
        ComplianceDashboardStore.dashboardLoaded = true;
        }, 1000);
    })
    // this.showSlaContractNoDataMap = false;
    this.showSlaStatusPieNoDataMap = false;
    this.showComplianceNoDataMap = false;
    this.showContractPieNoDataMap = false;
    this.showPieNoDataMap =false;
    this.showNoDataMap=false;
    // this.reactionDisposer = autorun(() =>{
    //   if(AuthStore.userPermissions){
    //     this.getAll();
    //     this.getCharts();
    //   //   setTimeout(() => {
    //   //     if(RightSidebarLayoutStore.filterPageTag != 'compliance_dashboard'){
    //   //       RightSidebarLayoutStore.filterPageTag = 'compliance_dashboard';
    //   //       this._rightSidebarFilterService.setFiltersForCurrentPage([
    //   //         'organization_ids',
    //   //         'division_ids',
    //   //         'department_ids',
    //   //         'section_ids',
    //   //         'sub_section_ids',
    //   //       ]);
    //   //       this._utilityService.detectChanges(this._cdr);
    //   //     }
    //   //   }, 5000);
    //   }
    // })
    setTimeout(() => {
			ComplianceDashboardStore.dashboardLoaded = true;
		  }, 500);
    this._utilityService.detectChanges(this._cdr);

    // RightSidebarLayoutStore.filterPageTag = 'compliance_dashboard';
    // this._rightSidebarFilterService.setFiltersForCurrentPage([
    //   'organization_ids',
    //   'division_ids',
    //   'department_ids',
    //   'section_ids',
    //   'sub_section_ids',
    // ]);
  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      RightSidebarLayoutStore.filterPageTag = 'compliance_dashboard';
      this._rightSidebarFilterService.setFiltersForCurrentPage([
        'organization_ids',
        'division_ids',
        'department_ids',
        'section_ids',
        'sub_section_ids',
      ]);
      this._utilityService.detectChanges(this._cdr);
    }, 1000);
    setTimeout(() => {
      if(!ThemeStructureSettingStore.structureDetails && !ThemeStructureSettingStore.structureDetailsById){
        this._themestructureService.getItems().subscribe(() => {
          this._themestructureService.getItemsById(ThemeStructureSettingStore.structureDetails[0]?.id).subscribe(() => {
            this.getAll();
            this.getCharts();
          });
        })
      }
      else{
        this.getAll();
        this.getCharts();
      }
    }, 1000);
  }
  
  getCharts() {
    setTimeout(() => {
    //   // Chart code goes in here
    let theme = 'am4themes_animated';
      if(ThemeStructureSettingStore.structureDetailsById) theme = ThemeStructureSettingStore.structureDetailsById.charts_theme;
      let iTheme: ITheme = this._helperService.getThemes(theme);
      this.browserOnly(() => {
        am4core.useTheme(iTheme);
        // this.createPieChartForComplianceStatus();
        // this.createPieChartForSlaContractCategory();
        // this.createPieChartForSlaDocumentStatus();
        // this.createBarChartForRequirementType();
        // this.createBarChartForCompliance();
        // this.createBarChartForSlaContract();
        
      });
    }, 1000);
   
  }

  getAll() {
    if(AuthStore.userPermissionsLoaded){
      if(AuthStore.getActivityPermission(2500,'DASHBOARD_COMPLIANCE_COUNTS')) this.getComplianceCount();
      if(AuthStore.getActivityPermission(2500,'DASHBOARD_COMPLIANCE_STATUS')) this.getComplianceStatusByStatus();
      if(AuthStore.getActivityPermission(2500,'DASHBOARD_SLA_AND_CONTRACT_BY_CATEGORY')) this.getSlaContractByCategory();
      if(AuthStore.getActivityPermission(2500,'DASHBOARD_SLA_AND_CONTRACT_STATUS')) this.getSlaContractDocumentStatus();
      if(AuthStore.getActivityPermission(2500,'DASHBOARD_COMPLIANCE_REQUIREMENT_TYPE')) this.getComplianceRequirementType();
      if(AuthStore.getActivityPermission(2500,'DASHBOARD_COMPLIANCE_PER_DEPARTMENT')) this.getComplianceForCompliance();
      if(AuthStore.getActivityPermission(2500,'DASHBOARD_SLA_AND_CONTRACT_PER_DEPARTMENT')) this.getSlaForContract();
      this.getLevelOfCompliance();
      this.getSlaByProducts();
      this.getComplianceByProducts();
      this.getCharts();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 1000);
    }
    else{
      this._userAclService.getUserActivityPermissions().subscribe(res=>{
        setTimeout(() => {
          this.getAll();
          this._utilityService.detectChanges(this._cdr);
        }, 100);
      });
    }
  }

  getComplianceCount(){
    this._complianceDashboardService.getComplianceCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getComplianceStatusByStatus(){
    this._complianceDashboardService.getComplianceStatusPieGraph().subscribe(res=>{
      setTimeout(() => {
        // Chart code goes in here
        // this.browserOnly(() => {
        //   am4core.useTheme(am4themes_animated);
          this.createPieChartForComplianceStatus();

        // });
      }, 1000);
      ComplianceDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);

    })
   
  }
  getSlaContractByCategory(){
    this._complianceDashboardService.getSlaContractByCategory().subscribe(res=>{
      // this.createBarChartForSlaContract();
      // this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        // Chart code goes in here
        // this.browserOnly(() => {
        //   am4core.useTheme(am4themes_animated);
          this.createPieChartForSlaContractCategory();

        // });
      }, 1000);
      ComplianceDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getSlaContractDocumentStatus(){
    this._complianceDashboardService.getSlaContractDocumentStatus().subscribe(res=>{
      // this.createPieChartForSlaDocumentStatus();
      // this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        // Chart code goes in here
        // this.browserOnly(() => {
        //   am4core.useTheme(am4themes_animated);
          this.createPieChartForSlaDocumentStatus();

        // });
      }, 1000);
      ComplianceDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getComplianceRequirementType(){
    this._complianceDashboardService.getComplianceRequirementType().subscribe(res=>{
      // this.createBarChartForRequirementType();
      // this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        // Chart code goes in here
        // this.browserOnly(() => {
        //   am4core.useTheme(am4themes_animated);
          this.createBarChartForRequirementType();

        // });
      }, 1000);
      ComplianceDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getComplianceForCompliance(){
    this._complianceDashboardService.getComplianceForCompliance().subscribe(res=>{
      // this.createBarChartForCompliance();
      // this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        // Chart code goes in here
        // this.browserOnly(() => {
        //   am4core.useTheme(am4themes_animated);
          this.createBarChartForCompliance();

        // });
      }, 1000);
      ComplianceDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getSlaForContract(){
    this._complianceDashboardService.getSlaForContract().subscribe(res=>{
      // this.createBarChartForSlaContract();
      // this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        // Chart code goes in here
        // this.browserOnly(() => {
        //   am4core.useTheme(am4themes_animated);
          this.createBarChartForSlaContract();

        // });
      }, 1000);
      ComplianceDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getLevelOfCompliance(){
    this._complianceDashboardService.getLevelOfCompliance().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getComplianceByProducts(){
    this._complianceDashboardService.getComplianceByProducts().subscribe(res=>{
      setTimeout(() => {
        ComplianceDashboardStore.dashboardLoaded = true;
        this.createPieChartForComplianceByProducts();

      }, 1000);
    })
  }

  getSlaByProducts(){
    this._complianceDashboardService.getSlaByProducts().subscribe(res=>{
      setTimeout(() => {
        ComplianceDashboardStore.dashboardLoaded = true;
        this.createPieChartForSlaByProducts()

      }, 1000);
      
    })
  }
 

  
  processData(dataArray){
    for(var i of dataArray){
            let c = i.label.split('-');
            i['color'] = c[0];
            }
    return dataArray;
    } 

    processAxis(dataArray){
      for(var i of dataArray){
              let c = i.month.substring(0,3).split('-');
              i['month'] = c[0];
              }
      return dataArray;
      } 

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

    createPieChartForComplianceByProducts(){
      am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ComplianceDashboardStore.complianceByProducts,'count')){
      this.showNoComplianceByProducts=true;
      return
    }else{
      this.showNoComplianceByProducts=false;
    }
    let chart = am4core.create("chartdivcomplianceProduct", am4charts.PieChart);

    chart.data = ComplianceDashboardStore.complianceByProducts;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('compliance_by_products');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    // label.fontSize = 10;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom"
    chart.legend.fontSize = 10
    chart.legend.marginTop = 15;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.labels.template.wrap = true;
    chart.legend.itemContainers.template.togglable = true 
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;

    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
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

    chart.events.on("sizechanged", function(ev) {
      var scale = (pieSeries.pixelInnerRadius * 2) / label.bbox.width;
      if (scale > 1) {
        scale = 1;
      }
      label.scale = scale;
    })
    // setTimeout(() => {
    //   ComplianceDashboardStore.dashboardLoaded = true;
    // }, 250);
    this._utilityService.detectChanges(this._cdr);
    }

    createPieChartForSlaByProducts(){
      am4core.addLicense("CH199714744");
      // Create chart instance
      if(!this.checkDataIsPresent(ComplianceDashboardStore.slaByProducts,'count')){
        this.showNoSlaByProducts=true;
        return
      }else{
        this.showNoSlaByProducts=false;
      }
      let chart = am4core.create("chartdivSlaProduct", am4charts.PieChart);

      chart.data = ComplianceDashboardStore.slaByProducts;
      chart.rtl = AuthStore.user.language.is_rtl ? true : false;
      // Add label
      chart.innerRadius = am4core.percent(50);
      let label = chart.seriesContainer.createChild(am4core.Label);
      label.text = this._helperService.translateToUserLanguage('sla_by_products');
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      // label.fontSize = 9;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom"
      chart.legend.fontSize = 10
      chart.legend.marginTop = 15;
      chart.legend.maxHeight = 40;
      chart.legend.scrollable = true;
      chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
      chart.legend.valueLabels.template.align = "left"
      chart.legend.valueLabels.template.textAlign = "end"
      chart.legend.itemContainers.template.padding(3,0,3,0);
      chart.legend.labels.template.wrap = true;
      chart.legend.itemContainers.template.togglable = true 
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 13;
      markerTemplate.height = 13;
      markerTemplate.fontSize = 10;  
      
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "title";
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

      chart.events.on("sizechanged", function(ev) {
        var scale = (pieSeries.pixelInnerRadius * 2) / label.bbox.width;
        if (scale > 1) {
          scale = 1;
        }
        label.scale = scale;
      })
      // setTimeout(() => {
      //   ComplianceDashboardStore.dashboardLoaded = true;
      // }, 250);
      this._utilityService.detectChanges(this._cdr);
    } 

  createPieChartForComplianceStatus() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ComplianceDashboardStore.ComplianceStatusCountByStatus,'count')){
      this.showPieNoDataMap=true;
      return
    }else{
      this.showPieNoDataMap=false;
    }
    let chart = am4core.create("chartdivcompliancestatus", am4charts.PieChart);

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
    chart.legend.position = "bottom"
    chart.legend.fontSize = 10
    chart.legend.marginTop = 15;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "status";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.complianceStatusClick,this)
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

  complianceStatusClick(ev) {
    ComplianceDashboardStore.setDashboardParam(`&compliance_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/compliance-management/compliance-registers');
  }

  createPieChartForSlaContractCategory() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ComplianceDashboardStore.SlaContractByCategory,'count')){
      this.showContractPieNoDataMap=true;
      return
    }else{
      this.showContractPieNoDataMap=false;
    }
    let chart = am4core.create("chartdivslabycategory", am4charts.PieChart);
    
    chart.data = ComplianceDashboardStore.SlaContractByCategory;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom"
    chart.legend.fontSize = 10
    chart.legend.marginTop = 15;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
   
    this._utilityService.detectChanges(this._cdr);
  }

  createPieChartForSlaDocumentStatus() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ComplianceDashboardStore.SlaContractDocumentStatus,'count')){
      this.showSlaStatusPieNoDataMap=true;
      return
    }else{
      this.showSlaStatusPieNoDataMap=false;
    }
    let chart = am4core.create("chartdivsladocumentstatus", am4charts.PieChart);
    chart.data = this.processData(ComplianceDashboardStore.SlaContractDocumentStatus);
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom"
    chart.legend.fontSize = 10
    chart.legend.marginTop = 15;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.labels.template.wrap = true;
    chart.legend.itemContainers.template.togglable = true 
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
   
    this._utilityService.detectChanges(this._cdr);
  }
  createBarChartForRequirementType(){
    am4core.addLicense("CH199714744");

    if(ComplianceDashboardStore.ComplianceRequirementType.length==0){
      this.showNoDataMap=true;
      return
    }else{
      this.showNoDataMap=false;
    }
    let chart = am4core.create('barChartRequirementType', am4charts.XYChart);
    chart.data = this.processAxis(ComplianceDashboardStore.ComplianceRequirementType);
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    // chart.legend.useDefaultMarker = true;
    chart.legend.position = 'bottom'
    // chart.legend.labels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.maxHeight = 50;
    // chart.legend.scrollable = true;
    // chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    // chart.legend.valueLabels.template.align = "left"
    // chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.labels.template.wrap = true;
    chart.legend.itemContainers.template.togglable = true;

   
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 10;
  
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.title.text = "";
    categoryAxis.fontSize = 10;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "";
    valueAxis.fontSize= 10;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "external";
    series.dataFields.categoryX = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.tooltip.label.wrap = true;
    series.name = "External";
    series.columns.template.width = am4core.percent(50);
    
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "internal";
    series1.dataFields.categoryX = "month";
    series1.name = "Internal";
    series.columns.template.width = am4core.percent(50);
    series1.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series1.columns.template.fillOpacity = 1;

    // Configure axis label
    var label = categoryAxis.renderer.labels.template;
    // label.truncate = true;
    label.maxWidth = 60;
    label.truncate = false;
    label.wrap = true;
    label.tooltipText = "{categoryX}";

    let columnTemplate1 = series.columns.template;
    columnTemplate1.strokeWidth = 4;
    columnTemplate1.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }
  createBarChartForCompliance(){
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(ComplianceDashboardStore.ComplianceChartDetails.length==0){
      this.showComplianceNoDataMap=true;
      return
    }else{
      this.showComplianceNoDataMap=false;
    }
    // this.chartElementForCompliance.nativeElement
    let chart = am4core.create('barChartCompliance', am4charts.XYChart);
    chart.data = ComplianceDashboardStore.ComplianceChartDetails;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "code";
    categoryAxis.title.text = "";
    categoryAxis.fontSize= 10;

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;

    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.fontSize = 10;
    label.tooltipText = "{title}";
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "";
    valueAxis.fontSize=10;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "code";
    series.name = "";
    
    series.columns.template.tooltipText = "{title}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    series.columns.template.events.on("hit",this.complianceClick,this)
  
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  complianceClick(ev) {
    ComplianceDashboardStore.setDashboardParam(`&department_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/compliance-management/compliance-registers');
  }

  createBarChartForSlaContract(){
    am4core.addLicense("CH199714744");
    if(ComplianceDashboardStore.SlaContractChartDetails.length==0){
      this.showSlaContractNoDataMap=true;
      return
    }else{
      this.showSlaContractNoDataMap=false;
    }
    // Create chart instance
    let chart = am4core.create('barChartSlaContract', am4charts.XYChart);
    chart.data = ComplianceDashboardStore.SlaContractChartDetails;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "code";
    categoryAxis.title.text = "";
    categoryAxis.fontSize=10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    // categoryAxis.start = 0.0;
    // categoryAxis.end = 0.75;
    categoryAxis.fontSize= 10;

    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = "{title}";

    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "";
    valueAxis.fontSize= 10;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "code";
    series.name = "";
    
    series.columns.template.tooltipText = "{title}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }
 

  ngOnDestroy(){
    am4core.disposeAllCharts();
    ComplianceDashboardStore.dashboardLoaded = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }
}
