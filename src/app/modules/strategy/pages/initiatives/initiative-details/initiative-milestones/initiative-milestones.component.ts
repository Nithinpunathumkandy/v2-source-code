import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { InitiativeStore } from 'src/app/modules/strategy/initiative.store';
// import { InitiativeStore } from 'src/app/modules/strategy/initiative.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;
@Component({
  selector: 'app-initiative-milestones',
  templateUrl: './initiative-milestones.component.html',
  styleUrls: ['./initiative-milestones.component.scss']
})
export class InitiativeMilestonesComponent implements OnInit {
  @ViewChild('milestoneModal', {static: true}) milestoneModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('otherResponsibleUsers', {static: true}) otherResponsibleUsers: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;
  @ViewChild('actionPlanModal', {static: true}) actionPlanModal: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  AppStore = AppStore
  StrategyInitiativeStore = StrategyInitiativeStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  reactionDisposer: IReactionDisposer;
  milestoneObject = {
    type: null,
    value: null
  }

  otherResponsibleUsersObject = {
    type: null,
    value: null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  historyObject = {
    type: null,
    value: null,
    id: null
  }

  actionPlanObject = {
    milestoneID:null,
    type: null,
    value: null
  }

  historyModalEventSubscription: any;
  mileStoneModalSubscription: any;
  popupControlEventSubscription: any;
  otherResponsibleUsersSubscription: any;
  actionPlanModalSubscription:any;

  constructor(private _imageService: ImageServiceService,
    private _initiativeService : InitiativeService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _router: Router,) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'New Milestone'});
    this.reactionDisposer = autorun(() => { 
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
             this.editStrategyInitiative();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.openMileStoneModal();
       NoDataItemStore.unSetClickedNoDataItem();
     }
     })
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: StrategyMappingStore.componentFrom ? '../../strategy-mappings/'+StrategyStore._strategyProfileId : "../"},
      {type: !StrategyInitiativeStore.is_mileStoneReq ?  "edit_modal" : null}
    ]);

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteMilestone(item);
    })
    this.mileStoneModalSubscription = this._eventEmitterService.mileStoneModal.subscribe(res=>{
      this.closeMileStoneModal();
      this.getMileStones()
    })
    this.historyModalEventSubscription = this._eventEmitterService.initiativeHistoryModalControl.subscribe(item => {
      this.closeHistoryModal();
    })
    this.otherResponsibleUsersSubscription = this._eventEmitterService.otherResponsibleUserModal.subscribe(res=>{
      this.closeResponsibleUsersModal();
    })

    this.actionPlanModalSubscription = this._eventEmitterService.actionPlanModal.subscribe(res=>{
      this.closeactionPlanModal();
    });

    // if(!InitiativeStore.is_mileStoneReq){
      this.getActionPlans()

    // }else{
      this.getMileStones()

    // }

  
  }

  editStrategyInitiative(){
    this._initiativeService.getInduvalInitiative(StrategyInitiativeStore.selectedInitiativeId).subscribe(res=>{
      StrategyStore.setSelectedId(res.strategy_profile.id)
      StrategyStore.setObjectiveId(res.strategy_profile_objective.id)
      StrategyInitiativeStore.is_actionPlan = true;
      this._router.navigateByUrl('strategy-management/strategy-initiatives/edit');
      this._utilityService.detectChanges(this._cdr)
    });
  }
    getActionPlans(){
      this._initiativeService.getActionPlan().subscribe(res=>{
        SubMenuItemStore.setSubMenuItems([
          {type: "close", path: StrategyMappingStore.componentFrom ? '../../strategy-mappings/'+StrategyStore._strategyProfileId : "../"},
          {type: !StrategyInitiativeStore.is_mileStoneReq ?  "edit_modal" : null}
        ]);
        this._utilityService.detectChanges(this._cdr);
      })
    }



  getMileStones(){
    this._initiativeService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }
  

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

 
  openMileStoneModal(){
    this.milestoneObject.type = 'Add';
    if(StrategyInitiativeStore.milesstones.length > 0){
      StrategyInitiativeStore.mileStoneStartDate = this._helperService.processDate(StrategyInitiativeStore.milesstones.slice(-1)[0].start_date,'split')
      StrategyInitiativeStore.mileStoneEndDate = this._helperService.processDate(StrategyInitiativeStore.milesstones.slice(-1)[0].end_date,'split')
    }
    this.openMileStone()
  }
  openMileStone(){
    // $(this.milestoneModal.nativeElement).modal('show');

    this._renderer2.addClass(this.milestoneModal.nativeElement,'show');
    this._renderer2.setStyle(this.milestoneModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.milestoneModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.milestoneModal.nativeElement,'z-index',99999);
  }

  closeMileStoneModal(){
    setTimeout(() => {
      // $(this.milestoneModal.nativeElement).modal('hide');
      this.milestoneObject.type = null;
      this.milestoneObject.value = null;
      this._renderer2.removeClass(this.milestoneModal.nativeElement,'show');
      this._renderer2.setStyle(this.milestoneModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

   openResponsibleUsersModal(users){
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

  editMileStone(id){
    this._initiativeService.getInduvalMilestons(id).subscribe(res=>{
      this.milestoneObject.type = 'Edit';
      this.milestoneObject.value = res;
      res.action_plans.map(data=>{
        StrategyInitiativeStore.setActionPlan(data)
      })
      this.openMileStone()
      this._utilityService.detectChanges(this._cdr);

    })
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Milestone';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  closeMilestone(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Close';
    this.popupObject.id = id;
    this.popupObject.title = 'closeMilestone';
    this.popupObject.subtitle = 'Are you sure to Close';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }
  closeActionPlan(plan) {
    event.stopPropagation();
    StrategyInitiativeStore._selectedMilestoneId = plan.strategy_initiative_milestone_id;
    this.popupObject.type = 'Close';
    this.popupObject.id = plan.id;
    this.popupObject.title = 'closeActionPlan';
    this.popupObject.subtitle = 'Are you sure to Close';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  activateMilestone(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activateMilestone';
    // this.popupObject.model = 'activate'
    this.popupObject.subtitle = 'strategy_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  passiveMilestone(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Passivate';
    this.popupObject.id = id;
    // this.popupObject.model = 'passivate'
    this.popupObject.title = 'passivateMilestone';
    this.popupObject.subtitle = 'common_passive_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  activateActionPlan(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activateActionPlan';
    // this.popupObject.model = 'activate'
    this.popupObject.subtitle = 'strategy_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  passiveActionPlan(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Passivate';
    this.popupObject.id = id;
    // this.popupObject.model = 'passivate'
    this.popupObject.title = 'passivateActionPlan';
    this.popupObject.subtitle = 'common_passive_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearPopupObject() {
    this.popupObject.id = null;
    StrategyInitiativeStore._selectedMilestoneId = null;
  }

     // modal control event
 modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case '': this.deleteProfile(status)
      break;
  }

}

  deleteProfile(status: boolean) {
    if (status && this.popupObject.id) {
      
      this._initiativeService.deleteMileStone(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  deleteMilestone(status) {//delete
    let deleteId = [];
    let deleteData;
    let dataObject = {
      comment : null
    }
    if (status && this.popupObject.id) {  
      switch(this.popupObject.title){
        case 'Milestone':
          deleteData = this._initiativeService.deleteMileStone(this.popupObject.id);
          break;
        case 'closeMilestone':
          deleteData = this._initiativeService.closeMileStone(this.popupObject.id);
          break;
        case 'closeActionPlan':
          deleteData = this._initiativeService.closeActionPlan(this.popupObject.id);
          break;
        case 'activateActionPlan':
          deleteData = this._initiativeService.activateActionPlan(this.popupObject.id,dataObject);
          break;
        case 'passivateActionPlan':
          deleteData = this._initiativeService.passivateActionPlan(this.popupObject.id,dataObject);
          break;
        case 'activateMilestone':
          deleteData = this._initiativeService.activateMileStone(this.popupObject.id,dataObject);
          break;
        case 'passivateMilestone':
          deleteData = this._initiativeService.passivateMileStone(this.popupObject.id,dataObject);
          break;
      }

      deleteData.subscribe(resp => {
        // if(this.popupObject.title == 'objective' || this.popupObject.title == 'closeObjective'){
        //   this.getObjectives(this.selectedFocusAreaId)          
        // }else if(this.popupObject.title == 'kpi' || this.popupObject.title == 'closeKPI'){
        //   this.getKpiList()
        // }
          this._utilityService.detectChanges(this._cdr);
        this.clearPopupObject();
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 250);
      },(err: HttpErrorResponse) => {
        if (err.status == 423) {
          this._utilityService.showErrorMessage("error",err.error.message ) 
        }
      });
    }
    else {
      this.clearPopupObject();
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
    }

  
  }


  responsibleOthers(users){
      let item = users.slice(0,3)
    return item
   }

   // History Modal
  openHistoryModal(id,item) {
    // this.historyPageChange(1);
    this.historyObject.type = item;
    this.historyObject.id = id;
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryModal() {
    this.historyObject.type = null;
    this.historyObject.id = null;
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
    StrategyStore.unsetHistory();
  }

  openActionPlanModal(mileStoneId?){
    this.actionPlanObject.milestoneID = mileStoneId ? mileStoneId : null;
    this.actionPlanObject.type = 'Add';
    this.openActionPlan()
  }

  editActionPlan(plan,mileStoneId?){
    this.actionPlanObject.milestoneID = mileStoneId ? mileStoneId : null;
    this.actionPlanObject.value = plan;
    this.actionPlanObject.type = "Edit";
    this.openActionPlan()
  }
  
  openActionPlan(){
    StrategyInitiativeStore.selectedEndDate = StrategyInitiativeStore.induvalInitiative?.end_date ? this._helperService.processDate( StrategyInitiativeStore.induvalInitiative?.end_date,'split') : '';
    StrategyInitiativeStore.selectedStrartDate = StrategyInitiativeStore.induvalInitiative?.start_date  ? this._helperService.processDate(StrategyInitiativeStore.induvalInitiative?.start_date,'split') : '';
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.actionPlanModal.nativeElement,'show');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement,'z-index',99999);
  }

  closeactionPlanModal(){
    // this.setActionPlans()
      this.getActionPlans();
      this.getMileStones();
    setTimeout(() => {
      this.actionPlanObject.type = null;
      this.actionPlanObject.value = null;
      this._renderer2.removeClass(this.actionPlanModal.nativeElement,'show');
      this._renderer2.setStyle(this.actionPlanModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  ngOnDestroy(){
    StrategyInitiativeStore.mileStonesLoaded = false;
    this.mileStoneModalSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.otherResponsibleUsersSubscription.unsubscribe();
    StrategyInitiativeStore._actionPlans = []
    

  }


}
