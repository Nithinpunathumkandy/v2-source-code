import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BAActionPlanStore } from 'src/app/stores/business-assessments/assessments/assessment-action-plan.store';
import { BaActionPlanService } from 'src/app/core/services/business-assessments/action-plans/ba-action-plan.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-assessment-action-plan-list',
  templateUrl: './assessment-action-plan-list.component.html',
  styleUrls: ['./assessment-action-plan-list.component.scss']
})
export class AssessmentActionPlanListComponent implements OnInit {

  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('actionPlanModal') actionPlanModal: ElementRef;
  BAActionPlanStore=BAActionPlanStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  actionPlanFormSubscription:any;
  deleteObject = {
    id: null,
    type: '',
    subtitle:''
  };
  AppStore = AppStore;
  AuthStore = AuthStore;
  userDetailObject = {
    first_name:'',
    last_name:'',
    designation:'',
    image_token:'',
    mobile:null,
    email:'',
    id:null,
    department:'',
    status_id:null
  }
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  filterSubscription: Subscription = null;

  //Giving component as checklist parent to dismiss properly in event emittor.
  //Type is given to handle different ways of handling action plan add/edit.
  actionPlanData={
    values:null,
    type:'submenu-edit',
    component:'checklist-parent'
  }

  openActionPlanPopup:boolean=false;

  frameworkSubscriptionEvent: any = null;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2:Renderer2,
    private _imageService:ImageServiceService,
    private _humanCpitalService:HumanCapitalService,
    private _BAactionPlanService:BaActionPlanService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.filterPageTag = 'business_assessment_action_plan';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'business_assessment_action_plan_status_ids',
      'business_assessment_ids'
    ]);
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.BAActionPlanStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'refresh' } },
        // { activityName: null, submenuItem: { type: 'template' } },
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'search' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "actionplan_nodata_title", subtitle: 'actionplan_nodata_subtitle'});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "new_modal":
          //   setTimeout(() => {
          //     this._utilityService.detectChanges(this._cdr);
          //     this.addNewActionplan();
          //   }, 1000);
          //   break;
          case "refresh":
              BAActionPlanStore.loaded = false;
              this.pageChange(1)
              break;
          // case "template":
          //   this._BAactionPlanService.generateTemplate();
          //   break;
          case "export_to_excel":

            this._BAactionPlanService.exportToExcel();
            break;
          case "search":
            BAActionPlanStore.searchText = SubMenuItemStore.searchText;
            this.searchFrameworkList();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    
    })

    

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.actionPlanFormSubscription=this._eventEmitterService.businessAssessmentActionPlanForm.subscribe(res=>{

      this.closeActionPlanForm()
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.pageChange(1);

    SubMenuItemStore.setNoUserTab(true);
  }

  pageChange(newPage: number = null) {

    if (newPage) BAActionPlanStore.setCurrentPage(newPage);
    this._BAactionPlanService.getItems(false,'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  changeZIndex(){
    if($(this.actionPlanModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.actionPlanModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.actionPlanModal.nativeElement,'overflow','auto');
    }
  }

  gotoDetails(id) {
    // BAActionPlanStore.setActionPlanId(id);
    this._router.navigateByUrl('/business-assessments/action-plans/' + id)
  }

  
  getPopupDetails(user){
    this.userDetailObject.first_name = user.created_by_first_name;
    this.userDetailObject.last_name = user.created_by_last_name;
    this.userDetailObject.designation = user.created_by_designation;
    this.userDetailObject.image_token = user.created_by_image_token;
    this.userDetailObject.email = user.created_by_email;
    this.userDetailObject.mobile = user.created_by_mobile;
    this.userDetailObject.id = user.created_by;
    this.userDetailObject.department = user.created_by_department?user.created_by_department:null;
    this.userDetailObject.status_id = user.created_by_status_id?user.created_by_status_id:1;
    return this.userDetailObject;
  }

    /**
 * 
 * @param type -document -will get thumbnail preview of document or else user profile picture
 * 
 * @param token -image token
 */
createImageUrl(type, token) {

  return this._humanCpitalService.getThumbnailPreview(type, token);
}


getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}


  

  setFrameworkSort(type, callList: boolean = true) {
    this._BAactionPlanService.sortFrameworkList(type, callList);
  }


  searchFrameworkList() {
    BAActionPlanStore.setCurrentPage(1);
    this._BAactionPlanService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  /**
* Delete the framework
* @param id -franework id
*/
delete(status) {
  let type;
  if (status && this.deleteObject.id) {
    switch(this.deleteObject.type){
      case '':type = this._BAactionPlanService.delete(this.deleteObject.id);
      break;
      case 'Deactivate':type = this._BAactionPlanService.deactivate(this.deleteObject.id);
      break;
      case 'Activate':type = this._BAactionPlanService.activate(this.deleteObject.id);
      break;
    }

    type.subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if (BAActionPlanStore.currentPage > 1 && this.deleteObject.type == '') {
          BAActionPlanStore.currentPage = Math.ceil(BAActionPlanStore.totalItems / 15);
          this.pageChange(BAActionPlanStore.currentPage);
        }
      }, 500);
      this.clearDeleteObject();
    },(error=>{
      setTimeout(() => {
        if(error.status == 405){
          this.deactivateActionPlan(this.deleteObject.id);
         this._utilityService.detectChanges(this._cdr);
       }
      }, 100);
      
    }));
  }
  else {
    this.clearDeleteObject();
  }
  setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
  }, 250);

}



deleteActionPlan(id) {
  this.deleteObject.id = id;
  this.deleteObject.type = '';
  this.deleteObject.subtitle = 'delete_actionplan_subtitle';

  $(this.deletePopup.nativeElement).modal('show');
}

deactivateActionPlan(id: number) {

  this.deleteObject.id = id;
  this.deleteObject.type = 'Deactivate';
  this.deleteObject.subtitle = 'deactivate_actionplan_subtitle';

  $(this.deletePopup.nativeElement).modal('show');

}

activateActionPlan(id: number) {

  this.deleteObject.id = id;
  this.deleteObject.type = 'Activate';
  this.deleteObject.subtitle = 'activate_actionplan_subtitle';

  $(this.deletePopup.nativeElement).modal('show');

}

clearDeleteObject() {

  this.deleteObject.id = null;
  this.deleteObject.subtitle = '';
}

 editActionPlan(id) {

   this._BAactionPlanService.getItem(id).subscribe(res => {

    this.actionPlanData.values={
      id:res.id,
      title:res.title,
      description:res.description,
      start_date:this._helperService.processDate(res.start_date,'split'),
      target_date:this._helperService.processDate(res.target_date,'split'),
      responsible_user_id:res.responsible_users,
      checklistId:res.business_assessment_document_content_checklist.id
  }
  this.openActionPlanForm()
  })


}


openActionPlanForm(){
  this.openActionPlanPopup=true
  this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '99999'); 
  this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'block'); 
  $(this.actionPlanModal.nativeElement).modal('show');
  this._utilityService.detectChanges(this._cdr);

}

closeActionPlanForm(){

  $(this.actionPlanModal.nativeElement).modal('hide');
  this.openActionPlanPopup=false;
  this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '9999'); 
  this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'none'); 
  $('.modal-backdrop').remove();

}


ngOnDestroy() {
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  this.deleteEventSubscription.unsubscribe();
  this.idleTimeoutSubscription.unsubscribe();
  this.networkFailureSubscription.unsubscribe();
  SubMenuItemStore.searchText = '';
  BAActionPlanStore.searchText = '';
  BAActionPlanStore.unsetBAActionPlans();
  this._rightSidebarFilterService.resetFilter();
  this.filterSubscription.unsubscribe();
  RightSidebarLayoutStore.showFilter = false;
}

}
