import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { AssessmentsService } from 'src/app/core/services/business-assessments/assessments.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('popupModal') popupModal: ElementRef;
  @ViewChild('khDoc') khDoc: ElementRef;
  @ViewChild('popup') popup: ElementRef;

  AuthStore = AuthStore;
  AssessmentsStore = AssessmentsStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle:'',
    position: null
  };
  AppStore = AppStore;
  assessmentSubscriptionEvent: any;
  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null

  }
  assessmentObject = {
    component: 'BusinessAssessment',
    values: null,
    type: null
  };
  idleTimeoutSubscription: any;
  filterSubscription: Subscription = null;
  networkFailureSubscription: any;

  constructor(private _assessmentsService: AssessmentsService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _msTypeOrganizationService: MstypesService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {
    
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AssessmentsStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    this.reactionDisposer = autorun(() => {
      this.addSubmenu()

      // var subMenuItems = [
      //   { activityName: 'CREATE_BUSINESS_ASSESSMENT', submenuItem: { type: 'new_modal' } },
      //   { activityName: 'GENERATE_BUSINESS_ASSESSMENT_TEMPLATE', submenuItem: { type: 'template' } },
      //   { activityName: 'EXPORT_BUSINESS_ASSESSMENT', submenuItem: { type: 'export_to_excel' } },
      //   { activityName: 'BUSINESS_ASSESSMENT_LIST', submenuItem: { type: 'search' } },
      //   {activityName: null, submenuItem: {type: 'user_grid_system'}},
      // ]

      //this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "assessment_nodata_title", subtitle: 'assessment_nodata_subtitle', buttonText: 'add_new_assessment' });


      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.addNewAssessment();
            }, 1000);
            break;

          // case "template":

          //   this._assessmentsService.generateTemplate();
          //   break;
          case "export_to_excel":

            this._assessmentsService.exportToExcel();
            break;
          case "search":
            AssessmentsStore.searchText = SubMenuItemStore.searchText;
            this.searchAssessmentList();
            break;
            case "grid":
            this.setListStyle("grid");
            break;
            case "table":
            this.setListStyle("table");
            break;
          case "refresh":
            AssessmentsStore.loaded = false;
            AssessmentsStore.searchText = null;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewAssessment();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.assessmentSubscriptionEvent = this._eventEmitterService.assessmentControl.subscribe(res => {
      this.closeFormModal();
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })


    this.pageChange(1);

    RightSidebarLayoutStore.filterPageTag = 'assessment';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'business_assessment_status_ids',
      'business_assessment_framework_ids',
      'document_category_ids',
      'document_sub_category_ids',
      'document_sub_sub_category_ids',
      'document_family_ids',
      'document_type_ids',
      'document_status_ids',
      'created_by_user_ids',
      'region_ids',
      'country_ids',
      'document_access_type_ids'
    ]);

    // SubMenuItemStore.setNoUserTab(true);
  }

  pageChange(newPage: number = null) {

    if (newPage) AssessmentsStore.setCurrentPage(newPage);
    this._assessmentsService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getPopupDetails(assessment) {
    this.userDetailObject.id = assessment.created_by;
    this.userDetailObject.first_name = assessment.created_by_first_name;
    this.userDetailObject.last_name = assessment.created_by_last_name;
    this.userDetailObject.designation = assessment.created_by_designation;
    this.userDetailObject.image_token = assessment.created_by_image_token;
    this.userDetailObject.email = assessment.created_by_email;
    this.userDetailObject.mobile = assessment.created_by_mobile;
    this.userDetailObject.department = assessment.created_by_department ? assessment.created_by_department : null;
    this.userDetailObject.status_id = assessment.created_by_status_id ? assessment.created_by_status_id : 1;

    return this.userDetailObject;
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }



  addNewAssessment() {
    this.assessmentObject.type = 'Add';
    this.assessmentObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    $(this.formModal.nativeElement).modal('show');
  }

  searchAssessmentList() {
    AssessmentsStore.setCurrentPage(1);
    this._assessmentsService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  /**
* Delete the likelihood
* @param id -likelihood id
*/
  delete(status) {

    if (status && this.deleteObject.id) {

      this._assessmentsService.delete(this.deleteObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
            if (AssessmentsStore.currentPage > 1) {
              AssessmentsStore.currentPage = Math.ceil(AssessmentsStore.totalItems / 15);
              this.pageChange(AssessmentsStore.currentPage);
            }
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


  closeConfirmationPopUp() {
    // setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    // }, 250);
  }



  editDetails(id) {
    this._assessmentsService.getItem(id).subscribe(res => {


      this.assessmentObject.values = {
        id: res.id,
        title: res.title,
        description: res.description,
        business_assessment_framework: res.business_assessment_framework,
        organizations: res.organizations,
        divisions: res.divisions,
        departments: res.departments,
        sections: res.sections,
        sub_sections: res.sub_sections,
        ms_type_organizations: this.processData(res.ms_type_organizations),
        document_version: res.document_version.id,
      }
      this.assessmentObject.type = 'Edit';

      AssessmentsStore.activeFile = res.document_version;
      AssessmentsStore.activeFile['document_version_id'] = res.document_version.id
      this.getData();
      this._utilityService.detectChanges(this._cdr);

    })
  }

  setAssessmentSort(type, callList: boolean = true) {
    this._assessmentsService.sortAssessmentList(type, callList);
  }


  getData() {
    this._msTypeOrganizationService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {

        $(this.formModal.nativeElement).modal('show');
      }, 300);
    })
  }

  processData(data) {
    let msType = [];
    for (let i of data) {
      msType.push(i.id);
    }
    return msType;
  }


  closeFormModal() {
    AssessmentsStore.activeFile = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');

    }, 100);
    this.assessmentObject.type = null;

  }


  /**
 * 
 * @param type -document -will get thumbnail preview of document or else user profile picture
 * 
 * @param token -image token
 */
  createImageUrl(type, token) {

    return this._documentFileService.getThumbnailPreview(type, token);
  }

  gotoDetails(id) {
    AssessmentsStore.assessmentId = id;
    this._router.navigateByUrl('business-assessments/assessment/' + id)
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }


  deleteAssessment(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_assessment_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';

  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  setListStyle(type) {
    if (type == "grid") AssessmentsStore.listStyle = type;
    if (type == "table") AssessmentsStore.listStyle = type;
  }

  addSubmenu(){
    if(AssessmentsStore.listStyle=='grid'){
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'refresh'}},
        { activityName: 'CREATE_BUSINESS_ASSESSMENT', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_BUSINESS_ASSESSMENT_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_BUSINESS_ASSESSMENT', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'BUSINESS_ASSESSMENT_LIST', submenuItem: { type: 'search' } },
        {activityName: null, submenuItem: {type: 'table'}},
      ]
    }else{
      var subMenuItems = [
        {activityName:null, submenuItem: {type: 'refresh'}},
        { activityName: 'CREATE_BUSINESS_ASSESSMENT', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_BUSINESS_ASSESSMENT_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_BUSINESS_ASSESSMENT', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'BUSINESS_ASSESSMENT_LIST', submenuItem: { type: 'search' } },
        {activityName: null, submenuItem: {type: 'grid'}},
      ]
    }
    this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
  }


  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.assessmentSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AssessmentsStore.searchText = null;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    SubMenuItemStore.searchText = '';
    AssessmentsStore.loaded=false
  }
}
