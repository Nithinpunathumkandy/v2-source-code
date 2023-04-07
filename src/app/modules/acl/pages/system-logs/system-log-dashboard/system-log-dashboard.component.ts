import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { SystemLogsService } from 'src/app/core/services/acl/system-logs/system-logs.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SystemLogStore } from 'src/app/stores/acl/system-log.store';


@Component({
  selector: 'app-system-log-dashboard',
  templateUrl: './system-log-dashboard.component.html',
  styleUrls: ['./system-log-dashboard.component.scss']
})
export class SystemLogDashboardComponent implements OnInit {

  AuthStore =AuthStore;
  SystemLogStore = SystemLogStore;

  reactionDisposer: IReactionDisposer;
  constructor(private _helperService:HelperServiceService,
              private _systemLogsService:SystemLogsService,
              private _cdr: ChangeDetectorRef,
              private _utilityService: UtilityService,
    ) { }

  ngOnInit(): void {
    this.systemLogDashboard();
  }

  systemLogDashboard() {
    this._systemLogsService.systemLogDashboard().subscribe(res =>{
      setTimeout(() => {
        this.amChart();
      }, 100);
      this._utilityService.detectChanges(this._cdr);
    }); 
  }

  amChart(){
    am4core.addLicense("CH199714744");
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv", am4charts.PieChart3D);
    chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        value: SystemLogStore.SystemLog.all,
        title:'All'
      },
      {
        value: SystemLogStore.SystemLog.emergency,
        title:'Emergency'
      },
      {
        value: SystemLogStore.SystemLog.alert,
        title:'Alert'
      },
      {
        value: SystemLogStore.SystemLog.critical,
        title:'Critical'
      },
      {
        value: SystemLogStore.SystemLog.error,
        title:'Error'
      },
      {
        value: SystemLogStore.SystemLog.warning,
        title:'Warning'
      },
      {
        value: SystemLogStore.SystemLog.notice,
        title:'Notice'
      },
      {
        value: SystemLogStore.SystemLog.info,
        title:'Info'
      },
      {
        value: SystemLogStore.SystemLog.debug,
        title:'Debug'
      },
    ];

    chart.innerRadius = am4core.percent(40);
    chart.depth = 120;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right'
    chart.legend.fontSize = 10
    chart.legend.marginRight = 10;
    chart.legend.maxHeight = 130;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;
    
    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "value";
    series.dataFields.depthValue = "value";
    series.dataFields.category = "title";
    series.slices.template.cornerRadius = 5;
    series.colors.step = 3;
    series.colors.list = [
      am4core.color("#FF6347"),
      am4core.color("#B3A047"),
      am4core.color("#FF0000"),
      am4core.color("#845EC2"),
      am4core.color("#D65DB1"),
      am4core.color("#FF6F91"),
      am4core.color("#FFA500"),
      am4core.color("#FFC75F"),
      am4core.color("#F9F871"),
    ];
  }

  
}
