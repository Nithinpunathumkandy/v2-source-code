import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuditProgramSummaryReportService } from 'src/app/core/services/ms-audit-management/program-summary-report/audit-program-summary-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { AuthStore } from 'src/app/stores/auth.store';
import * as htmlToImage from 'html-to-image';
import { AuditProgramSummaryReportStore } from 'src/app/stores/ms-audit-management/audit-program-summary-report/audit-program-summary-report.store';
import { ActivatedRoute } from '@angular/router';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
declare var $: any;

@Component({
  selector: 'app-export-summary-reort',
  templateUrl: './export-summary-reort.component.html',
  styleUrls: ['./export-summary-reort.component.scss']
})
export class ExportSummaryReortComponent implements OnInit {
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  
  AuditProgramSummaryReportStore = AuditProgramSummaryReportStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  downloadMessage: string = 'downloading';

  constructor(
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _reportService : AuditProgramSummaryReportService,
    private _helperService: HelperServiceService
    ) { }

  ngOnInit(): void {
    var subMenuItems = [
      { activityName: null, submenuItem: { type: 'close',path:'../'} },
    ]

    this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

    if (SubMenuItemStore.clikedSubMenuItem) {

      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    }
    this.route.params.subscribe(params => {
      let id
      id = +params['id']; 
      this.getReportDetails(id);
    })
    
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
      setTimeout(() => {
        this.exportRiskContext()
       }, 2000);
      this._utilityService.detectChanges(this._cdr)
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


}
