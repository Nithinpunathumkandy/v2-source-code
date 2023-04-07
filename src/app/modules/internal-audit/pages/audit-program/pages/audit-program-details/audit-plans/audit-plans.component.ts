import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditPlanStore } from 'src/app/stores/internal-audit/audit-plan/audit-plan-store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';


// amChart imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { AuditPlanService } from 'src/app/core/services/internal-audit/audit-plan/audit-plan.service';
import { FormGroup } from '@angular/forms';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ByDepartmentChartStore } from 'src/app/stores/internal-audit/chart/by_department/by-department-store';
import { ByLeaderChartStore } from 'src/app/stores/internal-audit/chart/by_leader/by-leader-store';
import { ByDepartmentChartService } from 'src/app/core/services/internal-audit/chart/by_department/by-department-chart.service';
import { ByLeaderChartService } from 'src/app/core/services/internal-audit/chart/by_leader/by-leader-chart.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-plans',
  templateUrl: './audit-plans.component.html',
  styleUrls: ['./audit-plans.component.scss']
})
export class AuditPlansComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  SubMenuItemStore = SubMenuItemStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  AuditPlanStore = AuditPlanStore;
  ByDepartmentChartStore = ByDepartmentChartStore;
  ByLeaderChartStore = ByLeaderChartStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;


  form: FormGroup;
  searchTerm;
  reactionDisposer: IReactionDisposer;

  private pieChart: am4charts.PieChart;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  auditLeaderObject = {
    first_name:'',
    last_name:'',
    designation:'',
    image_token:'',
    mobile:null,
    email:'',
    id:null,
    department:'',
    status_id:null
  }

  popupControlAuditableEventSubscription: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _cdr: ChangeDetectorRef,
    private _auditProgranService: AuditProgramService,
    private _byDepartmentChartService: ByDepartmentChartService,
    private _byLeaderChartService: ByLeaderChartService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _auditPlanService: AuditPlanService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService) { }

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
    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any items added here!", subtitle: 'Add an item if there is any. To add, simply tap the button below.', buttonText: 'New Audit Plan' });
    this.form = new FormGroup({});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: 'CREATE_AUDIT_PLAN', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_AUDIT_PLAN_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDIT_PLAN', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_AUDIT_PLAN')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.AuditPlanStore.unSelectCriteria();
            this.AuditPlanStore.unSelectObjective();
            this.AuditPlanStore.clearDocumentDetails();
            this.gotoAddPage();
            break;
            case "export_to_excel":
              let params = `?audit_program_ids=${AuditProgramMasterStore.auditProgramId}`;
              this._auditPlanService.exportToExcel(params);
              break;
          case "search":
            AuditPlanStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.gotoAddPage();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    

    // for deleting/activating/deactivating using delete modal
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    // // setting submenu items
    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   { type: 'new_modal' },
    //   {type: 'export_to_excel'},
    //   { type: 'close', path: '../' }
    // ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;


    this.getAuditProgram();
    this.chartDataCall();
  }

  getAuditProgram() {
    this._auditProgranService.getItem(AuditProgramMasterStore.auditProgramId).subscribe(res => {
      this.pageChange(1);
      this.chartDataCall();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  chartDataCall(){
    this._byDepartmentChartService.getAllItems(AuditProgramMasterStore.auditProgramId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
    this._byLeaderChartService.getAllItems(AuditProgramMasterStore.auditProgramId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });

    this.getCharts();
  }
  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }


  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      this.createPieChart();
      this.createColumnChart();
    });
    }, 1000);
    
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditPlanStore.setCurrentPage(newPage);
    let params = `&audit_program_ids=${AuditProgramMasterStore.auditProgramId}`;
    this._auditPlanService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }


  clearSearchBar() {
    this.searchTerm = '';
    this.pageChange(1);
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditPlan(status)
        break;

    }

  }

  // delete function call
  deleteAuditPlan(status: boolean) {

    if (status && this.popupObject.id) {

      this._auditPlanService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }


  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Audit Plan?';
    this.popupObject.subtitle = 'audit_plan_delete_sub_tittle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

   // details page callig function
   gotToAuditPlanDetails(id:number){
    this._router.navigateByUrl('/internal-audit/audit-plans/'+id);
  }

  getAuditLeaderDetails(audit_leader){
    this.auditLeaderObject.first_name = audit_leader.audit_leader_first_name;
    this.auditLeaderObject.last_name = audit_leader.audit_leader_last_name;
    this.auditLeaderObject.designation = audit_leader.audit_leader_designation;
    this.auditLeaderObject.image_token = audit_leader.audit_leader_image_token;
    this.auditLeaderObject.email = 'abc@gmail.com';
    this.auditLeaderObject.mobile = 9876567899;
    this.auditLeaderObject.id =audit_leader.audit_leader_id;
    this.auditLeaderObject.department = audit_leader.audit_leader_department;
    this.auditLeaderObject.status_id = null;
    return this.auditLeaderObject;
  }

  // editing

  editAuditPlan(id:number){
    event.stopPropagation();
    this._auditPlanService.getItem(id).subscribe(res=>{
      this._router.navigateByUrl('/internal-audit/audit-programs/edit-audit-plan');
      this._utilityService.detectChanges(this._cdr)
    });
  }



  createPieChart() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("piechartdiv", am4charts.PieChart);
    var leaders = [];
    // Add data
    ByLeaderChartStore.allItems.forEach(element => {
      
      var items= {
        id: element.id,
        total_audit_plan: element.total_audit_plan,
        person: element.first_name + element.last_name
      }
      leaders.push(items);
    });
    chart.data = leaders;

     // for exporting the data
     chart.exporting.menu = new am4core.ExportMenu();
     chart.exporting.menu.align = "right";
     chart.exporting.filePrefix = "AuditPlanByLeaders"
     chart.exporting.menu.verticalAlign = "top";

    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.maxWidth = 100;
    chart.legend.maxHeight = 150;
    chart.legend.scrollable = true;
    chart.legend.position = "right";
    

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "total_audit_plan";
    pieSeries.dataFields.category = "person";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;


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


  createColumnChart() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create("chartColumndiv", am4charts.XYChart);

    var department = [];

    ByDepartmentChartStore.allItems.forEach(items => {
      if(items.total_audit_plan>0){
      var newItems = {
        department: items.title,
        audit_plan: items.total_audit_plan
      }
      department.push(newItems);
    }
    });

    // Add data
    chart.data = department;
    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.filePrefix = "AuditPlanByDepartment"
    chart.exporting.menu.verticalAlign = "top";
    chart.exporting.title = "department";

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 120;
    categoryAxis.dataFields.category = "department";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
      if (target.dataItem && target.dataItem.index) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Audit Plan Count";
    
    valueAxis.maxPrecision = 0;
    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "audit_plan";
    series.dataFields.categoryX = "department";
    series.name = "Plans Count";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

  }


  gotoAddPage() {
    this.clearCommonFilePopupDocuments()
    this.AuditPlanStore.unSelectCriteria();
    this.AuditPlanStore.unSelectObjective();
    this.AuditPlanStore.clearDocumentDetails();
    this._router.navigateByUrl('internal-audit/audit-programs/add-plan');

  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditPlanStore.searchText = null;
    AuditPlanStore.loaded = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

  }


}
