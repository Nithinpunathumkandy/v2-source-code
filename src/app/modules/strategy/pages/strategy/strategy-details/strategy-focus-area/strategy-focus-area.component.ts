import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;

@Component({
  selector: 'app-strategy-focus-area',
  templateUrl: './strategy-focus-area.component.html',
  styleUrls: ['./strategy-focus-area.component.scss']
})
export class StrategyFocusAreaComponent implements OnInit {
  @ViewChild('focusAreaModal') focusAreaModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;

  AuthStore = AuthStore
  AppStore = AppStore;
  StrategyStore = StrategyStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;

  strategyEmptyList : string = 'common_nodata_title'
  reactionDisposer: IReactionDisposer;

  focusAreaObject = {
    type: null,
    value: null
  }

  deleteObjects = {
    id: null,
    title: '',
    type: '',
    subtitle:'',
    model:''
  };

  historyObject = {
    type: null,
    value: null,
    id:null
  }

  // subscription
  focusAreaModalEventSubscription: any;
  confirmationEventSubscription: any;
  historyModalEventSubscription : any;

  constructor(private _helperService: HelperServiceService,private _route: Router,private _renderer2: Renderer2,
    private _service : StrategyService,private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
             this.openFocusAreaModal();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
    });
    SubMenuItemStore.setSubMenuItems([
      { type: this.calculateWeightage() != 100 ?  "new_modal" : '' },
      {type: "close", path: StrategyMappingStore.componentFrom ? '../../strategy-mappings/'+StrategyStore._strategyProfileId : "../"}
    ]);
    this.focusAreaModalEventSubscription = this._eventEmitterService.focusAreaModal.subscribe(item => {
      this.closeFocusAreaModal();
      this.getFocusArea()
    })
    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })
    this.historyModalEventSubscription = this._eventEmitterService.profileHistoryModalControl.subscribe(item => {
      this.closeHistoryModal();
    })
  this.getFocusArea();
  StrategyStore.currentTab = 'focusArea'
  }

  editStrategyProfile(){
    event.stopPropagation();
    this._service.getItem(StrategyStore._strategyProfileId).subscribe(res=>{
      this._route.navigateByUrl('strategy-management/strategy-profiles/edit');
      this._utilityService.detectChanges(this._cdr)
    });

  }

  getFocusArea(){
   this._service.focusAreaList().subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
    SubMenuItemStore.setSubMenuItems([
      { type: this.calculateWeightage() != 100 ?  "new_modal" : '' },
      {type: "close", path: StrategyMappingStore.componentFrom ? '../../strategy-mappings/'+StrategyStore._strategyProfileId : "../"}
    ]);
   })
  }

  focusAreas(focusAreaList){
    let data = focusAreaList
    if(focusAreaList.length > 1){
      data = data.sort((a,b)=>{return b.weightage - a.weightage  })
    }
    return data
  }

  openFocusAreaModal(){
    this.focusAreaObject.type = 'Add';
    this.openFocusAreaModalPopup();
  }

  openFocusAreaModalPopup(){
    // StrategyStore.totalFocusAreaWeightage = this.calculateWeightage()
    // $(this.focusAreaModal.nativeElement).modal('show');
    this._renderer2.addClass(this.focusAreaModal.nativeElement,'show');
    this._renderer2.setStyle(this.focusAreaModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.focusAreaModal.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.focusAreaModal.nativeElement,'overflow','auto');
  }

  closeFocusAreaModal(){
    this.focusAreaObject.type = null;
    // $(this.focusAreaModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.focusAreaModal.nativeElement,'show');
    this._renderer2.setStyle(this.focusAreaModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  // History Modal
  openHistoryModal(id) {
    // this.historyPageChange(1);
    this.historyObject.type = "Focus Area";
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

  editfocusArea(res){
    if(res){
      let areas  
      this._service.induvalFocusArea(res.id).subscribe(res=>{
        areas = res;
        this.focusAreaObject.value = areas;
        this.focusAreaObject.type = "Edit"
        this.openFocusAreaModalPopup(); 
        this._utilityService.detectChanges(this._cdr);
      })
     
    }
  

  }

  calculateWeightage(){
    let sum = 0;
    for(let i of StrategyStore.focusAreas){
      sum = sum+parseInt(i.weightage);
    }
    return sum;
  }

  deleteProfilFocusArea(id){//delete
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'focusarea';
    this.deleteObjects.model = 'focusarea'
    this.deleteObjects.type = '';
    this.deleteObjects.subtitle = "delete_confirmation_popup_subtitle"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }

  closeProfilFocusArea(id){//delete
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'close';
    this.deleteObjects.model = 'close'
    this.deleteObjects.type = 'Close';
    this.deleteObjects.subtitle = "close_confirmation_popup_subtitle" 
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');
   }, 250);
  }

  activate(id: number) {
    event.stopPropagation();
    this.deleteObjects.type = 'Activate';
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'Activate Strategy Profile Focus Area?';
    this.deleteObjects.model = 'activate'
    this.deleteObjects.subtitle = 'strategy_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  passive(id: number) {
    // event.stopPropagation();
    this.deleteObjects.type = 'Passivate';
    this.deleteObjects.id = id;
    this.deleteObjects.model = 'passivate'
    this.deleteObjects.title = 'Passivate Strategy Profile Focus Area?';
    this.deleteObjects.subtitle = 'common_passive_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  delete(status) {//delete
    let deleteId = [];
    let deleteData;
    let dataObject = {
      comment : null
    }
    if (status && this.deleteObjects.id) {  
      switch(this.deleteObjects.model){
        case 'focusarea':
          deleteData = this._service.deleteFocusArea(this.deleteObjects.id);
          break;
        case 'close':
          deleteData = this._service.closeFocusArea(this.deleteObjects.id);
          break;
          case 'activate':
          deleteData = this._service.activateFocusArea(this.deleteObjects.id,dataObject);
          break;
          case 'passivate':
          deleteData = this._service.passivateFocusArea(this.deleteObjects.id,dataObject);
          break;
      }

      deleteData.subscribe(resp => {
        // if(this.deleteObjects.title == 'focusarea'){
          this.getFocusArea()
          this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
        // }
      },(err: HttpErrorResponse) => {
        if (err.status == 423) {
          this._utilityService.showErrorMessage("error",err.error.message ) 
        }
      });
      }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  
  }

  clearDeleteObject() {//delete
    this.deleteObjects.id = null;
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

  assignUserValues(focus_area) {
    if (focus_area) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }

      userInfoObject.first_name = focus_area?.accountable_user_first_name;
      userInfoObject.last_name = focus_area?.accountable_user_last_name;
      userInfoObject.designation = focus_area?.accountable_user_designation_title;
      userInfoObject.image_token = focus_area?.accountable_user_image_token;
      // userInfoObject.email = focus_area?.email;
      // userInfoObject.mobile = focus_area?.mobile;
      // userInfoObject.id = focus_area?.id;
      // userInfoObject.status_id = focus_area?.status_id
      // userInfoObject.department = focus_area?.department?.title;
      return userInfoObject;
    }
  }

  ngOnDestroy(){
    this.focusAreaModalEventSubscription.unsubscribe();
    this.confirmationEventSubscription.unsubscribe();
    this.historyModalEventSubscription.unsubscribe();
  }

}
