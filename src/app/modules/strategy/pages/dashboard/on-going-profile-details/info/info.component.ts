import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DashboardService } from 'src/app/core/services/strategy-management/dashboard/dashboard.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
declare var $: any;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  @ViewChild('initiativeMore', {static: true}) initiativeMore: ElementRef;

  selectedId: number;
  StrategyDaashboardStore = StrategyDaashboardStore;
  AppStore = AppStore;
  selectedFocusAreaId: any;
  selectedKpiItem: any = 0;
  achivedVsTarget : boolean = false;
  budgetvsActualPieChart = "pie";
  reactionDisposer: IReactionDisposer;
  strategy_dashboard_loader: boolean = false;
  initiativeObject = {
    type : null,
    value : null
  }
  criteriaEmptyList = "common_nodata_title"

  initiativeMoreModalSubscription: any;

  constructor(private _dashbordService : DashboardService,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _strategyService:StrategyService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _router: Router, private _route: ActivatedRoute,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    let id :number
    this._route.params.subscribe(params => {
      id = +params['id'];
    this.reactionDisposer = autorun(() => {      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            //  this.editStrategyInitiative();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 

      if(toJS(AuthStore.userPermissions).length > 0){
        if(id){
          this.selectedId = id;
          this.getAchivedVsActual(id)
          this.getProfileCounts(id)
          this.getProfileDetails(id)
         }      }
    });
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: "../dashboard"}
    ]);

    this.initiativeMoreModalSubscription = this._eventEmitterService.initiativeMoreModalControl.subscribe(res=>{
      this.closeMoreInitiativesModal();
    })
   // (+) converts string 'id' to a number
    
  })
  setTimeout(() => {
    this.strategy_dashboard_loader = true;
  }, 500);
  this._utilityService.detectChanges(this._cdr);
  }

  getProfileDetails(id){
    this._dashbordService.profileDetails(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr) 
    })
  }


  getAchivedVsActual(id){
    this._dashbordService.achivedVsTarget(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
      setTimeout(() => {
        this.getAchivedVsTargetChart();
        this._utilityService.detectChanges(this._cdr);
      },3000);
    })
  }

  selectedFocusArea(pos,id){
    this.selectedFocusAreaId = id
    this.selectedKpiItem = pos;
    this._utilityService.detectChanges(this._cdr);
  }

  objectives(obj){
   let data = [];
   if(obj){
    data = obj.slice(0,3)
   }
   return data
  }


  getProfileCounts(id){
    this._dashbordService.profileCounts(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAchivedVsTargetChart(){

    am4core.addLicense("CH199714744");
    // Themes begin
    am4core.useTheme(am4themes_animated);

    //create chart
    if(!StrategyDaashboardStore.achivedVsTarget.strategy_profile_target){
      this.achivedVsTarget = true
    }else {
      this.achivedVsTarget = false
    }
    let chart = am4core.create("gaugechartdiv", am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(82);

    //Normal axis
    let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = 0;
    axis.max = StrategyDaashboardStore.achivedVsTarget.strategy_profile_target;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(100);
    axis.renderer.inside = false;
    axis.renderer.line.strokeOpacity = 0;
    axis.renderer.ticks.template.disabled = false
    axis.disabled = false;
    axis.renderer.ticks.template.strokeOpacity = 0;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 10;
    axis.renderer.labels.template.adapter.add("text", function(text) {
      return text;
    })

    //Axis for ranges
    let colorSet = new am4core.ColorSet();

    let axis2 =  chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis2.min = 0;
    axis2.max = 100;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    let range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 100;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = am4core.color("#049dff");

    let range1 = axis2.axisRanges.create();
    range1.value = 0;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = am4core.color("#b1e1ff");

    //Label
    let label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 20;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    label.text = "182";

    //hand
    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = 100;

    hand.events.on("propertychanged", function(ev) {
      range0.endValue = ev.target.value;
      range1.value = ev.target.value;
      label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
      axis2.invalidate();
    });

    setInterval(function() {
      let value = StrategyDaashboardStore.achivedVsTarget.strategy_profile_achieved_score ? StrategyDaashboardStore.achivedVsTarget.strategy_profile_achieved_score : 0 // set store values
      let animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);

    chart.hiddenState.properties.radius = am4core.percent(0);
    // chart.logo.disabled = true;
  }

 openMoreInitiativeData(data){
    this.initiativeObject.type = 'Add';
    this.initiativeObject.value = data
    this.openMoreInitiatives()
  }
  openMoreInitiatives(){
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.initiativeMore.nativeElement,'show');
    this._renderer2.setStyle(this.initiativeMore.nativeElement,'display','block');
    this._renderer2.setStyle(this.initiativeMore.nativeElement,'z-index',99999);
  }
  
  closeMoreInitiativesModal(){
    setTimeout(() => {
      // $(this.initiativeMore.nativeElement).modal('hide');
      this.initiativeObject.type = null;
      this.initiativeObject.value = null;
      this._renderer2.removeClass(this.initiativeMore.nativeElement,'show');
      this._renderer2.setStyle(this.initiativeMore.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.initiativeMoreModalSubscription.unsubscribe();
    this.achivedVsTarget = false
  
  }

}
