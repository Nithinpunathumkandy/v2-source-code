import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditScheduleService } from 'src/app/core/services/internal-audit/audit-schedule/audit-schedule.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditSchedulesStore } from 'src/app/stores/internal-audit/audit-schedule/audit-schedule-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

// amChart imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-schedule-details',
  templateUrl: './audit-schedule-details.component.html',
  styleUrls: ['./audit-schedule-details.component.scss']
})
export class AuditScheduleDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('chooseAuditors', { static: true }) chooseAuditors: ElementRef;
  @ViewChild('scheduleDateModal', { static: true }) scheduleDateModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('viewChecklists' , { static: true }) viewChecklists: ElementRef;


  auditorsObject = {
    component: 'Master',
    values: null,
    type: null,
    from:null
  };

  popupObject = {
    category: '',
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  checklistObject = {
    component: 'Master',
    values: null,
    type: null,
    from: null
  };

  scheduleDateObject = {
    component: 'Master',
    values: null,
    type: null
  };


  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuditStore = AuditStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuditSchedulesStore = AuditSchedulesStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;


  auditorAuditeeSubscription: any;
  scheduleDateUpdateEvent: any;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  popupControlAuditableEventSubscription: any;
  exclude_ids=[];
  exclude_ids_auditee = [];
  scheduleId: number;
  viewChecklistsModalSubscription:any;
  modalFocusEvent:any;
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _auditScheduleService: AuditScheduleService,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _router: Router,) { }

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
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "un_mark_audited":
            this.unmarkAudits();
            break;
          case "mark_audited":
            this.markAudits();
            break;
          // case "execute_checklist":
          //   this.executeChecklists();
          //   break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    // for deleting/activating/deactivating using delete modal
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // caling modal

    this.auditorAuditeeSubscription = this._eventEmitterService.auditorsAuditeesAddModalControl.subscribe(res => {
      this.closeModal();
    })

    // focus fix
    this.modalFocusEvent = this._eventEmitterService.checklistsSingleViewModalFocusControl.subscribe(res=>{
      this.manageFocus();
    })

     // checklist modal close
     this.viewChecklistsModalSubscription = this._eventEmitterService.checklistAllViewTableModal.subscribe(res=>{
      this.closeChecklistModal();
    })


    this.scheduleDateUpdateEvent = this._eventEmitterService.auditScheduleDateonlyUpdateModal.subscribe(res => {
      this.closeDateUpdateModal();
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

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this.scheduleId = id;
      this.getAuditSchedule(id);
    });
  }

  getAuditSchedule(id) {
    this.exclude_ids = [];
    this.exclude_ids_auditee = [];
      this.scheduleId = id;
      this._auditScheduleService.getItem(id).subscribe(res => {
        AuditSchedulesStore.auditScheduleDetails.auditors.forEach(item=>{
          this.exclude_ids.push(item.id);
        })
        AuditSchedulesStore.auditScheduleDetails.auditees.forEach(element=>{
          this.exclude_ids_auditee.push(element.id);
        })
        this.getCharts();
        if(res.is_audited==0){
          // setting submenu items
          SubMenuItemStore.setSubMenuItems([
           { type: 'mark_audited' },
           { type: 'close', path: '../' }
         ]);
       } else {
          // setting submenu items
          SubMenuItemStore.setSubMenuItems([
           { type: 'un_mark_audited' },
           { type: 'close', path: '../' }
         ]);
       }
        this._utilityService.detectChanges(this._cdr);
      });
      this._auditScheduleService.saveAuditScheduleId(id);
  }

  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createPieChartForAuditHours();
      });
    }, 1000);
  }




  createPieChartForAuditHours() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("piechartAuditHoursdiv", am4charts.PieChart);

    // Add data
    chart.data = AuditSchedulesStore.auditScheduleDetails?.checklist_answer_count;

    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.maxWidth = 50;
    chart.legend.maxHeight = 80;
    chart.legend.scrollable = true;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
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

    pieSeries.labels.template.radius = am4core.percent(-40);

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;


    am4core.options.autoDispose = true;
    this._utilityService.detectChanges(this._cdr);
  }


   // for user previrews
   assignUserValues(user) {
    if(user){
    var userInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null,
      is_present:null
    }

    userInfoObject.first_name = user?.first_name;
    userInfoObject.last_name = user?.last_name;
    if(!user.designation.title){
      userInfoObject.designation = user.designation;
    } else {
      userInfoObject.designation = user.designation?.title;
    }
    userInfoObject.image_token = user.image_token? user.image_token:user.image ? user.image?.token:null;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status_id
    userInfoObject.department = user?.department? user?.department: user?.department?.title ? user?.department?.title: null;
    userInfoObject.is_present = user?.pivot?.is_present;
     return userInfoObject;
  }
  }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;

  }

  getAuditeeCheckedPresentAbsent(event, auditee) {
    if(AuditSchedulesStore.auditScheduleDetails?.auditees.length>1){
    if (event.target.checked ) {
        this._auditScheduleService.auditeePresent(this.scheduleId, auditee.id, '').subscribe(res => {
          this.getAuditSchedule(this.scheduleId);
          this._utilityService.detectChanges(this._cdr);
        })
      }  else{
        this._auditScheduleService.auditeeAbsent(this.scheduleId, auditee.id, '').subscribe(res => {
                this.getAuditSchedule(this.scheduleId);
                this._utilityService.detectChanges(this._cdr);
        })
      }

    } else {
      this._utilityService.showErrorMessage('error','auditte_absent_present_failed');
      this.getAuditSchedule(this.scheduleId);
    }
  }
  
  getAuditorCheckedPresentAbsent(event, auditor) {
    if(AuditSchedulesStore.auditScheduleDetails?.auditors.length>1){
    if (event.target.checked ) {
        this._auditScheduleService.auditorPresent(this.scheduleId, auditor.id, '').subscribe(res => {
          this.getAuditSchedule(this.scheduleId);
          this._utilityService.detectChanges(this._cdr);
        })
      }  else{
        this._auditScheduleService.auditorAbsent(this.scheduleId, auditor.id, '').subscribe(res => {
                this.getAuditSchedule(this.scheduleId);
                this._utilityService.detectChanges(this._cdr);
        })
      }

    } else {
      this._utilityService.showErrorMessage('error','auditor_absent_present_fail');
      this.getAuditSchedule(this.scheduleId);
    }
  }

  executeChecklists() {
    AuditStore.clearChecklistExecuteDocumentDetails();
    this._router.navigateByUrl('/internal-audit/audit-schedules/execute-checklists');
    this._utilityService.detectChanges(this._cdr);
  }

  // modal control event
  modalControl(status: boolean) {
    if (this.popupObject.category == 'mark') {
      switch (this.popupObject.type) {
        case 'Confirm': this.markAudit(status)
          break;
      }
    } else {
      switch (this.popupObject.type) {
        case 'Confirm': this.unmarkAudit(status)
          break;
      }
    }
  }

  markAudits() {
    this.popupObject.title = 'Delete Auditable Item?';
    this.popupObject.subtitle = 'Confirm As Audited?';
    this.popupObject.category = 'mark';
    this.popupObject.type = 'Confirm';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  unmarkAudits() {
    this.popupObject.title = 'Delete Auditable Item?';
    this.popupObject.subtitle = 'Confirm As Not Audited?';
    this.popupObject.category = 'un-mark';
    this.popupObject.type = 'Confirm';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  unmarkAudit(status) {
    if (status) {
      this._auditScheduleService.unMarkAudited(AuditSchedulesStore.auditSchedule_id, '').subscribe(res => {
        this.getAuditSchedule(this.scheduleId); // refresh upon success call
        $(this.confirmationPopUp.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
    }
  }

  markAudit(status) {
    if (status) {
      this._auditScheduleService.markAudited(AuditSchedulesStore.auditSchedule_id, '').subscribe(res => {
        this.getAuditSchedule(this.scheduleId);// refresh upon success call
        $(this.confirmationPopUp.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
    }
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  openAuditorAdddModal() {
    setTimeout(() => {
      $(this.chooseAuditors.nativeElement).modal('show');
    }, 100);
    this.auditorsObject.values = {
      schedule_id: AuditSchedulesStore.auditScheduleDetails.id,
      audit_program_id: AuditSchedulesStore.auditScheduleDetails.audit.audit_plan.audit_program_id,
      exclude_ids : this.exclude_ids
    }
    this.auditorsObject.type = 'auditor';
    this.auditorsObject.from = 'audit_schedule';
  }

  openAuditeeAddModal() {
    setTimeout(() => {
      $(this.chooseAuditors.nativeElement).modal('show');
    }, 100);
    this.auditorsObject.values = {
      schedule_id: AuditSchedulesStore.auditScheduleDetails.id,
      exclude_ids : this.exclude_ids_auditee
    }
    this.auditorsObject.type = 'auditee';
    this.auditorsObject.from = 'audit_schedule';

  }

  openScheduleDateUpdateModal() {
    setTimeout(() => {
      $(this.scheduleDateModal.nativeElement).modal('show');
    }, 100);

    this.scheduleDateObject.values = {
      id: AuditSchedulesStore.auditSchedule_id,
      start_date:AuditSchedulesStore.auditScheduleDetails.start_date,
      end_date: AuditSchedulesStore.auditScheduleDetails.end_date
    }

    this.scheduleDateObject.type = 'Edit';
  }



  closeModal() {
    $(this.chooseAuditors.nativeElement).modal('hide');
    this.auditorsObject.type = null;
    this.auditorsObject.values = null;
    this.auditorsObject.from = null;
    this.exclude_ids = [];
    this.exclude_ids_auditee = [];
    this.getAuditSchedule(this.scheduleId);
    this._utilityService.detectChanges(this._cdr);
  }

  closeDateUpdateModal() {
    $(this.scheduleDateModal.nativeElement).modal('hide');
    this.scheduleDateObject.type = null;
    this.scheduleDateObject.values = null;
    this.getAuditSchedule(this.scheduleId);
    this._utilityService.detectChanges(this._cdr);
  }

  viewAllChecklist(){
    this.checklistObject.type = 'Add';
    this.checklistObject.values = {
      schedule_id: AuditSchedulesStore.auditSchedule_id
    }
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.viewChecklists.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
    this._renderer2.removeAttribute(this.viewChecklists.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.viewChecklists.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }
  closeChecklistModal(){
    this.checklistObject.type = null;
    this.checklistObject.values = null;
    this._renderer2.removeClass(this.viewChecklists.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.viewChecklists.nativeElement, 'display', 'none');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
    this._renderer2.setAttribute(this.viewChecklists.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.viewChecklists.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);

    this.getAuditSchedule(this.scheduleId);
  }

  changeZIndex() {
    if ($(this.scheduleDateModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.scheduleDateModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.scheduleDateModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.chooseAuditors.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.chooseAuditors.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.chooseAuditors.nativeElement, 'overflow', 'auto');
    }
  }

  manageFocus(){
    setTimeout(() => {
      this._renderer2.setStyle(this.viewChecklists.nativeElement,'z-index','999999'); // For Modal to Get Focus
        this._renderer2.setStyle(this.viewChecklists.nativeElement,'overflow','auto');
      }, 50);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.auditorAuditeeSubscription.unsubscribe();
    this.scheduleDateUpdateEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupControlAuditableEventSubscription.unsubscribe();
    this.viewChecklistsModalSubscription.unsubscribe();
    this.modalFocusEvent.unsubscribe();
  }


}
