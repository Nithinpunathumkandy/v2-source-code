import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { TestAndExerciseService } from 'src/app/core/services/bcm/test-and-exercise/test-and-exercise.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { TestAndExerciseStore } from 'src/app/stores/bcm/test-exercise/test-and-exercise.store';
import { TestActionPlanStore } from 'src/app/stores/bcm/test-exercise/test-exercise-action-plan-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

declare var $: any;
@Component({
  selector: 'app-test-and-exercises-action-plan-details',
  templateUrl: './test-and-exercises-action-plan-details.component.html',
  styleUrls: ['./test-and-exercises-action-plan-details.component.scss']
})
export class TestAndExercisesActionPlanDetailsComponent implements OnInit {
  @ViewChild('newSpecific', {static: true}) newSpecific: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('actionPlanUpdate') actionPlanUpdate: ElementRef;
  @ViewChild('actionPlanHistory') actionPlanHistory: ElementRef;
  constructor(private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _testActionPlanService:TestAndExerciseService,
    private _router: Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    ) { }
    planObject={
      id: null,
      type: '',
      values: null,
      subtitle: ''
    }
    actionFlag ={
      type: '',
      id: null
    } 
    actionPlanHistoryFlag ={
      type:'',
      id: null
    }
    reactionDisposer: IReactionDisposer;
    OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
    AppStore = AppStore;
    AuthStore = AuthStore;
    eventSubscriptionEvent: any = null;
    TestActionPlanStore=TestActionPlanStore
    popupControlSubscription: any = null;
    modelEventSubscriptionHistory: any;
    modelEventSubscriptionUpdate: any;
  ngOnInit(): void {
    
    NoDataItemStore.setNoDataItems({title:"No action plan has been added", subtitle: 'Click on the below button to add a new  action plan',buttonText: 'New action plan'});
    
    this.reactionDisposer = autorun(() => {  
      var subMenuItems = [
        //{activityName: 'PROJECT_MONITORING_BUDGET_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'new_modal'}},
        {activityName:null, submenuItem: {type: 'close', path: '../'}}
     ]
     this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);

     if (SubMenuItemStore.clikedSubMenuItem) {
      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":
          this.openNewForm();
          break;

        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    } 
    this.eventSubscriptionEvent = this._eventEmitterService.exerciseActionPlanModal.subscribe(item => {
      this.closeNewDeliverable()
      // this.pageChange(1)
    })
    this.popupControlSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteBcp(item);
    })
    this.modelEventSubscriptionHistory = this._eventEmitterService.actionPlanHistoryModal.subscribe(res => {
      this.closeHistoryModal();
    });
    this.modelEventSubscriptionUpdate = this._eventEmitterService.actionPlanUpadateModal.subscribe(res => {
      this.closeModelUpdate();
    });
  
    if(NoDataItemStore.clikedNoDataItem){
      this.openNewForm();
      NoDataItemStore.unSetClickedNoDataItem();
    }
     
    });

    this.pageChange(1)
   
  }

  // getDetails(){

  //  this._testActionPlanService.getActionPlan(TestAndExerciseStore.selectedId).subscribe(res=>{

  //  })
  // }
  openNewForm(){
    this.planObject.type = 'add';
    this.openNewDeliverable()
  }
  openNewDeliverable(){
    setTimeout(() => {
      $(this.newSpecific.nativeElement).modal('show');
    }, 100);
  }
  closeNewDeliverable(){
    this.planObject.type = '';
    setTimeout(() => {
      $(this.newSpecific.nativeElement).modal('hide');
    }, 100);
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

  assignUserValues(user) {
		if (user) {
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

			userInfoObject.first_name = user?.first_name;
			userInfoObject.last_name = user?.last_name;
			userInfoObject.designation = user?.designation;
			userInfoObject.image_token = user?.image.token;
			userInfoObject.email = user?.email;
			userInfoObject.mobile = user?.mobile;
			userInfoObject.id = user?.id;
			userInfoObject.status_id = user?.status.id
			userInfoObject.department = user?.department;
			return userInfoObject;
		}
	}

  pageChange(newPage: number = null) {
    if (newPage) TestActionPlanStore.setCurrentPage(newPage);
    this._testActionPlanService.getActionPlan(false, 'test_and_exercise_ids='+ TestAndExerciseStore.selectedId).subscribe(res => {
      //this._utilityService.detectChanges(this._cdr);
      
    })
   
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  redirectToDetailsPage(id){
    TestAndExerciseStore.selectedId = id
    this._router.navigateByUrl('bcm/test-and-exercises/'+TestAndExerciseStore.selectedId);
  }
  setSort(type) {
    this._testActionPlanService.sortActionPlanList(type);
    this.pageChange();
  }
  editAcionPlan(id: number) {
    event.stopPropagation();
    this._testActionPlanService.getActionPlanData(id).subscribe(res=>{
      this.planObject.type = 'Edit';
      this.planObject.values = res;
      this.openUpdateFormModal();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  openUpdateFormModal(){
    this.openNewDeliverable()
  }
  deleteConfirm(id: number) {
    event.stopPropagation();
    this.planObject.type = '';
    this.planObject.id = id;
    this.planObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  deleteBcp(status: boolean) {
    if (status && this.planObject.id) {
      this._testActionPlanService.deleteActionPlan(this.planObject.id).subscribe(resp => {
       // setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
       // }, 500);
        this.clearPopupObject();
      });
     }
    else {
      this.clearPopupObject();
    }
    // setTimeout(() => {
    //   $(this.confirmationPopUp.nativeElement).modal('hide');
    // }, 250);
  }
  clearPopupObject() {
    this.planObject.id = null;
    //setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
     // }, 250);
  }
  actionFlagSetting(id){
    this.actionFlag.type = 'add';
    this.actionFlag.id = id;
    this.addModelUpdate();
  }
  addModelUpdate() {
   // ActionPlansStore.action_plan_update = true;
    $(this.actionPlanUpdate.nativeElement).modal('show');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModelUpdate() {
    //ActionPlansStore.action_plan_update = false;
    this.actionFlag.type = null;
    $(this.actionPlanUpdate.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    AppStore.showDiscussion = true;
  }
  closeHistoryModal() {
    //ActionPlansStore.action_plan_history = false;
    this.actionPlanHistoryFlag.type = null;
    $(this.actionPlanHistory.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    TestActionPlanStore.unSetActionPlanHistory();
    AppStore.showDiscussion = true;
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
  }
  
  actionPlanHistoryModal(id){
    this.actionPlanHistoryFlag.type = 'add';
    this.actionPlanHistoryFlag.id = id;
    this.openHistoryModal();
  }
  openHistoryModal(){
    $(this.actionPlanHistory.nativeElement).modal('show');
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }
  ngOnDestroy(){
    this.popupControlSubscription.unsubscribe();
  }

}
