import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ActionPlansService } from 'src/app/core/services/strategy-management/action-plans/action-plans.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { ActionPlansStore } from 'src/app/stores/strategy-management/action-plans.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-strategy-milestone',
  templateUrl: './strategy-milestone.component.html',
  styleUrls: ['./strategy-milestone.component.scss']
})
export class StrategyMilestoneComponent implements OnInit {

  @ViewChild('milestoneModal', {static: true}) milestoneModal: ElementRef;
  
  AppStore = AppStore;
  AuthStore = AuthStore;
  ActionPlansStore =ActionPlansStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  reactionDisposer: IReactionDisposer;
  milestoneObject = {
    type: null,
    value: null
  }
  
  mileStoneModalSubscription:any;
  constructor(private _helperService: HelperServiceService,private _router:Router,private _renderer2: Renderer2,
    private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,private _actionPlans : ActionPlansService,
    private _eventEmitterService:EventEmitterService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {      
      // var subMenuItems = [
      //   {activityName: null, submenuItem: {type: 'search'}},
      //   {activityName: 'CREATE_STRATEGY_INITIATIVE', submenuItem: {type: 'new_modal'}},
      // ]
      // if(!AuthStore.getActivityPermission(3200,'CREATE_STRATEGY_INITIATIVE')){
      //   NoDataItemStore.deleteObject('subtitle');
      //   NoDataItemStore.deleteObject('buttonText');
      // }
      // this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "new_modal":
          //   this.createNewMilestone();
          //   break;       
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        // this.createNewMilestone();
       NoDataItemStore.unSetClickedNoDataItem();
     }
    });
    SubMenuItemStore.setSubMenuItems([
      { type: "close", path: StrategyMappingStore.componentFrom ? '../../strategy-mappings/'+StrategyStore._strategyProfileId : "../" }
    ]);
    // this.mileStoneModalSubscription = this._eventEmitterService.mileStoneModal.subscribe(res=>{
    //   this.closeMileStoneModal();

    // })

    this.getActionPlans(1)
  }

  getActionPlans(newPage:number = null){
    if (newPage) ActionPlansStore.setCurrentPage(newPage);
    this._actionPlans.getItems(true,'?strategy_profile_ids='+StrategyStore.strategyProfileId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr); 
    })
  }

  gotoActionPlanDetails(data){
    this._router.navigateByUrl('strategy-management/strategy-action-plan/'+data.id) 
  }

  createNewMilestone(){
    this.milestoneObject.type = 'Add';
    if(StrategyInitiativeStore.milesstones.length > 0){
      StrategyInitiativeStore.mileStoneStartDate = this._helperService.processDate(StrategyInitiativeStore.milesstones.slice(-1)[0].start_date,'split')
      StrategyInitiativeStore.mileStoneEndDate = this._helperService.processDate(StrategyInitiativeStore.milesstones.slice(-1)[0].end_date,'split')
    }
    this.openMileStone()
  }

  openMileStone(){
    this._renderer2.addClass(this.milestoneModal.nativeElement,'show');
    this._renderer2.setStyle(this.milestoneModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.milestoneModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.milestoneModal.nativeElement,'z-index',99999);
  }

  closeMileStoneModal(){
    setTimeout(() => {
      this.milestoneObject.type = null;
      this.milestoneObject.value = null;
      this._renderer2.removeClass(this.milestoneModal.nativeElement,'show');
      this._renderer2.setStyle(this.milestoneModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  getTitle(initiativeTitle, action_title?){
    let title = (action_title ? action_title+' ' : '')+initiativeTitle
    return title
  }

  getPopupDetails(user){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.created_by_first_name ? user.created_by_first_name : '';
      userDetailObject['last_name'] = user.created_by_last_name ? user.created_by_last_name :'';
      userDetailObject['designation'] = user.created_by_designation? user.created_by_designation: null;
      userDetailObject['image_token'] = user.created_by_image_token ? user.created_by_image_token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.created_by;
      userDetailObject['department'] = typeof(user.created_by_department) == 'string' ? user.created_by_department : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      userDetailObject['created_at'] = user?.created_at;
      return userDetailObject;
    }
  }

  calculatePercentage(actualValue,targetValue){
    let percentage = (actualValue/targetValue)*100;
    return percentage;
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
  }

}
