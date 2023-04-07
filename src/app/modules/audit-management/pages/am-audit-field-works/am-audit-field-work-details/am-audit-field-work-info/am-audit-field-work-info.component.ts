import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ActivatedRoute, Router } from '@angular/router';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AmAuditFieldWorkService } from 'src/app/core/services/audit-management/am-audit-field-work/am-audit-field-work.service';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";

declare var $: any;

@Component({
  selector: 'app-am-audit-field-work-info',
  templateUrl: './am-audit-field-work-info.component.html',
  styleUrls: ['./am-audit-field-work-info.component.scss']
})
export class AmAuditFieldWorkInfoComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ImportItemStore = ImportItemStore;
  AmAuditFieldWorkStore = AmAuditFieldWorkStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  auditFieldWorkObject = {
    component: 'Audit Field Work',
    values: null,
    type: null
  };
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  auditFieldWorkEventSubscription: any;


  constructor(private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _auditFieldWorkService: AmAuditFieldWorkService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    AmAuditTestPlanStore.auditTestPlanId = null;
    AmAuditTestPlanStore.unsetIndiviudalTestPlanDetails();
    if(AmAuditFieldWorkStore.individualAuditFieldWorkDetails?.created_by?.id == AuthStore.user.id && AmAuditFieldWorkStore.individualAuditFieldWorkDetails?.am_audit_fieldwork_status?.type!='completed'){
      var subMenuItems = [
        { activityName: 'CREATE_AM_ANNUAL_PLAN', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_AM_ANNUAL_PLAN', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works' } },
      ]
    }
    else{
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works' } },
      ]
    }
   

    this.reactionDisposer = autorun(() => {

   
      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.editAuditFieldWork(AmAuditFieldWorkStore.auditFieldWorkId);
            }, 1000);
            break;
          case "delete":
            this.deleteAuditFieldWork(AmAuditFieldWorkStore.auditFieldWorkId);
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

    this.auditFieldWorkEventSubscription = this._eventEmitterService.amAuditFieldWorkModal.subscribe(item => {
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

    this.getFieldWorkProgress();
    if (AmAuditFieldWorkStore.auditFieldWorkId == null || !AmAuditFieldWorkStore.individual_auditFieldWork_loaded)
      this.getDetails();

  }

  getDetails() {

    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this._auditFieldWorkService.saveAuditFieldWorkId(id);
      this._auditFieldWorkService.getItem(id).subscribe(res => {
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


getFieldWorkProgress(){
  this._auditFieldWorkService.getAmAuditProgress(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(res => {
    setTimeout(() => {
      this.GaugeChart();      
    }, 500);
    this._utilityService.detectChanges(this._cdr);
  })
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
    range0.axisFill.fill = colorSet.getIndex(0);
    
    // range0.axisFill.tooltip = new am4core.Tooltip();
    // range0.axisFill.tooltipText = `Percentage:[bold]${AmAuditFieldWorkStore.completed_percentage}[/]`;
    // range0.axisFill.interactionsEnabled = true;
    // range0.axisFill.isMeasured = true;

    var range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = colorSet.getIndex(2);

    /**
     * Label
     */

    var label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 20;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    label.text = "50%";


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
      var value = AmAuditFieldWorkStore.auditProgress?.completed_percentage;
      label.text = value + "%";
      var animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);

    chart.hiddenState.properties.radius = am4core.percent(0);
  }


  /**
* Delete the audit field workk
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditFieldWorkService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('/audit-management/am-audit-field-works');
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

  closeFormModal() {
    this.auditFieldWorkObject.type = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  deleteAuditFieldWork(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_field_work_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }


  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  editAuditFieldWork(fieldwork_id) {

    this.auditFieldWorkObject.values = {
      id: fieldwork_id,
      field_work_start_date: this._helperService.processDate(AmAuditFieldWorkStore.individualAuditFieldWorkDetails?.field_work_start_date, 'split'),
    }
    this.auditFieldWorkObject.type = 'Edit';

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.formModal?.nativeElement).modal('show');
    }, 100);

  }



  getPopupDetails(user) {
    let userDetailObject: any = {};
    userDetailObject['id'] = user.id;
    userDetailObject['first_name'] = user.first_name;
    userDetailObject['last_name'] = user.last_name;
    userDetailObject['designation'] = user.designation?.title ? user.designation?.title : user?.designation;
    userDetailObject['image_token'] = user.image_token;
    userDetailObject['department'] = user.department?.title ? user.department?.title : user?.department;
    userDetailObject['email'] = user.email;
    userDetailObject['mobile'] = user.mobile;
    userDetailObject['status_id'] = user.status_id?user.status_id:user?.status?.id;
    return userDetailObject;

  }

  getAuditorPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token?users?.image?.token:users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department?.title?users?.department?.title:users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }



  getCreatedByPopupDetails(users, supplier: boolean = false) {
    let userDetial: any = {};


    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = AmAuditFieldWorkStore.individualAuditFieldWorkDetails?.created_at;

    return userDetial;
  }

  


  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  gotoTestPlan(id) {
    AmAuditTestPlanStore.auditTestPlanId = id;
    this._router.navigateByUrl('/audit-management/am-audit-field-works/' + AmAuditFieldWorkStore.auditFieldWorkId + '/am-audit-test-plans/' + id);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.auditFieldWorkEventSubscription?.unsubscribe();
    am4core.disposeAllCharts();
    AmAuditFieldWorkStore.individual_auditFieldWork_loaded = false;
  }


}
