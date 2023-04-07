import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MsAuditPlansService } from 'src/app/core/services/ms-audit-management/ms-audit-plans/ms-audit-plans.service';
import { MsAuditProgramsService } from 'src/app/core/services/ms-audit-management/ms-audit-programs/ms-audit-programs.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MsAuditProgramsStore = MsAuditProgramsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsAuditPlansStore=MsAuditPlansStore;

  modalEventSubscription: any;
  popupControlEventSubscription: any;

  MsAuditProgramsObject = {
    type:null,
    values: null,
  };

  popupObject = {
    type: '',
    id: null,
    position: null,
    title:'',
    subtitle:''
  };
  findingsNotShow:boolean=false;
  constructor(  
    private _router:Router,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _msAuditProgramsService: MsAuditProgramsService,
    private _msAuditPlansService: MsAuditPlansService,
    private _humanCapitalService: HumanCapitalService
  ) { }

  ngOnInit(): void {
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; 
      MsAuditProgramsStore.setMsAuditProgramsId(id);
      this.getDetails(id);
    })
    
    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit_programs",
        path:`/ms-audit-management/ms-audit-programs`
      });
    }

    this.reactionDisposer = autorun(() => {
      
      this.subMenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
              this.getEdit();
            break;
          case "delete":
            this.delete(MsAuditProgramsStore.msAuditProgramsId);
          break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });
    
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });
  }

  getDetails(id){
    this._msAuditProgramsService.getItem(id).subscribe(res => {
      this.subMenu();
      //this.getMsAuditPrePlan();
      this.auditPlanSummary();
      this.getFindingStatusByProgram();
    this._utilityService.detectChanges(this._cdr);
    });
  }
  getFindingStatusByProgram()
  {
    this._msAuditProgramsService.getFindingStatus(MsAuditProgramsStore.msAuditProgramsId).subscribe(res => {
      this.getFindingsStatus(res);
    this._utilityService.detectChanges(this._cdr);
    });
  }

  subMenu(){

    let subMenuItems= [];
     if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')){
      subMenuItems = [
        { activityName: 'UPDATE_MS_AUDIT_PROGRAM', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_MS_AUDIT_PROGRAM', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'close',path:MsAuditProgramsStore.path} },
      ];
    }else{
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'close',path:MsAuditProgramsStore.path} },
      ];
    }

    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    this._utilityService.detectChanges(this._cdr);
  }
  

// Edit
  getEdit() {
    if(MsAuditProgramsStore.individualMsAuditProgramsDetails?.id){
      this.MsAuditProgramsObject.type = 'Edit';
      MsAuditProgramsStore.editFlag=true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }  
  }
//**Edit

//delete
  delete(id){
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title='Delete';
    this.popupObject.subtitle = 'are_you_sure_you_want_to_delete_this_ms_audit_program';

    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // modal control event
  modalControl(status: boolean) {

    switch (this.popupObject.type) {
      case '': this.deleteItem(status);
        break;
    }
  }

  // delete function call
  deleteItem(status: boolean) {
    
    if (status && this.popupObject.id) {

      this._msAuditProgramsService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl(MsAuditProgramsStore.path);
        }, 500);
        this.clearPopupObject();
        this._router.navigateByUrl('ms-audit-management/ms-audit-programs');
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  //**delete


  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.MsAuditProgramsObject.type = null;
    AppStore.showDiscussion = false;
    this.getDetails(MsAuditProgramsStore.msAuditProgramsId);
  }

  getCreatedUser(users, created?: string) {
    let userDetails: any = {};
    userDetails['first_name'] = users?.first_name;
    userDetails['last_name'] = users?.last_name;
    if (created) {
      userDetails['designation'] = users?.designation;
    } else {
      userDetails['designation'] = users?.designation ? users?.designation?.title : users?.designation_title;
    }    
    userDetails['image_token'] = users?.image?.token;
    userDetails['email'] = users?.email;
    userDetails['mobile'] = users?.mobile;
    userDetails['id'] = users?.id;
    userDetails['department'] = users?.department;
    userDetails['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetails['created_at'] = created ? created : null;
    return userDetails;
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getauditPlanCounts(data)
  {
    let item=[];
    if(data.audited)
    {
      item.push({'title':'Audited','count':data.audited})
    }
    if(data.planned)
    {
      item.push({'title':'Planned','count':data.planned})
    }
    if(data.need_to_be_planned)
    {
      item.push({'title':'Need to Planned','count':data.need_to_be_planned})
    }
    if(data.total_preplan)
    {
      item.push({'title':'Preplan','count':data.total_preplan})
    }
    return item;

  }

  auditPlanSummary() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create("planSummary", am4charts.PieChart);
    chart.data = this.getauditPlanCounts(MsAuditProgramsStore.individualMsAuditProgramsDetails?.preplan_status)

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Plan Summary"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.numberFormatter.numberFormat = "#.";
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Audit Plan";
    label.wrap = true
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 40;
    chart.legend.marginTop = 15;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize= 10;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.tooltipText =  "{category}: {value.percent.formatNumber('#.')}% ({value.value})";
    //pieSeries.slices.template.events.on("hit", this.pieChartClicked,this)
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    //pieSeries.slices.template.events.on("hit", this.clickCorrectiveActionByStatus,this)
    //pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }
  }


  getFindingsStatus(data) {
    if(data.length)
    {
      this.findingsNotShow=false;
      am4core.addLicense("CH199714744");
      // Create chart instance
      let chart = am4core.create("findingsStatus", am4charts.PieChart);
      chart.data = data
  
      // for exporting the data
      chart.exporting.menu = new am4core.ExportMenu();
      chart.exporting.filePrefix = "Finding_status"
      chart.exporting.menu.align = "right";
      chart.exporting.menu.verticalAlign = "top";
      chart.numberFormatter.numberFormat = "#.";
      // Add label
      chart.innerRadius = am4core.percent(50);
      let label = chart.seriesContainer.createChild(am4core.Label);
      label.text = "Finding Status";
      label.wrap = true
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 12;
  
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 10
      chart.legend.scrollable = true;
      chart.legend.maxHeight = 40;
      chart.legend.marginTop = 15;
      chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
      chart.legend.valueLabels.template.align = "left"
      chart.legend.valueLabels.template.textAlign = "end"
      chart.legend.labels.template.maxWidth = 150;
      chart.legend.itemContainers.template.padding(3,0,3,0);
      chart.legend.itemContainers.template.togglable = true;
      chart.legend.labels.template.wrap = true;
      chart.rtl = AuthStore.user.language.is_rtl ? true : false;
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 13;
      markerTemplate.height = 13;
      markerTemplate.fontSize= 10;
      
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "title";
      pieSeries.labels.template.text = "";
      pieSeries.slices.template.tooltipText =  "{category}: {value.percent.formatNumber('#.')}% ({value.value})";
      //pieSeries.slices.template.events.on("hit", this.pieChartClicked,this)
      pieSeries.ticks.template.events.on("ready", hideSmall);
      pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
      pieSeries.labels.template.events.on("ready", hideSmall);
      pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
      //pieSeries.slices.template.events.on("hit", this.clickCorrectiveActionByStatus,this)
      //pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
  
      function hideSmall(ev) {
        if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
          ev.target.hide();
        }
        else {
          ev.target.show();
        }
      }
    }
    else{
      this.findingsNotShow=true;
    }
    
  }
  

  getMsAuditPrePlan(number?)
  {
    MsAuditPlansStore.currentPagePrePlan=number;
    this._msAuditPlansService.getItemsPrePlan(false, '&ms_audit_program_ids='+MsAuditProgramsStore.msAuditProgramsId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    MsAuditProgramsStore.unsetIndividualMsAuditProgramsDetails();
  }
}
