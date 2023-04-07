import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AssessmentService } from 'src/app/core/services/human-capital/assessment/assessment.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssessmentStore } from 'src/app/stores/human-capital/assessment/assessment.store';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AnyAaaaRecord } from 'dns';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

declare var $: any;


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'human-capital-assessment-competency-assessment-page',
  templateUrl: './competency-assessment.page.html',
  styleUrls: ['./competency-assessment.page.scss']
})
export class HumanCapitalAssessmentCompetencyAssessment implements OnInit,OnDestroy {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('resultPopup') resultPopup: ElementRef;
  AppStore = AppStore;
  AssessmentStore = AssessmentStore;
  reactionDisposer: IReactionDisposer;
  deleteObject = {
    title: '',
    id: null,
    position: null,
    subtitle: '',
    type: '',
    userId: null
  };
  selectedTab: string;
  deleteEventSubscription: any;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  userDetailObject = {
    first_name:'',
    last_name:'',
    designation:'',
    image_token:'',
    mobile:null,
    email:'',
    id:null,
    department:'',
    status_id:null,
  }
  userDetailEmployeeObject = {
    first_name:'',
    last_name:'',
    designation:'',
    image_token:'',
    mobile:null,
    email:'',
    id:null,
    department:'',
    status_id:null,
  }

  filterSubscription: Subscription = null;

  constructor(private _assessmentService: AssessmentService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _humanCpitalService: HumanCapitalService,
    private _helperService:HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,) {

  }

  ngOnInit() {
    RightSidebarLayoutStore.showFilter = true;
		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.AssessmentStore.assessment_loaded = false;
		  this.pageChange(1);
		})
    UsersStore.unsetUserId();
    NoDataItemStore.setNoDataItems({ title: "no_assessment_title", subtitle: 'no_assessment_subtitle', buttonText: 'new_assessment_button' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'COMPETENCY_ASSESSMENT_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_USER_COMPETENCY_ASSESSMENT', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_ASSESSMENT', submenuItem: {type: 'export_to_excel'}},
      ]
      if(!AuthStore.getActivityPermission(200,'CREATE_USER_COMPETENCY_ASSESSMENT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(200, subMenuItems);
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openFormModal();
            }, 1000);
            break;
          case "template":
            this._assessmentService.generateTemplate();
            break;
        case "export_to_excel":
            this._assessmentService.exportToExcel();
            break;
          case "search":
            AssessmentStore.searchText = SubMenuItemStore.searchText;
            this.pageChange();
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            AssessmentStore.searchText = '';
            AssessmentStore.assessment_loaded = false;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })
    SubMenuItemStore.setNoUserTab(true);

    AssessmentStore.setOrderBy('desc');
    this.pageChange(AssessmentStore.currentPage);

    RightSidebarLayoutStore.filterPageTag = 'hc_assessment';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  'organization_ids',
		  'division_ids',
		  'department_ids',
		  'section_ids',
		  'sub_section_ids',
      'employee_ids',
      'performed_by_ids'
		]);

  }

  pageChange(newPage: number = 1) {
    if (newPage) AssessmentStore.setCurrentPage(newPage);
    this._assessmentService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  viewDetails(user_id: number, id: number) {
    this._assessmentService.getResult(user_id, id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.resultPopup.nativeElement).modal('show');
      }, 100);
    });
  }

  getCompetencyTitle(competencyId,competencyGroup:any){
    let pos = competencyGroup.competency_score.findIndex(e => e.competency_group.id == competencyId);
    return competencyGroup.competency_score[pos].title;
  }

  editDetails(event,user_id: number, id: number) {
    if(event) event.stopPropagation();
    AssessmentStore.assessmentId = id;
    UsersStore.user_id = user_id;
    this._router.navigateByUrl('/human-capital/assessments/edit-assessment');
  }

  /**
  * Delete the document
  * @param id -document id
  */
  delete(status) {
    if (status && this.deleteObject.id) {
      this._assessmentService.delete(this.deleteObject.userId, this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          if (AssessmentStore.currentPage > 1) {
            AssessmentStore.currentPage = Math.ceil(AssessmentStore.totalItems / 15);
            this.pageChange(AssessmentStore.currentPage);
          }
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearDeleteObject();
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }
  
  getEmployeePopupDetails(user,num){
    // $('.modal-backdrop').remove();
    if(AssessmentStore?.assessments[num]?.employee_id==user?.employee_id){
      this.userDetailEmployeeObject.first_name = user.employee_first_name;
      this.userDetailEmployeeObject.last_name = user.employee_last_name;
      this.userDetailEmployeeObject.designation = user.employee_designation;
      this.userDetailEmployeeObject.image_token = user.employee_image_token;
      this.userDetailEmployeeObject.email = user.employee_email;
      this.userDetailEmployeeObject.mobile = user.employee_mobile;
      this.userDetailEmployeeObject.id = user.employee_id;
      this.userDetailEmployeeObject.department = user.department?user.department:null;
      this.userDetailEmployeeObject.status_id = user.status?.id?user.status?.id:1;
      return this.userDetailEmployeeObject;
    }
     
  }

  getPopupDetails(user,num){
    if(AssessmentStore?.assessments[num]?.performed_by_id==user?.performed_by_id){
      this.userDetailObject.first_name = user.performed_by_first_name;
      this.userDetailObject.last_name = user.performed_by_last_name;
      this.userDetailObject.designation = user.performed_by_designation;
      this.userDetailObject.image_token = user.performed_by_image_token;
      this.userDetailObject.email = user.performed_by_email;
      this.userDetailObject.mobile = user.performed_by_mobile;
      this.userDetailObject.id = user.performed_by_id;
      this.userDetailObject.department = user.department?user.department:null;
      this.userDetailObject.status_id = user.status?.id?user.status?.id:1;
      return this.userDetailObject;
    }
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.position = null;
    this.deleteObject.title = '';
    this.deleteObject.subtitle = '';
    this.deleteObject.type = '';
    this.deleteObject.userId = '';
  }

  deleteDetails(event,user_id, id: number, position: number) {
    if(event) event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.position = position;
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'are_you_sure_delete';
    this.deleteObject.userId = user_id;
    $(this.deletePopup.nativeElement).modal('show');
  }

  // for sorting
  sortTitle(type: string) {
    AssessmentStore.setCurrentPage(1);
    this._assessmentService.sortAssessmentList(type, SubMenuItemStore.searchText);
  }

  openFormModal() {
    this._router.navigateByUrl('/human-capital/assessments/new-assessment');
  }

  cancel() {
    $(this.resultPopup.nativeElement).modal('hide');
  }

  getDefaultGeneralImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImageUrl(type, token) {
    return this._humanCpitalService.getThumbnailPreview(type, token);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    AssessmentStore.currentPage = 1;
    NoDataItemStore.unsetNoDataItems();
    this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }


}