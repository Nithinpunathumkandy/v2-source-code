import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ActionPlansService } from 'src/app/core/services/strategy-management/action-plans/action-plans.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ActionPlansStore } from 'src/app/stores/strategy-management/action-plans.store';

@Component({
  selector: 'app-action-plans-list',
  templateUrl: './action-plans-list.component.html',
  styleUrls: ['./action-plans-list.component.scss']
})
export class ActionPlansListComponent implements OnInit {
  @ViewChild('planMesure') planMesure: ElementRef;
  reactionDisposer: IReactionDisposer;
  ActionPlansStore = ActionPlansStore ;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  planMesureObject = {
    type: null,
    value: null,
    id:null
  }
  plnMesureModalModalEventSubscription: any;
  filterSubscription: Subscription = null;
  
  constructor(private _helperService: HelperServiceService, private _actionPlans : ActionPlansService,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,private _router: Router,private _renderer2: Renderer2,private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ActionPlansStore.loaded = false;
      this.pageChange(1);
    })
    
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: '', buttonText: ''});
    var subMenuItems = [
      {activityName: null, submenuItem: {type: 'search'}},
      // {activityName: 'CREATE_STRATEGY_INITIATIVE', submenuItem: {type: 'new_modal'}},
      // {activityName: ' GENERATE_STRATEGY_INITATIVE_TEMPLATE', submenuItem: {type: 'template'}},
      // {activityName: 'EXPORT_STRATEGY_INITATIVE', submenuItem: {type: 'export_to_excel'}},
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
            ActionPlansStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
            case 'refresh':
              ActionPlansStore.loaded = false
              this.pageChange(1); 
              break
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
    });
    this.plnMesureModalModalEventSubscription = this._eventEmitterService.planMesureModal.subscribe(item=>{
      this.closePlanMesure();
      this.pageChange(1);
    })

    RightSidebarLayoutStore.filterPageTag = 'strategy_action_plan';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
    'organization_ids',
    'division_ids',
    'department_ids',
    'section_ids',
    'sub_section_ids',
    'target_unit_ids',
    'strategy_initiative_ids',
    'strategy_initiative_action_plan_status_ids',
    'strategy_initiative_milestone_ids'
    ]);

    this.pageChange(1);

  }

  pageChange(newPage:number = null){
    if (newPage) ActionPlansStore.setCurrentPage(newPage);
    this._actionPlans.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      
    })
  }

  gotoDetails(data){
    this._router.navigateByUrl('strategy-management/strategy-action-plan/'+data.id) 
}

openPlanMesureModal(plan){
  event.stopPropagation();
   this._actionPlans.getInduvalActionPlan(plan.id).subscribe(res=>{
    this.planMesureObject.value = res;
    this.planMesureObject.type = plan.actual_value ? 'Edit' : 'Add';
    this.openPlanMesureModalPopup()
    this._utilityService.detectChanges(this._cdr)
   })
}

openPlanMesureModalPopup(){
  // $(this.noteModal.nativeElement).modal('show');
  this._renderer2.addClass(this.planMesure.nativeElement,'show');
  this._renderer2.setStyle(this.planMesure.nativeElement,'display','block');
  this._renderer2.setStyle(this.planMesure.nativeElement,'z-index',99999);
  this._renderer2.setStyle(this.planMesure.nativeElement,'overflow','auto');
}

closePlanMesure(){
  this.planMesureObject.type = null;
  
  // $(this.kpiMesure.nativeElement).modal('hide');
  this._renderer2.removeClass(this.planMesure.nativeElement,'show');
  this._renderer2.setStyle(this.planMesure.nativeElement,'display','none');
  $('.modal-backdrop').remove();
  this._utilityService.detectChanges(this._cdr);
}

ngOnDestroy(){
  this.plnMesureModalModalEventSubscription.unsubscribe();
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  ActionPlansStore.searchText = null;
  SubMenuItemStore.searchText = '';
  ActionPlansStore.loaded;
  this._rightSidebarFilterService.resetFilter();
  this.filterSubscription.unsubscribe();
  RightSidebarLayoutStore.showFilter = false;

}

}
