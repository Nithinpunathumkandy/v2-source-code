import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { RiskRatingService } from "src/app/core/services/masters/risk-management/risk-rating/risk-rating.service";
import { RiskRatingMasterStore } from "src/app/stores/masters/risk-management/risk-rating-store";

// amChart imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { FormGroup } from '@angular/forms';
import { AuditSettingStore } from 'src/app/stores/settings/audit-settings.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auditable-items',
  templateUrl: './auditable-items.component.html',
  styleUrls: ['./auditable-items.component.scss']
})
export class AuditableItemsComponent implements OnInit, OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('riskModal', { static: true }) riskModal: ElementRef;
  @ViewChild('processModal', { static: true }) processModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  importRiskObject = {
    component: 'Master',
    values: null,
    type: null
  };

  importProcessObject = {
    component: 'Master',
    values: null,
    type: null
  };

  auditableItemObject = {
    component: 'Master',
    values: null,
    type: null
  };

  form: FormGroup;
  searchTerm;

  formErrors: any;
  AuditProgramMasterStore = AuditProgramMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuditableItemMasterStore = AuditableItemMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  AuditSettingStore = AuditSettingStore;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  auditableItemArray = [];
  importAuditableItemEvent;

  importRiskSubscriptionEvent: any;
  importprocessSubscriptionEvent: any;
  popupControlEventSubscription: any;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  private pieChart: am4charts.PieChart;
  private chart: am4charts.XYChart;
  riskRatingInfo = "pie";
  auditableItemCountInfo = "bar";

  riskChartStatus: boolean = true;
  auditableItemChartStatus: boolean = true;
  allAuditableItems: boolean = false;
  auditableItemEmptyList = "looks_like_there_are_no_auditable_items";


  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _auditProgramService: AuditProgramService,
    private _auditableItemService: AuditableItemService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService, private _riskRatingService: RiskRatingService) { }

    
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
    this.form = new FormGroup({});
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "edit_modal":
          //  this.gotoEditPage();
          //   break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
   

    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }
    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.importAuditableItemEvent = this._eventEmitterService.importAuditableItemModal.subscribe(res => {
      this.closeModal();
    })

    // calling import process modal
    this.importprocessSubscriptionEvent = this._eventEmitterService.importProcessFromAuditProgramModal.subscribe(res => {

      this.closeImportProcessModal();
    })

    // calling import risk modal

    this.importRiskSubscriptionEvent = this._eventEmitterService.importRiskFromAuditProgranModal.subscribe(res => {

      this.closeImportRiskModal();
    })


    // for deleting  modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })


    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })


    // calling audit program 
    this.auditProgram();
  }

  auditProgram() {
    AuditableItemMasterStore.loaded = false;
    this._auditProgramService.getItem(AuditProgramMasterStore.auditProgramId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
  }

  pageChange(newPage: number = null){
    if (newPage) AuditableItemMasterStore.setCurrentPage(newPage);
    let params = `&audit_program_ids=${AuditProgramMasterStore.auditProgramId}`;
    this._auditableItemService.getItems(false,params).subscribe(res=>{
      this.getCharts();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAuditableItems(){
    let params = `&audit_program_ids=${AuditProgramMasterStore.auditProgramId}`;
    if (this.searchTerm) {
      this._auditableItemService.getItems(false,params+`&q=${this.searchTerm}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.pageChange();
    }
  }

  clearSearchBar(){
    this.searchTerm = '';
    this.pageChange();
  }

  getCharts(){
    setTimeout(() => {
       // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      this.createPieChart();
      this.getRiskRatings();
      // this.createClusteredColumnChart();
    });
    }, 1000);
  }

  getRiskRatings(){
    let riskRatings = [];
    this._riskRatingService.getItems().subscribe(res=>{
      for(let i of res.data){
        let riskRatingsObject = { ratingsTitle: i.title, ratingsType: i.type, color: i.label };
        riskRatings.push(riskRatingsObject);
      }
      this.createClusteredColumnChart(riskRatings);
    });
  }


  createClusteredColumnChart(riskRatings){
    am4core.addLicense("CH199714744");
    let chart = am4core.create("clusteredbarchartdiv", am4charts.XYChart);
    // Add data
    var chartData = []
    AuditProgramMasterStore.individualAuditPrograms.department_wise_diagram.forEach(item=>{
        let chart_items = { "department": item.department};
        for(let i of riskRatings){
          chart_items[i.ratingsTitle] = item[i.color]
        }
        chart_items['Others'] = item.grey;
        chartData.push(chart_items);
        // var chart_items= {
        //   "department": item.department,
        //   "Low": item.green,
        //   "Medium": item.yellow,
        //   "High": item.orange,
        //   "Very High": item.red,
        //   "Others":item.grey,
        //   "Extreme": item['black']
        // }
        // chartData.push(chart_items);
    })
    // console.log(chart.data);
    chart.data = chartData;

     // for exporting the data
     chart.exporting.menu = new am4core.ExportMenu();
     chart.exporting.menu.align = "right";
     chart.exporting.filePrefix = "AuditableItemsCountByDepartment"
     chart.exporting.menu.verticalAlign = "top";

    // chart.colors.list = [am4core.color('green'),am4core.color('orange'),am4core.color('red'),am4core.color('yellow'),am4core.color('black'),am4core.color('grey')];
    for(let i of riskRatings){
      chart.colors.list.push(am4core.color(i.color=="light-green" ? "#81DF71": i.color))
    }
    chart.colors.list.push(am4core.color('grey'));
    // console.log(chart.colors);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "department";
    // categoryAxis.title.text = "Local country offices";

    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 120;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    let  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Auditable Items Count";
    for(var i = 0; i < riskRatings.length; i++){
      this.createSeries(chart, riskRatings[i].ratingsTitle, riskRatings[i].ratingsTitle, (i%2 == 0 ? true : false));
    }
    this.createSeries(chart, "Others", "Others", riskRatings.length%2 == 0 ? true : false);
    // this.createSeries(chart, "Low", "Low", false);
    // this.createSeries(chart, "High", "High", true);
    // this.createSeries(chart, "Very High", "Very High", false);
    // this.createSeries(chart, "Medium", "Medium", true);
    // this.createSeries(chart, "Extreme", "Extreme", true);
    // this.createSeries(chart, "Others", "Others", true);
    // Add legend
    chart.legend = new am4charts.Legend();
  }

  createSeries(chart,field, name, stacked) {
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = field;
    // series.columns.template.fill = am4core.color('red');
    series.dataFields.categoryX = "department";
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series.stacked = stacked;
    series.columns.template.width = am4core.percent(100);
  }

  createPieChart(){
    am4core.addLicense("CH199714744");
    let chart = am4core.create("piechartdiv", am4charts.PieChart);
    // Add data
    chart.data = AuditProgramMasterStore.individualAuditProgram.risk_rating_chart_data;

    const chartcolor=AuditProgramMasterStore.individualAuditProgram.risk_rating_chart_data.map(data=>{      
      if(data.color=="light-green"){
        {data.color="#81DF71"}
      }
    })
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.category = "type"; 
    // pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;

      // Add a legend
      chart.legend = new am4charts.Legend();
      chart.legend.maxWidth = 100;
      chart.legend.maxHeight = 150;
      chart.legend.scrollable = true;
      chart.legend.position = "bottom";

       // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.filePrefix = "RiskRatings"
    chart.exporting.menu.verticalAlign = "top";
  
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
  openAuditableItemModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);

    this.auditableItemObject.type = 'Add';
  }
  // for close modal
  closeModal() {


    $(this.formModal.nativeElement).modal('hide');
    this.auditProgram();
   
    this.auditableItemObject.type = null;
  }

  openRiskModal() {
    setTimeout(() => {
      $(this.riskModal.nativeElement).modal('show');
    }, 100);

    this.importRiskObject.values = {
      id: AuditProgramMasterStore.auditProgramId
    }
    this.importRiskObject.type = 'Risk';
  }

  openProcessModal() {
    setTimeout(() => {
      $(this.processModal.nativeElement).modal('show');
    }, 100);
    this.importProcessObject.values = {
      id: AuditProgramMasterStore.auditProgramId
    }
    this.importProcessObject.type = 'Process';
  }


  closeImportProcessModal() {
    $(this.processModal.nativeElement).modal('hide');
    this.auditProgram();// calling for redreshing the list
    this._utilityService.detectChanges(this._cdr);
    this.importProcessObject.type = null;

  }
  closeImportRiskModal() {
    $(this.riskModal.nativeElement).modal('hide');
    this.auditProgram();// calling for redreshing the list
    this._utilityService.detectChanges(this._cdr);
    this.importRiskObject.type = null;
  }

  // Auditable Item selecting function
  selectAuditableItemPresent(event, auditableItem, index) {
    var itemCount = 0;
    if (event.target.checked) {
      AuditableItemMasterStore.allItems[index]['is_enabled'] = true;
      AuditableItemMasterStore.allItems.forEach(element => {
        if (element['is_enabled'] == false || !element.hasOwnProperty('is_enabled')) {
          itemCount++;
        }
      });
      if (itemCount == 0) {
        this.allAuditableItems = true;
      } else {
        this.allAuditableItems = false;
      }
    } else {

      AuditableItemMasterStore.allItems[index]['is_enabled'] = false;
      this.allAuditableItems = false;
    }

    this.getSelectedAuditableItem();
  }

  // for checking all checkox
  checkAll(event) {
    if (event.target.checked) {
      AuditableItemMasterStore.allItems.forEach(element => {
        element['is_enabled'] = true;
      });
      this.allAuditableItems = true;
    } else {
      this.allAuditableItems = false;
      AuditableItemMasterStore.allItems.forEach(element => {
        element['is_enabled'] = false;
      });
    }

    this.getSelectedAuditableItem();

  }

  cancelCheckAll(){
    this.allAuditableItems = false;
      AuditableItemMasterStore.allItems.forEach(element => {
        element['is_enabled'] = false;
    });
    this.getSelectedAuditableItem();
  }

  getSelectedAuditableItem() {
    if (AuditableItemMasterStore.allItems.length > 0) {
      for (let i of AuditableItemMasterStore.allItems) {
        var pos = this.auditableItemArray.findIndex(e => e.id == i.id);
        if (i['is_enabled'] == true && pos == -1) {
          this.auditableItemArray.push(i);
        } else if (i['is_enabled'] == false && pos != -1) {
          this.auditableItemArray.splice(pos, 1);
        }
      }
    }
  }


  
  // processing data for save function
  processSaveData() {
    if (this.auditableItemArray.length > 0) {
      var auditableItemArrays = [];
      for (let i of this.auditableItemArray) {
        auditableItemArrays.push(i.id);
      }
      var items = {

        "auditable_item_ids": auditableItemArrays
      }

      return items;

    }
  }

  delete() {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.title = 'Are you sure you want to remove the auditable item(s) from the audit program?';
    this.popupObject.subtitle = 'remove_auditable_item_from_program';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    else if($(this.riskModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.riskModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.riskModal.nativeElement,'overflow','auto');
    } else if($(this.processModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.processModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.processModal.nativeElement,'overflow','auto');

    }
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditableItems(status)
        break;
    }

  }

  closePopup(){    
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('hide');    
  }


  // delete function
  deleteAuditableItems(status) {
    this.formErrors = null;
    if (this.auditableItemArray.length > 0 && status) {
      let save;
      AppStore.enableLoading();

      save = this._auditProgramService.deleteImportedAuditableItem(AuditProgramMasterStore.auditProgramId, this.processSaveData());

      save.subscribe((res: any) => {
        this.auditProgram();// calling to refresh
        this.pageChange(1);
        this.getCharts();
        this.auditableItemArray = [];
        AppStore.disableLoading();
        this.closePopup()
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }else{
      this.cancelCheckAll()
      this.closePopup()
    }

  }


  ngOnDestroy() {

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.importAuditableItemEvent.unsubscribe();
    this.importRiskSubscriptionEvent.unsubscribe();
    this.importprocessSubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AuditProgramMasterStore.individualLoaded = false;


  }
}
