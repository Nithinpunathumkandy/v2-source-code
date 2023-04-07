import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AuditScheduleService } from 'src/app/core/services/internal-audit/audit-schedule/audit-schedule.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import {AuditSchedulesStore} from 'src/app/stores/internal-audit/audit-schedule/audit-schedule-store';
import {AuditSchedules} from 'src/app/core/models/internal-audit/audit-schedule/audit-schedule';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-schedules-list',
  templateUrl: './audit-schedules-list.component.html',
  styleUrls: ['./audit-schedules-list.component.scss']
})
export class AuditSchedulesListComponent implements OnInit , OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('scheduleDateModal', { static: true }) scheduleDateModal: ElementRef;


  AuditSchedulesStore = AuditSchedulesStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;

  scheduleDateObject = {
    component: 'Master',
    values: null,
    type: null
  };


  popupActive: boolean;
  activeIndex = null;
  informedActiveIndex = null;
  hover = false;
  scheduleDateUpdateEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  constructor( private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService, 
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _auditScheduleService:AuditScheduleService,
    private _renderer2: Renderer2,) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: '', buttonText: ''});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: 'EXPORT_AUDIT_PLAN_SCHEDULE', submenuItem: {type: 'export_to_excel'}}
      ]
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "template":
          //   this._auditScheduleService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._auditScheduleService.exportToExcel();
            break;
          case "search":
            AuditSchedulesStore.searchText = SubMenuItemStore.searchText;
            this.pageChange();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })
    


    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.scheduleDateUpdateEvent = this._eventEmitterService.auditScheduleDateonlyUpdateModal.subscribe(res=>{
      this.closeDateUpdateModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.scheduleDateModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.scheduleDateModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.scheduleDateModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.scheduleDateModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.scheduleDateModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.scheduleDateModal.nativeElement,'overflow','auto');
      }
    })
    // // setting submenu items
    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   { type: 'export_to_excel' ,path:'internal-audit' }

    // ]);

    this.pageChange(1);
      
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditSchedulesStore.setCurrentPage(newPage);
    this._auditScheduleService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Returns default image
   getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }



  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  gotToAuditScheduleDetails(id:number){
    this._router.navigateByUrl('/internal-audit/audit-schedules/'+id);
  }

  // for opening modal
  openFormModal() {

    setTimeout(() => {
      $(this.scheduleDateModal.nativeElement).modal('show');
    }, 100);
  }

  editAuditSchedule(id:number){
    event.stopPropagation();
    const auditSchedule: AuditSchedules = AuditSchedulesStore.getAuditSCheduleById(id);
    //set form value
    this.scheduleDateObject.values = {
      id: auditSchedule.id,
      start_date: auditSchedule.start_date,
      end_date: auditSchedule.end_date
    }
    this.scheduleDateObject.type = 'Edit';
    this.openFormModal();
  }

  closeDateUpdateModal(){
    $(this.scheduleDateModal.nativeElement).modal('hide');
    this.scheduleDateObject.type = null;
    this.scheduleDateObject.values = null;
    this.pageChange();
    this._utilityService.detectChanges(this._cdr);
  }


  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  createImageUrl(token) {
   
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  gotoUserDetails(id){
    this._router.navigateByUrl('/human-capital/users/'+id);
  }

  // for sorting
  sortTitle(type: string) {
    // AuditableItemMasterStore.setCurrentPage(1);
    this._auditScheduleService.sortAuditScheduleList(type, SubMenuItemStore.searchText);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditSchedulesStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.scheduleDateUpdateEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    AuditSchedulesStore.searchText = '';
  }



}
