import { ITheme } from '@amcharts/amcharts4/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TrainingDashboardService } from 'src/app/core/services/training/training-dashboard/training-dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { TrainingDashboardStore } from 'src/app/stores/training/training-dashboard/training-dashboard-store';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TrainingStatusService } from 'src/app/core/services/masters/training/training-status/training-status.service';
import { TrainingStatusMasterStore } from 'src/app/stores/masters/training/training-status-master-store';
import { Training } from 'src/app/core/models/training/training-dashboard/training-dashboard';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-dashboard',
  templateUrl: './training-dashboard.component.html',
  styleUrls: ['./training-dashboard.component.scss']
})
export class TrainingDashboardComponent implements OnInit {
  @ViewChild('trainingchart') trainingchart: ElementRef;
  @ViewChild('barChartCompetency') barChartCompetency: ElementRef;
  @ViewChild('barChartCompetencyGroup') barChartCompetencyGroup: ElementRef;
  @ViewChild('barChartYears') barChartYears: ElementRef;
  @ViewChild('barChartDepartment') barChartDepartment: ElementRef;

  trainingPieChart = "pie";

  showPieNoDataMap:boolean =false;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  TrainingStatusMasterStore = TrainingStatusMasterStore;
  TrainingDashboardStore = TrainingDashboardStore;
  filterSubscription:any;

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
  buttonText = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId,private zone: NgZone,
    private _trainingDashboardService: TrainingDashboardService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _themestructureService: ThemeStructureSettingsService,
    private _imageService: ImageServiceService,
    private _trainingStatusService: TrainingStatusService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _eventEmitterService:EventEmitterService,
  ) { }

   // Run the function only in the browser
   browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    this.getStatusses();
    // this.getTraining();
    this.getTrainingCount();
    this.getTrainingAttendies();
    this.getTrainingPieStatus();
    this.getTrainingBarCompetency();
    this.getTrainingBarCompetencyGroup();
    this.getTrainingBarDepartment();
    this.getTrainingBarYears();

    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.TrainingDashboardStore.dashboardLoaded = false;
      this._trainingDashboardService.getTraining(false,null).subscribe();
      this._trainingDashboardService.getSecondTraining(false,null).subscribe();
      this.getAll();
      setTimeout(() => {
        this.TrainingDashboardStore.dashboardLoaded = true;
        }, 1000);
    });

    setTimeout(() => {
			TrainingDashboardStore.dashboardLoaded = true;
		  }, 500);
    this._utilityService.detectChanges(this._cdr);

    setTimeout(() => {
      // console.log(RightSidebarLayoutStore.isFilterSelected('is_functional',1));
      // if(!RightSidebarLayoutStore.isFilterSelected('training_status_ids', 4))
      //   this._rightSidebarFilterService.setOrUnsetFilterItem('training_status_ids', 4);
    }, 250);
  }

  ngAfterViewInit(): void {
   
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
      setTimeout(() => {
        RightSidebarLayoutStore.filterPageTag = 'trainings_dashbord';
        this._rightSidebarFilterService.setFiltersForCurrentPage([
          'organization_ids',
          'division_ids',
          'department_ids',
          'section_ids',
          'sub_section_ids',
          'training_status_ids',
        ]);
        this._utilityService.detectChanges(this._cdr);
      }, 1000);
    }, 1000);
  }

  getAll(){
    // this.getTraining();
    this.getTrainingCount();
    this.getTrainingAttendies();
    this.getTrainingPieStatus();
    this.getTrainingBarCompetency();
    this.getTrainingBarCompetencyGroup();
    this.getTrainingBarDepartment();
    this.getTrainingBarYears();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  getTraining(data){
    // console.log('test',data);
    
    let params='&training_status_ids='+data + '&limit=5' 
    this._trainingDashboardService.getTraining(false,params ? params : '').subscribe(res=>{
      this.getSecondTraining(data);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getSecondTraining(data){
    // console.log('test',data);
    
    let params='&training_status_ids='+data + '&limit=5' 
    this._trainingDashboardService.getSecondTraining(false,params ? params : '').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStatusses(){
    this._trainingStatusService.getItems(false, '&training_dashboard_status=true', false).subscribe((res) => {
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      this.getTraining(res['data'][0].id);
     
   
    } )
  
  }

  

  getTrainingCount(){
    this._trainingDashboardService.getTrainingCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getTrainingAttendies(){
    this._trainingDashboardService.getTrainingAttendies().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getTrainingPieStatus(){
    this._trainingDashboardService.getTrainingPieStatus().subscribe(res=>{
      setTimeout(() => {
       
          this.createPieChart();

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getTrainingBarCompetency(){
    this._trainingDashboardService.getTrainingBarCompetency().subscribe(res=>{
      setTimeout(() => {
       
          this.createBarChart(1);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getTrainingBarCompetencyGroup(){
    this._trainingDashboardService.getTrainingBarCompetencyGroup().subscribe(res=>{
      setTimeout(() => {
          this.createBarChart(4);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getTrainingBarDepartment(){
    this._trainingDashboardService.getTrainingBarDepartment().subscribe(res=>{
      setTimeout(() => {
       
        this.createBarChart(3);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getTrainingBarYears(){
    this._trainingDashboardService.getTrainingBarYears().subscribe(res=>{
      setTimeout(() => {
       
        this.createBarChart(2);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getCharts() {
    setTimeout(() => {
    //   // Chart code goes in here
    let theme = 'am4themes_animated';
      if(ThemeStructureSettingStore.structureDetailsById) theme = ThemeStructureSettingStore.structureDetailsById.charts_theme;
      let iTheme: ITheme = this._helperService.getThemes(theme);
      this.browserOnly(() => {
        am4core.useTheme(iTheme);

      });
    }, 1000);
   
  }

  createPieChart() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create(this.trainingchart.nativeElement, am4charts.PieChart);
    if(!this.checkDataIsPresent(TrainingDashboardStore.TrainingPieStatus,'count')){
      this.showPieNoDataMap = true;
      return;
    }
    else{
      this.showPieNoDataMap = false;
    }
    chart.data = TrainingDashboardStore.TrainingPieStatus;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Training"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.innerRadius = 90;
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('Training');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 20;
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    chart.legend.fontSize = 10
    chart.legend.marginRight = 10;
    chart.legend.maxHeight = 40;
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

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "training_statuses";
    pieSeries.labels.template.text = "";0
    pieSeries.slices.template.events.on("hit", this.trainingStatusClick, this);
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
    setTimeout(() => {
      
    }, 250);
    this._utilityService.detectChanges(this._cdr);
  }

  trainingStatusClick(ev){
    TrainingDashboardStore.setDashboardParam(`&training_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/trainings/training');
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
  

  createBarChart(filter:number = 1){
    let x;
    let y;
    am4core.addLicense("CH199714744");
    let chart
    if(filter == 1){
     chart = am4core.create(this.barChartCompetency.nativeElement, am4charts.XYChart);
      chart.data = TrainingDashboardStore.TrainingBarCompetency
      y = "count"
      x = 'title'
    }
    if(filter == 2){
     chart = am4core.create(this.barChartYears.nativeElement, am4charts.XYChart);
      chart.data = TrainingDashboardStore.TrainingBarYears
      y = "total_count"
      x = 'year'
    }
    if(filter == 3){
     chart = am4core.create(this.barChartDepartment.nativeElement, am4charts.XYChart);
      chart.data = TrainingDashboardStore.TrainingBarDepartment
      y = "count"
      x = 'code'
    }
    if(filter == 4){
      chart = am4core.create(this.barChartCompetencyGroup.nativeElement, am4charts.XYChart);
       chart.data = TrainingDashboardStore.TrainingBarCompetencyGroup
       y = "count"
       x = 'title'
     }
    chart.numberFormatter.numberFormat = "#";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;

    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = "{category}";
    // categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
    //   if (target.dataItem && target.dataItem.index) {
    //     return dy + 25;
    //   }
    //   return dy;
    // });
    categoryAxis.fontSize = 11;
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Training"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    // chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.fontSize = 11;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = y;
    series.dataFields.categoryX = x;
    series.name = "";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.CompetencyChartClick,this)
     }
     if(filter == 2){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.yearChartClick,this)
     }
     if(filter == 3){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.departmentChartClick,this)
     }
     if(filter == 4){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.CompetencyGroupChartClick,this)
     }
    
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    
    this._utilityService.detectChanges(this._cdr);
  }

  CompetencyChartClick(event){
    this.TrainingDashboardStore.dashboardParam = event.target.column.dataItem.dataContext.id;
    TrainingDashboardStore.setDashboardParam('&training_competency_ids='+this.TrainingDashboardStore.dashboardParam)
      this._router.navigateByUrl('/trainings/training');
  }

  yearChartClick(event){
    this.TrainingDashboardStore.dashboardParam = event.target.column.dataItem.dataContext.year;
    TrainingDashboardStore.setDashboardParam('&year='+this.TrainingDashboardStore.dashboardParam)
      this._router.navigateByUrl('/trainings/training');
  }

  departmentChartClick(event){
    this.TrainingDashboardStore.dashboardParam = event.target.column.dataItem.dataContext.id;
    TrainingDashboardStore.setDashboardParam('&department_ids='+this.TrainingDashboardStore.dashboardParam)
      this._router.navigateByUrl('/trainings/training');
  }

  CompetencyGroupChartClick(event){
    this.TrainingDashboardStore.dashboardParam = event.target.column.dataItem.dataContext.id;
    TrainingDashboardStore.setDashboardParam('&training_competency_group_ids='+this.TrainingDashboardStore.dashboardParam)
      this._router.navigateByUrl('/trainings/training');
  }


  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
   // Returns default image
   getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


getSecondList(trainings,type){
  if(type == 'first'){
    return trainings.slice(0,5);
  }
  else{
    if(trainings.length > 5){
      return trainings.slice(5,10);
    }
    else{
      return []
    }
  }
}

  ngOnDestroy(){
    am4core.disposeAllCharts();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    TrainingDashboardStore.dashboardLoaded = false;
  }
}
