import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditProgramSummaryReportService } from 'src/app/core/services/ms-audit-management/program-summary-report/audit-program-summary-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as htmlToImage from 'html-to-image';
import { AuditProgramSummaryReportStore } from 'src/app/stores/ms-audit-management/audit-program-summary-report/audit-program-summary-report.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
declare var $: any;
@Component({
  selector: 'app-summary-report-info',
  templateUrl: './summary-report-info.component.html',
  styleUrls: ['./summary-report-info.component.scss']
})

export class SummaryReportInfoComponent implements OnInit {
  @ViewChild('annualSummaryModal') annualSummaryModal: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  downloadMessage: string = 'downloading';
  searchText : any = ''
  showSummaryFormModal:boolean=false;
  summaryObject={
    values:null
  }
  AuditProgramSummaryReportStore = AuditProgramSummaryReportStore
  reactionDisposer: IReactionDisposer;
  rightSidebarOpen = []
  selectedItemId: any;
  selectedIndex: number;
  annualAuditFormSubscription: any;
  constructor( 
    private _router:Router,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _reportService : AuditProgramSummaryReportService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        // { activityName: null, submenuItem: { type: 'edit_modal' } },
        { activityName: '', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close',path:'../'} },
      ]

      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              // this.chooseAuditProgramModal();
            }, 200);
            break;
            case "export_to_excel":
            //  this.exportRiskContext()
            this.export()
              break;
       
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      let id: number;
      this.route.params.subscribe(params => {
        id = +params['id']; 
        AuditProgramSummaryReportStore.setSelecetdReportId(id);
        this.getReportDetails(id);
      })
    })

    this.annualAuditFormSubscription = this._eventEmitterService.annualAuditSummaryModal.subscribe(res=>{
      this.closeAnnualAuditSummaryModal()
      this.getReportDetails(AuditProgramSummaryReportStore.selectedReportId);
    })
  }
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

  getReportDetails(id:number){
    this._reportService.getItem(id).subscribe(res=>{
      res.ms_audit_annual_summary_report_content?.forEach(element => {
        element?.details?.forEach(data=>{
          setTimeout(() => {
            this.createBarChartForProjectByDepartment(data.type,data?.graph);
        }, 1000);
        })
    
      });
      this._utilityService.detectChanges(this._cdr)
    })
  }
  setSelectedReportItem(index,reportItemData){

  if (index == this.selectedItemId){
    this.selectedItemId = null;
    this.selectedIndex = null;
  }
  else {
    this.selectedItemId = index;
    this.selectedIndex = index
  }
  // this.scrollbyIndex(reportItemData.type)

  }

  // scrollbyIndex(index) {

  //   document.getElementById(index).scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //     inline: "nearest",
  //   });
  // }

  selectedIndexChange(index:number,id:number) {
    if(this.selectedIndex == index){
      this.selectedIndex = null;
      this.selectedItemId = null;
    } else{
      this.selectedIndex = index;
      this.selectedItemId = index;
      // this._utilityService.detectChanges(this._cdr);
    } 
    let items = AuditProgramSummaryReportStore.IndividualMsAuditPrgramsReportDetails?.ms_audit_annual_summary_report_content
    // this.filter(items,'title')
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


  exportRiskContext() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    setTimeout(() => {
      let element: HTMLElement;
      element = document.getElementById("report");
      let pthis = this;
      htmlToImage.toBlob(element)
        .then(function (dataUrl) {
          console.log(dataUrl)
          var reader = new FileReader();
          reader.readAsDataURL(dataUrl);
          reader.onloadend = function () {
            var base64data = reader.result;
            // window.open("data:application/pdf;base64, " + base64data);
            
            pthis.downloadPdf(base64data);
          }
          SubMenuItemStore.exportClicked = false;
          pthis.closeLoaderPopUp();
        });
    }, 100);

  }

  downloadPdf(file) {
    this._imageService.getPdf(file).subscribe(res => {
      SubMenuItemStore.exportClicked = false;
       this.closeLoaderPopUp();
    })
  }

  closeLoaderPopUp() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

//   filter(items , data){
//     // items.filter(item => item[data].indexOf(data[0]) !== -1  );
//     // console.log(items)
//     var whiteList = ['css', 'js'];

// var events = [{
//   file: 'css/style.css',
//   type: 'css'
// }, {
//   file: 'js/app.js',
//   type: 'js'
// }, {
//   file: 'index/html.html',
//   type: 'html'
// }];

// var fileList = events.filter(event=> {
//   return whiteList.indexOf(event.type) > -1
// })
// console.log(fileList);

// }


  export(){
    this._router.navigateByUrl('ms-audit-management/audit-program-annual-summary-reports/'+AuditProgramSummaryReportStore.selectedReportId+'/export')
  }


    ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
    }
}
