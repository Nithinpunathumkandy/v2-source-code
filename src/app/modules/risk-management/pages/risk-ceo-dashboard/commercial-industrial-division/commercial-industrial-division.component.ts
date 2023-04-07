import {  ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { RiskCeoDashboardService } from 'src/app/core/services/risk-management/risk-ceo-dashboard/risk-ceo-dashboard.service';
import { RiskStatusService } from 'src/app/core/services/masters/risk-management/risk-status/risk-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { OrganizationLevelSettingsStore, } from 'src/app/stores/settings/organization-level-settings.store';
import { RiskStatusMasterStore } from 'src/app/stores/masters/risk-management/risk-status-store';
import { CeoRiskDashboardStore } from 'src/app/stores/risk-management/risk-ceo-dashboard-store.ts/risk-ceo dashboard-store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthStore } from 'src/app/stores/auth.store';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-commercial-industrial-division',
  templateUrl: './commercial-industrial-division.component.html',
  styleUrls: ['./commercial-industrial-division.component.scss']
})
export class CommercailAndIndustrialDivisionComponent implements OnInit, OnDestroy {
  
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  CeoRiskDashboardStore = CeoRiskDashboardStore;
  RiskStatusMasterStore = RiskStatusMasterStore;
  LikelihoodStore = LikelihoodStore;
  activeRow;
  activeColumn;
  riskChartInfo = "bar";
  showNoDataMap:boolean=false;
  page = 1;
  pageSize = 5;
  selectedIndex: number = 0;
  extreme_count:number = 0;
  significant_count:number = 0;
  high_count:number = 0;
  moderate_count:number = 0;
  low_count:number = 0;

  filterSubscription: Subscription = null;
  reactionDisposer: IReactionDisposer;
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
  };
  
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _riskCeoDashboardService:RiskCeoDashboardService,
    private _riskStatusService: RiskStatusService,
    private _likelihoodService:LikelihoodService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null , submenuItem: { type: 'close', path: "/risk-management/ceo-dashboard" } },    
    
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    
     
    })
    this.getAllDashboardData();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  getRiskTopRisks(){
    this._riskCeoDashboardService.getRisk().subscribe(res=>{

    })
  }

  getSecondTopRisks(){
    this._riskCeoDashboardService.getSecondTopRisk().subscribe(res=>{

    })
  }

  getAllDashboardData(){
    this.getRiskTopRisks();
    this.getSecondTopRisks();
    this.getRiskCountByDepratments();
    this.getRiskCountByInherentRiskRatings();
    this.getRiskCountByResidualRiskRatings();
    this.getRiskHeatMap();
    this.getRiskCount();
  }

  getRiskCount(){
    this._riskCeoDashboardService.getRiskCount().subscribe(res=>{
    })
  }

  getRiskCountByResidualRiskRatings(){
    this._riskCeoDashboardService.getRiskCountByResidualRiskRatings().subscribe(res=>{
      // this.createPieChartForRisk();
    })
  }

  getRiskCountByInherentRiskRatings(){
    this._riskCeoDashboardService.getRiskCountByInherentRiskRatings().subscribe(res=>{
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
      this.getRiskCountBySources();
    })
  }

  getRiskCountBySources(){
    this._riskCeoDashboardService.getRiskCountBySources().subscribe(res=>{
      // this.createBarChartForRisk(1);
    })
  }

  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createPieChartForRisk()
      });
    }, 1000);
  }

  getRiskHeatMap(){
    this._likelihoodService.getItems().subscribe(res=>{
    })

    this._riskCeoDashboardService.getRiskHeatMap().subscribe(res=>{
    })
    this._utilityService.detectChanges(this._cdr);
  }

  getRiskCountByDepratments(){
    this._riskCeoDashboardService.getRiskCountByDepartments().subscribe(res=>{
      this.getCharts();
    })
  }

  createPieChartForRisk() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("commChartdiv", am4charts.PieChart);
    chart.data = CeoRiskDashboardStore.riskCountByDepartments;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RiskRatings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.innerRadius = 90;
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Department Wise";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 20;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "department";
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
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy() {}

}
