import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AnnualSummaryService } from 'src/app/core/services/ms-audit-management/annual-summary/annual-summary.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AnnualSummaryStore } from 'src/app/stores/ms-audit-management/ms-audit-annual-summary/ms-audit-annual-summary.store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-annual-summary',
  templateUrl: './annual-summary.component.html',
  styleUrls: ['./annual-summary.component.scss']
})
export class AnnualSummaryComponent implements OnInit {
  
  @ViewChild('annualSummaryModal') annualSummaryModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AnnualSummaryStore=AnnualSummaryStore;
  reactionDisposer: IReactionDisposer;

  defaultItemType='executive-summary'
  showSummaryFormModal:boolean=false;

  selectedSummaryId:null;

  summaryObject={
    values:null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };


  annualAuditFormSubscription:any
  deleteEventSubscription: any;

  constructor(
    private _helperService: HelperServiceService,
    private _annualSummaryService:AnnualSummaryService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
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

      this.setSubMenuItems()
      NoDataItemStore.setNoDataItems({title: "summary_nodata_title", subtitle: 'summary_nodata_subtitle', buttonText: 'generate_summary'});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {   
          case "generate_summary":
            this.generateSummaryConfirm();
            break;
          case "delete":
            this.deleteSummaryConfirm(AnnualSummaryStore.AnnualSummaryDetails.id)
            break;
          case "search":
            AnnualSummaryStore.searchText   = SubMenuItemStore.searchText;
            break;	
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        // Open Report Generate Function
        if(AuthStore.getActivityPermission(1600,'CREATE_MS_AUDIT_ANNUAL_SUMMARY_REPORT'))
        this.generateSummaryConfirm()
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    this.annualAuditFormSubscription=this._eventEmitterService.annualAuditSummaryModal.subscribe(res=>{
      this.closeAnnualAuditSummaryModal()
      this.getAnnualSummary()
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    // this.getAnnualSummary()
  }


  setSubMenuItems(){
    var subMenuItems=[]

    if(AnnualSummaryStore.loaded && AnnualSummaryStore.AnnualSummaryDetails){
      subMenuItems.push(
          {activityName: 'DELETE_MS_AUDIT_ANNUAL_SUMMARY_REPORT', submenuItem: {type: 'delete'}},
    )
  }
  else if(!AnnualSummaryStore.AnnualSummaryDetails && AnnualSummaryStore.loaded){
    subMenuItems.push(
      {activityName: 'CREATE_MS_AUDIT_ANNUAL_SUMMARY_REPORT', submenuItem: {type: 'generate_summary'}},
)
  }
  this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
}

  getAnnualSummary(){
    this._annualSummaryService.getSummary().subscribe(res=>{
      res.msAuditAnnualSummaryReportContent?.forEach(element => {
        setTimeout(() => {
          this.createBarChartForProjectByDepartment(element.type,element.finding_count_by_department);
      }, 1000);
      });
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setType(type){
    this.scrollbyIndex(type)
    this.defaultItemType=type
  }

  scrollbyIndex(identificationParam) {

    document.getElementById(identificationParam).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }


  editSummary(summaryData){
    this.summaryObject.values={
      title:summaryData.title,
      id:summaryData.id,
      description:summaryData.description,
    }
    setTimeout(() => {
      this.openAnnualAuditSummaryModal()
    }, 200);
  }

  openAnnualAuditSummaryModal() {
    this.showSummaryFormModal = true;
    this._utilityService.detectChanges(this._cdr)
    $(this.annualSummaryModal.nativeElement).modal('show');
  }

  closeAnnualAuditSummaryModal() {
    this.showSummaryFormModal = false;
    $(this.annualSummaryModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr)
  }
  
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteSummary(status);
        break;
      case 'Confirm': this.generateSummary(status);
        break;
    }
  }

  deleteSummary(status: boolean) {

    if (status && this.popupObject.id) {
      this._annualSummaryService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._annualSummaryService.getSummary().subscribe()
          this._utilityService.detectChanges(this._cdr);
          
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      }
      );
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  generateSummary(status: boolean) {
    if (status) {
      AnnualSummaryStore.clearAnnualSummary();
      this._annualSummaryService.generateSummary().subscribe(resp => {
        setTimeout(() => {
          this._annualSummaryService.getSummary().subscribe()
        this._utilityService.detectChanges(this._cdr);
      }, 200);
      this.closeConfirmationPopup();
      this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  generateSummaryConfirm() {
    this.popupObject.type='Confirm';
    this.popupObject.title = 'generate_summary';
    this.popupObject.subtitle = 'generate_summary_confirm_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteSummaryConfirm(id: number) {
    this.popupObject.id = id;
    this.popupObject.type='';
    this.popupObject.title = 'delete_annual_audit_summary';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

 
  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.type = '';
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
  }

  setSelectedSummaryItem(summaryItemData){

  
    if (summaryItemData.id == this.selectedSummaryId)
    this.selectedSummaryId = null;
  else {
    this.selectedSummaryId = summaryItemData.id;
  }
  this.scrollbyIndex(summaryItemData.type)

  }

  // Bar Chart

  createBarChartForProjectByDepartment(type,chartData){
    am4core.addLicense("CH199714744");
    let chartItem = type == 'executive-summary' ? 'ibarChart1' : type == 'internal-imsarnbd' ? 'ibarChart2' : 'ibarChart3';
    let chart = am4core.create(chartItem, am4charts.XYChart);
    chart.data = chartData ;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "title";
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
    series.dataFields.categoryX = "title";
    series.name = "";
    
    series.columns.template.tooltipText = "{title}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
  
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }
  
  setChartData(type,storeData){
    let chartData=[]

    storeData.forEach(element => {
        if(element.type==type)
        chartData.push(element.finding_count_by_department)
    });

    return chartData
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AnnualSummaryStore.clearAnnualSummary();
    this.deleteEventSubscription.unsubscribe();
    this.annualAuditFormSubscription.unsubscribe();
    this.clearPopupObject();
  }

}
