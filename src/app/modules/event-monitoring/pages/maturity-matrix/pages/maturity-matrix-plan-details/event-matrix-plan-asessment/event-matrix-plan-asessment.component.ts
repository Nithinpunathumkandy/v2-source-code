import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild,Renderer2 } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MaturityMatrixService } from 'src/app/core/services/event-monitoring/event-maturity-matrix/maturity-matrix.service';
import { MaturityMatrixPlanStore } from 'src/app/stores/event-monitoring/event-maturity-matrix/event-maturity-matrix-plan-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { AuthStore } from 'src/app/stores/auth.store';
import { MaturityMatrixTypesService } from 'src/app/core/services/masters/event-monitoring/maturity-matrix-types/maturity-matrix-types.service';
import { EventMatrixTypeMasterStore } from "src/app/stores/masters/event-monitoring/event-maturity-matrix-types-store";
declare var $: any;
@Component({
  selector: 'app-event-matrix-plan-asessment',
  templateUrl: './event-matrix-plan-asessment.component.html',
  styleUrls: ['./event-matrix-plan-asessment.component.scss']
})
export class EventMatrixPlanAsessmentComponent implements OnInit,OnDestroy {
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  MaturityMatrixPlanStore=MaturityMatrixPlanStore;
  EventMaturityMatrixTypeMasterStore=EventMatrixTypeMasterStore;
  reactionDisposer: IReactionDisposer;
  NoDataItemStore=NoDataItemStore;
  AppStore = AppStore;
  AuthStore=AuthStore
  selectedIndex=0;
  confirmationObject = {
    title: 'Confirm?',
    subtitle: 'confirm_current_parameters',
    type: 'Confirm'
  };
  selectedAsessmentId:number
  confirmAsessmentSubscription: any = null;
  paramIndex:number;
  asessmentPieNo = "pie";
  noAsessmentData:boolean=false;
  typeId=null;
  eventMaturityMatrixTypeId =null;
  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _maturityMatrixService: MaturityMatrixService,
    private _eventEmitterService: EventEmitterService,
    private _eventMaturityMatrixTypeService: MaturityMatrixTypesService,
  ) { }

  ngOnInit(): void {
    //console.log(AuthStore.user.id);
    if (MaturityMatrixPlanStore.selectedPlanId) {
      //this.getMatrixPlanDetails(MaturityMatrixPlanStore.selectedPlanId)
      
      this.getAsessmentChart(MaturityMatrixPlanStore.selectedPlanId);
      this.getEventMaturityMatrixType();
     
      setTimeout(() => {
        NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
      }, 300);
      this.matrixType();
    } else {
      this._router.navigateByUrl('event-monitoring/maturity-matrix/maturity-matrix-plan');
    }
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        //{ activityName: null, submenuItem: { type: 'datefilter' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    this.confirmAsessmentSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByConfirm(item);
    })
  }
  matrixType() {
   
    this._maturityMatrixService.getMatrixTypeAsessment(MaturityMatrixPlanStore.selectedPlanId).subscribe(res => {
     
      this._utilityService.detectChanges(this._cdr)
    })
}
changeIndex(index,id)
{
  this.selectedIndex=index;
}
checkUserPermission()
{
  const index=MaturityMatrixPlanStore?.matrixPlanDetails?.responsible_users.findIndex(e=>e.id==AuthStore.user.id);
  if(index>-1)
  {
    return true
  }
  else{
    return false;
  }

}
checkParameter(id,paramIndex,typeId) {
  this.selectedAsessmentId=id;
  this.paramIndex=paramIndex;
  this.typeId=typeId;
  setTimeout(() => {
    $(this.cancelPopup.nativeElement).modal('show');
  }, 100);
  this._utilityService.detectChanges(this._cdr);

}
cancelByConfirm(status) {
  //console.log(status)
  if(status)
  {
    this.confirmAsessment()
  }
  else
  {
    this.matrixType()
  }
  setTimeout(() => {
    $(this.cancelPopup.nativeElement).modal('hide');
  }, 250);
}
confirmAsessment()
{
  const payload={
    "is_completed":1,
    "order":this.paramIndex,
    event_maturity_matrix_type_id:this.typeId
   }
  this._maturityMatrixService.matrixConfirmAsessment(MaturityMatrixPlanStore.selectedPlanId,this.selectedAsessmentId,payload).subscribe(res => {
    this.selectedAsessmentId=null;
    this.paramIndex=null;
    this.getAsessmentChart(MaturityMatrixPlanStore.selectedPlanId);
    this._utilityService.detectChanges(this._cdr)
  })
}
getAsessmentChart(id)
{

  this._maturityMatrixService.getAsessmentChart(id,this.eventMaturityMatrixTypeId).subscribe(res => {
    this.asessmentChartLoad(res);
    this._utilityService.detectChanges(this._cdr)
  })
}

asessmentChartLoad(res) {
  am4core.addLicense("CH199714744");
  this.noAsessmentData=false;
  // Create chart instance
  setTimeout(() => {
    if(!this.checkDataIsPresent(res,'Percentage')){
      this.noAsessmentData=true;
    }else{
      this.noAsessmentData=false;
    }
    let chart = am4core.create("asessmentMatrix", am4charts.PieChart);
    chart.data = MaturityMatrixPlanStore._chartDataAsessment
  
    chart.legend = new am4charts.Legend();
  
    chart.legend.position = 'bottom'
    chart.legend.valueLabels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.valueLabels.template.text = "{value.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);
  
    // chart.legend.labels.template.disabled = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
  
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 10;
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.dataFields.value = "Percentage";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
    pieSeries.labels.template.fontSize =10;
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{value.formatNumber('#.0')}%";
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
    pieSeries.slices.template.tooltipText = "{value}% {category} ";
    this._utilityService.detectChanges(this._cdr);
  }, 250);
  
  
  //pieSeries.slices.template.events.on("hit", this.criticalityChartClick,this)
 
  
  
}
chageMatrixType()
{
    this.getAsessmentChart(MaturityMatrixPlanStore.selectedPlanId);
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
getEventMaturityMatrixType() {
  EventMatrixTypeMasterStore.orderBy='asc'
  this._eventMaturityMatrixTypeService.getItems(false,'',false).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}
getMatrixTypeSelect()
{
  this.eventMaturityMatrixTypeId=null;
  this.getAsessmentChart(MaturityMatrixPlanStore.selectedPlanId);
}
searchMaturityMatrixType(e){
  this._eventMaturityMatrixTypeService.getItems(null,'&q='+e.term,false).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })
}

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MaturityMatrixPlanStore.unsetMatrixAsessment(); 
    this.confirmAsessmentSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
