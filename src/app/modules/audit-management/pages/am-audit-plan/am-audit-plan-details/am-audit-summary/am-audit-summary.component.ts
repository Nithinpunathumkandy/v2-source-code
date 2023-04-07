import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AmAuditSummary } from 'src/app/core/models/audit-management/am-audit-plan/am-audit-summary';
import { AmAuditSummaryService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-summary/am-audit-summary.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AmAuditSummaryStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-summary.store';
import { CalendarOptions } from '@fullcalendar/angular';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { autorun, IReactionDisposer } from 'mobx';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView,} from 'angular-calendar';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours,} from 'date-fns';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
declare var $: any;
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-am-audit-summary',
  templateUrl: './am-audit-summary.component.html',
  styleUrls: ['./am-audit-summary.component.scss']
})
export class AmAuditSummaryComponent implements OnInit, OnDestroy {

  @ViewChild('detailsPopup') detailsPopup: ElementRef;

  auditeeDepartment = []
  auditSummaryArray: AmAuditSummary
  AmAuditSummaryStore = AmAuditSummaryStore;
  auditFlag: boolean = false
  emptyList="common_nodata_title"
  AmAuditPlansStore = AmAuditPlansStore;

  reactionDisposer: IReactionDisposer;

  deleteEventSubscription:any

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    weekends: true,
    events: this.getCalendar()
  };

  deleteObject = {
    id: null,
    type: '',
    subtitle: '',
    values:null
  };

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _auditSummaryService: AmAuditSummaryService,
    private modal: NgbModal,
    private _eventEmitterService:EventEmitterService,
  ) { }


  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {  
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this.getExport(AmAuditPlansStore.auditPlanId);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (SubMenuItemStore.clikedSubMenuItem) {
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.closeDetailsPopup();
    })

    this.getAuditSummaries()
    this.getAuditors()
  }

  getAuditSummaries() {
    AmAuditSummaryStore.loaded = false
    AmAuditSummaryStore.auditorsLoaded = false
    AmAuditSummaryStore.calendarLoaded = false
    AmAuditSummaryStore.auditeeDepartmentLoaded=false
    AmAuditSummaryStore.auditByManagersLoaded = false
    this._auditSummaryService.getItem(AmAuditPlansStore.auditPlanId).subscribe((res: AmAuditSummary) => {
      this.auditSummaryArray = res
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getAuditeeDepartments() {
    AmAuditSummaryStore.loaded = false
    AmAuditSummaryStore.auditorsLoaded = false
    AmAuditSummaryStore.calendarLoaded = false
    AmAuditSummaryStore.auditeeDepartmentLoaded=false
    AmAuditSummaryStore.auditByManagersLoaded = false
    this._auditSummaryService.getAuditeeDepartment(AmAuditPlansStore.auditPlanId).subscribe((res: any) => {
      this.auditeeDepartment = [...res]
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getAuditors() {
    AmAuditSummaryStore.loaded = false
    AmAuditSummaryStore.auditorsLoaded = false
    AmAuditSummaryStore.calendarLoaded = false
    AmAuditSummaryStore.auditeeDepartmentLoaded=false
    AmAuditSummaryStore.auditByManagersLoaded = false
    this._auditSummaryService.getAuditors(AmAuditPlansStore.auditPlanId).subscribe((res: any) => {
      this.auditFlag = true
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getCalendar() {
    AmAuditSummaryStore.loaded = false
    AmAuditSummaryStore.auditorsLoaded = false
    AmAuditSummaryStore.calendarLoaded = false
    AmAuditSummaryStore.auditeeDepartmentLoaded=false
    AmAuditSummaryStore.auditByManagersLoaded = false
    let events = []
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'))
    }, 2)

    this._auditSummaryService.getAuditCalendar(AmAuditPlansStore.auditPlanId).subscribe((res: any) => {
      // if(res.length)
      for (let obj of AmAuditSummaryStore?.auditCalendar) {
        events.push({ 
          title: `${obj?.process_id ? 'Process - ' : obj?.risk_id ? 'Risk - ' : obj?.objective_id ? 'Strategic Objective - ' : 'Department - ' } `+obj?.auditable_item_title,
           start: new Date(obj?.audits_start_date),actions: this.actions,
           start_date: obj?.audits_start_date,
           end_date : obj?.audits_end_date,
           status:obj?.am_individual_audit_plan_status_title  })//end: new Date(obj?.audits_end_date)
      }
      this._utilityService.detectChanges(this._cdr)
    })
    return events
  }

  getAuditByManager(){
    AmAuditSummaryStore.loaded = false
    AmAuditSummaryStore.auditorsLoaded = false
    AmAuditSummaryStore.calendarLoaded = false
    AmAuditSummaryStore.auditeeDepartmentLoaded=false
    AmAuditSummaryStore.auditByManagersLoaded = false
    this._auditSummaryService.getAuditByManager(AmAuditPlansStore.auditPlanId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getFrequency(frequencies, auditableItemFrequency) {
    let frequencyData = []
    for (let object of auditableItemFrequency) {
      frequencyData.push({ am_annual_plan_frequency_item_type: object?.am_annual_plan_frequency_item_type })
    }

    for (let freqObject of frequencies) {
      if (frequencyData.length != 0) {
        this.freqResponseChange(freqObject, frequencyData)
      }
    }

    return frequencyData
  }

  freqResponseChange(object, frequencyData) {
    let index = frequencyData.findIndex(x => x.am_annual_plan_frequency_item_type === object?.am_annual_plan_frequency_item_type);
    frequencyData.splice(index, 1)
    frequencyData.splice(index, 0, object)
  }

  //user popup box objects
  getAuditor(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.auditor_first_name;
    userDetial['last_name'] = users?.auditor_last_name;
    userDetial['designation'] = created?users?.designation:users?.designation_title;
   
    userDetial['image_token'] = users?.auditor_image_token;
    userDetial['email'] = users?.auditor_email;
    userDetial['mobile'] = users?.auditor_mobile;
    userDetial['id'] = users?.auditor_id;
    userDetial['department'] = users?.auditor_department_title;
    userDetial['status_id'] = users?.auditor_status_id ? users?.auditor_status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;
  }

  getAuditorManager(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.audit_manager_first_name;
    userDetial['last_name'] = users?.audit_manager_last_name;
    userDetial['designation'] = created?users?.designation:users?.designation_title;
   
    userDetial['image_token'] = users?.auditor_image_token;
    userDetial['email'] = users?.auditor_email;
    userDetial['mobile'] = users?.auditor_mobile;
    userDetial['id'] = users?.auditor_id;
    userDetial['department'] = users?.auditor_department_title;
    userDetial['status_id'] = users?.auditor_status_id ? users?.auditor_status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;
  }

  //Export starts 
  getExport(id){
    this._auditSummaryService.export(id).subscribe(res=>{
      SubMenuItemStore.exportClicked = false
    }, (err: HttpErrorResponse) => {
        SubMenuItemStore.exportClicked = false
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
    })
  }

  //Don't forget to dispose the reaction disposer and event emitter
  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe()
  }

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '',
      // a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '',
      // a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = this.getCalendar()

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.openDetailsPopup(event)
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openDetailsPopup(event){
    this.deleteObject.values = event
    $(this.detailsPopup.nativeElement).modal('show');
  }

  closeDetailsPopup() {    
    this.deleteObject.values = null;    
    $(this.detailsPopup.nativeElement).modal('hide');
  }

}
