import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkService } from 'src/app/core/services/audit-management/am-audit-field-work/am-audit-field-work.service';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AuthStore } from 'src/app/stores/auth.store';
declare var $: any;
@Component({
  selector: 'app-am-audit-info',
  templateUrl: './am-audit-info.component.html',
  styleUrls: ['./am-audit-info.component.scss']
})
export class AmAuditInfoComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  AmAuditsStore = AmAuditsStore;
  AmAuditFieldWorkStore = AmAuditFieldWorkStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  reactionDisposer : IReactionDisposer;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  auditEventSubscription: any;
  auditObject = {
    component: 'Audit',
    values: null,
    type: null
  };
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  AuthStore = AuthStore;
  progressPercentage = 0;

  constructor(private _helperService:HelperServiceService,
    private _route:ActivatedRoute,
    private _auditsService:AmAuditService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _eventEmitterService:EventEmitterService,
    private _renderer2:Renderer2,
    private _router:Router,
    private _auditFieldWorkService: AmAuditFieldWorkService,
    ) { }

  ngOnInit(): void {
    
    this.reactionDisposer = autorun(() => {
      if(AuthStore.user?.id == AmAuditsStore?.individualAuditDetails?.created_by?.id && AmAuditsStore?.individualAuditDetails?.am_audit_field_work_status?.type!='completed'){
        var subMenuItems = [
          { activityName: null, submenuItem: { type: 'go_to_plan' } },
          { activityName: 'UPDATE_AM_AUDIT', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_AM_AUDIT', submenuItem: { type: 'delete' } },
          { activityName: 'GENERATE_AM_AUDIT_TEMPLATE', submenuItem: { type: 'template' } },
          { activityName: 'GENERATE_AM_AUDIT_TEMPLATE', submenuItem: { type: 'export_to_excel' } },
          { activityName: null, submenuItem: { type: 'close',path:'/audit-management/am-audits' } },
          ]
      }
      else{
        var subMenuItems = [
          { activityName: null, submenuItem: { type: 'go_to_plan' } },
          { activityName: 'GENERATE_AM_AUDIT_TEMPLATE', submenuItem: { type: 'template' } },
          { activityName: 'GENERATE_AM_AUDIT_TEMPLATE', submenuItem: { type: 'export_to_excel' } },
          { activityName: null, submenuItem: { type: 'close',path:'/audit-management/am-audits' } },
          ]
      }
      if(AmAuditsStore?.individualAuditDetails?.field_work_start_date){
        subMenuItems.splice(0,0,{ activityName: null, submenuItem: { type: 'go_to_fieldwork' } },)
      }
    

this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
this._utilityService.detectChanges(this._cdr);
if (SubMenuItemStore.clikedSubMenuItem) {
  switch (SubMenuItemStore.clikedSubMenuItem.type) {
    case "edit_modal":
      setTimeout(() => {

        this._utilityService.detectChanges(this._cdr);
        this.editAudit(AmAuditsStore.auditId);
      }, 1000);
      break;
      case "delete":
        this.deleteAudit(AmAuditsStore.auditId);
        break;

    case "template":
      this._auditsService.generateTemplate();
      break;

    case "go_to_plan":
      this.goToPlan()
      break;
    case "go_to_fieldwork":
      this.goToFieldwork()
      break;
      
    case "export_to_excel":
      this._auditsService.exportToExcel();
      break;

    
    default:
      break;
  }
  // Don't forget to unset clicked item immediately after using it
  SubMenuItemStore.unSetClickedSubMenuItem();
}
})
this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
this.delete(item);
})

this.auditEventSubscription = this._eventEmitterService.auditManagementAuditAddModal.subscribe(item => {
  this.closeFormModal();
})


this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
if (!status) {
  this.changeZIndex();
}
})

this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
if (!status) {
  this.changeZIndex();
}
})

  this.getAmAuditProgress()

    if(AmAuditsStore.auditId==null || !AmAuditsStore?.individual_audit_loaded){
     this.getDetails(); 
    }
  }

  getAmAuditProgress(){
    this._auditsService.getAmAuditProgress(AmAuditsStore.auditId).subscribe(res => {
        this.getProgress(res);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProgress(progress){
    let individualPercentage = 100/progress.am_audit_statuses?.length;
    this.progressPercentage = 0
    for(let i of progress.am_audit_statuses){
      if(i.is_selected){
        this.progressPercentage = this.progressPercentage+individualPercentage;
      }
    }
    this.progressPercentage = Math.round(this.progressPercentage);
    this._utilityService.detectChanges(this._cdr);
    this.GaugeChart();   
   
  }
  
    GaugeChart() {
      am4core.addLicense("CH199714744");
      am4core.useTheme(am4themes_animated);
      // let minValue=0;
      // let maxValue=100;
      // create chart
      var chart = am4core.create("gaugechartdiv", am4charts.GaugeChart);
      chart.innerRadius = am4core.percent(75);
  
      /**
       * Normal axis
       */
  
      var axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
      axis.min = 0;
      axis.max = 100;
      axis.strictMinMax = true;
      axis.renderer.radius = am4core.percent(80);
      axis.renderer.inside = false;
      axis.renderer.line.strokeOpacity = 0;
      axis.renderer.ticks.template.disabled = false
      axis.renderer.ticks.template.strokeOpacity = 0;
      axis.renderer.ticks.template.length = 10;
      axis.renderer.grid.template.disabled = true;
      axis.renderer.labels.template.disabled = true;
      axis.renderer.labels.template.radius = 10;
      axis.renderer.labels.template.adapter.add("text", function(text) {
        return text + "%";
      })
  
      /**
       * Axis for ranges
       */
  
      var colorSet = new am4core.ColorSet();
  
      var axis2 = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
      axis2.min = 0;
      axis2.max = 100;
      // axis2.renderer.innerRadius = 95
      axis2.strictMinMax = true;
      axis2.renderer.labels.template.disabled = true;
      axis2.renderer.ticks.template.disabled = true;
      axis2.renderer.grid.template.disabled = true;
  
      var range0 = axis2.axisRanges.create();
      range0.value = 0;
      range0.endValue = 50;
      range0.axisFill.fillOpacity = 1;
      range0.axisFill.fill = colorSet.getIndex(15);
      // range0.axisFill.tooltip = new am4core.Tooltip();
      // range0.axisFill.tooltipText = `Percentage:[bold]${AmAuditFieldWorkStore.completed_percentage}[/]`;
      // range0.axisFill.interactionsEnabled = true;
      // range0.axisFill.isMeasured = true;
  
      var range1 = axis2.axisRanges.create();
      range1.value = 50;
      range1.endValue = 100;
      range1.axisFill.fillOpacity = 1;
      range1.axisFill.fill = colorSet.getIndex(9);
  
      /**
       * Label
       */
  
      var label = chart.radarContainer.createChild(am4core.Label);
      label.isMeasured = false;
      label.fontSize = 20;
      label.marginTop = 10;
      label.x = am4core.percent(50);
      label.y = am4core.percent(100);
      label.horizontalCenter = "middle";
      label.verticalCenter = "bottom";
      // label.text = "50%";
  
  
      /**
       * Hand
       */
  
      var hand = chart.hands.push(new am4charts.ClockHand());
      hand.axis = axis2;
      hand.innerRadius = am4core.percent(20);
      hand.startWidth = 10;
      hand.pin.disabled = true;
      hand.value = 50;
  
      hand.events.on("propertychanged", function(ev) {
        range0.endValue = ev.target.value;
        range1.value = ev.target.value;
        // label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
        axis2.invalidate();
      });
  
      setInterval(() => {
        var value = this.progressPercentage;
        // label.text = value + "%";
        var animation = new am4core.Animation(hand, {
          property: "value",
          to: value
        }, 1000, am4core.ease.cubicOut).start();
      }, 2000);
  
      chart.hiddenState.properties.radius = am4core.percent(0);
    }

  getDetails(){
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._auditsService.saveAuditId(id);
      this._auditsService.getItem(id).subscribe(res => {
        this.getAmAuditProgress();
        this._utilityService.detectChanges(this._cdr)
      })
    })
  }

  
  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }
  
  getManagerPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department?.title ? users?.department?.title : users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }

  getAuditorPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department?.title ? users?.department?.title : users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }
  
	getCreatedByPopupDetails(users) {
		let userDetial: any = {};
			userDetial['first_name'] = users?.first_name ? users?.first_name : '';
			userDetial['last_name'] = users?.last_name;
			userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
			userDetial['image_token'] = users?.image?.token;
			userDetial['email'] = users?.email;
			userDetial['mobile'] = users?.mobile;
			userDetial['id'] = users?.id;
			userDetial['department'] = users?.department?.title ? users?.department?.title : users?.department;
			userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
      userDetial['created_at']=AmAuditsStore?.individualAuditDetails?.created_at;
		
		return userDetial;
	}


  getArrayFormattedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }
  
  /**
* Delete the audit
*/
delete(status) {
  let type;
  if (status && this.deleteObject.id) {
    switch (this.deleteObject.type) {
      case '': type = this._auditsService.delete(this.deleteObject.id);
        break;

    }

    type.subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        this._router.navigateByUrl('audit-management/am-audits');
      
      }, 500);
      this.clearDeleteObject();
    }, (error => {
      setTimeout(() => {
        if (error.status == 405) {
          this._utilityService.detectChanges(this._cdr);
        }
      }, 100);

    }));
  }
  else {
    this.clearDeleteObject();
  }
  setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
  }, 250);

}

deleteAudit(id) {
  this.deleteObject.id = id;
  this.deleteObject.type = '';
  this.deleteObject.subtitle = 'delete_am_audit_subtitle';

  $(this.deletePopup.nativeElement).modal('show');
}

clearDeleteObject() {

  this.deleteObject.id = null;
  this.deleteObject.subtitle = '';
}


editAudit(id) {

  this._auditsService.getItem(id).subscribe(res => {

    this.auditObject.values = {
      id: id,
      am_individual_audit_plan_id: res['am_individual_audit_plan'],
      start_date: this._helperService.processDate(res['start_date'], 'split'),
      end_date: this._helperService.processDate(res['end_date'], 'split'),
      description:res['description'],
      objective:res['objective'],
      criteria:res['criteria'],
      scope:res['scope'],
      out_of_scope:res['out_of_scope'],
      am_audit_methodologies:res['am_audit_methodologies']

    }
    this.auditObject.type = 'Edit';

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);

  })
}

removeDot(data){
  return data.split('-')[0];
}


closeFormModal(){
  this.auditObject.type = null;
  this.auditObject.values = null;
  setTimeout(() => {
    $(this.formModal.nativeElement).modal('hide');
  }, 100);
  this._utilityService.detectChanges(this._cdr);
}

  goToPlan(){
    this._router.navigateByUrl(`/audit-management/am-audit-plans/${AmAuditsStore.individualAuditDetails.am_individual_audit_plan?.am_annual_plan_id}/annual-audit-plans/${AmAuditsStore.individualAuditDetails.am_individual_audit_plan?.id}`)
  }

goToFieldwork(){
  this._router.navigateByUrl(`/audit-management/am-audit-field-works/${AmAuditsStore.individualAuditDetails.id}`)
}
 
ngOnDestroy() {
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  this.deleteEventSubscription.unsubscribe();
  this.idleTimeoutSubscription.unsubscribe();
  this.networkFailureSubscription.unsubscribe();
  this.auditEventSubscription.unsubscribe();
  am4core.disposeAllCharts();
}


}
