import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { KhDashboardService } from 'src/app/core/services/knowledge-hub/kh-dashboard/kh-dashboard.service';
import { KhDashboardStore } from 'src/app/stores/knowledge-hub/kh-dashboard/kh-dashboard-store'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { autorun, IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/stores/auth.store';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  KhDashboardStore = KhDashboardStore
  AuthStore = AuthStore

  private destroy$=new Subject()  
  reactionDisposer: IReactionDisposer;
  pieChart = "pie";
  showPieChart: boolean = false;

  constructor(
    private router:Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _khDashboardService: KhDashboardService,    
  ) { }

  ngOnInit() {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'document_details' } },
      ]
      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "document_details":
            this.gotoDetails()
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    this.getCounts()
    this.getDocumentByStatuses()
    //this.getDocumentByTypes()
    //this.getDocumentByDepartments()
    //this.getDocumentByCRStatuses()
  }

  getCounts() {
    this._khDashboardService.getDocumentCounts().pipe(takeUntil(this.destroy$)).subscribe(res => {
      console.log(KhDashboardStore.dashboardCount)
    })
  }

  getDocumentByStatuses() {
    this._khDashboardService.getDocumentByStatuses().pipe(takeUntil(this.destroy$)).subscribe(res => {
      setTimeout(() => {
        this.pieChartForStatuses()
      }, 3000)
    })
  }

  getDocumentByTypes() {
    this._khDashboardService.getDocumentByTypes().pipe(takeUntil(this.destroy$)).subscribe(res => {

    })
  }

  getDocumentByDepartments() {
    this._khDashboardService.getDocumentByDepartments().pipe(takeUntil(this.destroy$)).subscribe(res => {

    })
  }

  getDocumentByCRStatuses() {
    this._khDashboardService.getDocumentByCRStatuses().pipe(takeUntil(this.destroy$)).subscribe(res => {

    })
  }

  gotoDetails(){
    this.router.navigateByUrl("/knowledge-hub/dashboard-details")
  }

  pieChartForStatuses() {
    if(KhDashboardStore.documentStatuses.length>0){
      this.showPieChart=true;
    }else{
      this.showPieChart=false;
    }
    am4core.addLicense("CH199714744");
    let chart = am4core.create("pieChartStatuses", am4charts.PieChart);
    chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;
    chart.data = KhDashboardStore.documentStatuses
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Document Status"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    chart.legend = new am4charts.Legend();
    //chart.legend.labels.template.disabled = true;
    chart.legend.itemContainers.template.togglable = false;
    // chart.legend.maxWidth = 100;
    // chart.legend.maxHeight = 80;
    // chart.legend.scrollable = true;
    // chart.legend.labels.template.fontSize = 14;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 14;
    markerTemplate.height = 14;

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
    this._utilityService.detectChanges(this._cdr);
    KhDashboardStore.dashboard_loaded = true
  }

  ngOnDestroy(){
    this.destroy$.next()
    this.destroy$.complete()
    am4core.disposeAllCharts();
    KhDashboardStore.unSetDocumentByStatuses()
  }

}
