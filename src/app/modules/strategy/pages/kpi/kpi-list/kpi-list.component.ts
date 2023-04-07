import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { KpiService } from 'src/app/core/services/strategy-management/kpi/kpi.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { KpiStore } from 'src/app/stores/strategy-management/kpi.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-kpi-list',
  templateUrl: './kpi-list.component.html',
  styleUrls: ['./kpi-list.component.scss']
})
export class KpiListComponent implements OnInit {
  @ViewChild('otherResponsibleUsers', {static: true}) otherResponsibleUsers: ElementRef;

  reactionDisposer: IReactionDisposer;
  KpiStore = KpiStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  otherResponsibleUsersObject = {
    type: null,
    value: null
  }
  otherResponsibleUsersSubscription: any;
  filterSubscription: Subscription = null;
  
  constructor(private _kpiService : KpiService,private _renderer2: Renderer2, private _router: Router,private _utilityService: UtilityService,
    private _imageService: ImageServiceService,private _intiativeService : InitiativeService,private _startegySercive : StrategyService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService,private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.KpiStore.loaded = false;
      this.pageChange(1);
    })
    
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: '', buttonText: ''});
    var subMenuItems = [
      {activityName: null, submenuItem: {type: 'search'}},
      {activityName:null, submenuItem: {type: 'refresh'}}
    ]
    if(!AuthStore.getActivityPermission(3200,'CREATE_STRATEGY_INITIATIVE')){
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
    this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
    this.reactionDisposer = autorun(() => {      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
         
          // case "template":
          //   this._intiativeService.generateTemplate();
          //   break;
          // case "export_to_excel":
          //   this._intiativeService.exportToExcel();
          //   break;
          case "search":
            KpiStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
            case 'refresh':
              KpiStore.loaded = false
              this.pageChange(1); 
              break
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
    });

    this.otherResponsibleUsersSubscription = this._eventEmitterService.otherResponsibleUserModal.subscribe(res=>{
      this.closeResponsibleUsersModal();
    })

    RightSidebarLayoutStore.filterPageTag = 'strategy_kpi';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
    'organization_ids',
    'division_ids',
    'department_ids',
    'section_ids',
    'sub_section_ids',
    'strategy_kpi_data_type_ids',
    'kpi_calculation_type_ids',
    'user_ids',
    'kpi_owner_ids',
    'strategy_review_frequency_ids'
    ]);

    this.pageChange(1);
  }

  pageChange(newPage:number = null){
    if (newPage) KpiStore.setCurrentPage(newPage);
    this._kpiService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      
    })
  }


  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  responsibleOthers(users){
    let item = users.slice(0,3)
  return item
 }


  gotoDetails(data){
      this._router.navigateByUrl('strategy-management/strategy-kpis/'+data.id) 
  }

  openResponsibleUsersModal(users){
    event.stopPropagation();
    this.otherResponsibleUsersObject.type = 'Add';
    this.otherResponsibleUsersObject.value = users
    this.openResponsibleUsers()
  }
  openResponsibleUsers(){
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.otherResponsibleUsers.nativeElement,'show');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'display','block');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'z-index',99999);
  }
  
  closeResponsibleUsersModal(){
    setTimeout(() => {
      // $(this.otherResponsibleUsers.nativeElement).modal('hide');
      this.otherResponsibleUsersObject.type = null;
      this.otherResponsibleUsersObject.value = null;
      this._renderer2.removeClass(this.otherResponsibleUsers.nativeElement,'show');
      this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }
  
  ngOnDestroy(){
    this.otherResponsibleUsersSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    KpiStore.searchText = null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }


}
