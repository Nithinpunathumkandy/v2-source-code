import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';
import { MockDrillService } from 'src/app/core/services/mock-drill/mock-drill/mock-drill.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MockDrillResponseServiceMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-response-service-store';
import { MockDrillChecksMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-checks-store';
import { MockDrillResponseServiceService } from 'src/app/core/services/masters/mock-drill/mock-drill-response-service/mock-drill-response-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-info',
  templateUrl: './mock-drill-info.component.html',
  styleUrls: ['./mock-drill-info.component.scss']
})
export class MockDrillInfoComponent implements OnInit {
  @ViewChild('reviewPopup') reviewPopup: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;
  @ViewChild('confirmPopup') confirmPopup: ElementRef;
  @ViewChild('workflowPopup') workflowPopup: ElementRef
  MockDrillStore = MockDrillStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  ImportItemStore = ImportItemStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MockDrillResponseServiceMasterStore = MockDrillResponseServiceMasterStore;
  popupControlMockDrillEventSubscription: any;
  mockDrillDetails: any;
  reactionDisposer: IReactionDisposer;
  tempServiceChecks: any;
  responseServiceChecks: any;
  mockDrillReviewSubscription: any;
  mockDrillHistorySubscription: any;
  showParticipants: boolean = false;
  showMembers: boolean = false;
  confirmationObject = {
    id: '',
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };

  workflowObject = {
    type: false
  }

  constructor(
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _organizationFileService: OrganizationfileService,
    private _mockDrillService: MockDrillService,
    private route: ActivatedRoute,
    private _mockDrillResponseService: MockDrillResponseServiceService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.getMockDrillDetails();
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editMockDrill();
            break;
          case "export_to_excel":
            this._mockDrillService.exportToPdf(MockDrillStore?.selected?.mock_drill_reports[0]?.id);
            break;
          case 'submit':
            $(this.reviewPopup.nativeElement).modal('show');
            break
          case 'approve':
            $(this.reviewPopup.nativeElement).modal('show');
            break
          case 'revert':
            this.revertMockDrill(MockDrillStore.mock_drill_id)
            break
          case 'history':
            this.getMockDrillHistory();
            break
          case 'workflow':
            this.openWorkflowModal();
            break
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._mockDrillService.importParticipantsData(ImportItemStore.getFileDetails).subscribe(res => {
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          this.getMockDrillDetails();
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        }, (error) => {
          if (error.status == 422) {
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if (error.status == 500 || error.status == 403) {
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", buttonText: '' });
    this.mockDrillReviewSubscription = this._eventEmitterService.reviewMockDrillModal.subscribe(element => {
      this.modalControl('review', element);
      $(this.reviewPopup.nativeElement).modal('hide');
    })
    this.mockDrillHistorySubscription = this._eventEmitterService.mockDrillHistoryModal.subscribe(element => {
      if (element)
        $(this.historyPopup.nativeElement).modal('hide');
    })
    this.popupControlMockDrillEventSubscription = this._eventEmitterService.deletePopup.subscribe(element => {
      if (element)
        this.modalControl('revert', element);
      else
        $(this.confirmPopup.nativeElement).modal('hide');
    })
    this.getMOckDrillResponseService();
  }
  modalControl(val, item) {
    switch (val) {
      case 'revert': this.revert(item)
        break;
      case 'review': this.getMockDrillDetails();
        break;
    }
  }
  // Revert MOck Drill 
  revert(status) {
    if (status && this.confirmationObject.id) {
      SubMenuItemStore.revertClicked = true;
      this.confirmationObject.id = null;
      this._mockDrillService.reviewMockDrill('revert', '').subscribe(res => {
        this.closeConfirmationPopup();
        this.clearconfirmationObject();
        this._utilityService.detectChanges(this._cdr);
        MockDrillStore.unsetIndividualMockDrill();
        SubMenuItemStore.revertClicked = false;
        this.getMockDrillDetails();
        $(this.reviewPopup.nativeElement).modal('hide');
      }, (error => {
        this.closeConfirmationPopup();
        this.clearconfirmationObject();
      }))
    }
    else {
      this.closeConfirmationPopup();
      this.clearconfirmationObject();
    }
  }
  clearconfirmationObject() {
    this.confirmationObject.id = null;
  }
  revertMockDrill(val) {
    this.confirmationObject.id = val;
    this.confirmationObject.type = 'Confirm';
    this.confirmationObject.title = 'revert_mock_drill';
    this.confirmationObject.subtitle = 'revert_mock_drill';
    $(this.confirmPopup.nativeElement).modal('show');
  }
  closeConfirmationPopup() {
    $(this.confirmPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }
  // Edit Mock Drill
  editMockDrill() {
    MockDrillStore.mock_drill_id = MockDrillStore.selected.id;
    this._router.navigateByUrl('mock-drill/mock-drills/edit');
  }

  getMOckDrillResponseService() {
    var params = '';
    if (this.responseServiceChecks == undefined) this.responseServiceChecks = []
    this._mockDrillResponseService.getItems(false, params, true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //setting task phase id and type when opening form
  setResponsesServiceChecks(id) {
    MockDrillStore.responseServiceId = id
    MockDrillChecksMasterStore.response_service_check_id = id;
    this.getFiltedResponseServiceChecks();
  }
  getFiltedResponseServiceChecks() {
    this.tempServiceChecks = MockDrillStore.selected.mock_drill_checks.filter(x => x.mock_drill_response_service_checks.mock_drill_response_service_id == MockDrillChecksMasterStore.response_service_check_id);
    this._utilityService.detectChanges(this._cdr)
  }
  getMockDrillDetails() {
    MockDrillStore.unsetIndividualMockDrill();
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id'];
      if (id) {
        MockDrillStore.setMockDrillId(id);
        MockDrillStore.loaded = true;
        this._mockDrillService.getItem(MockDrillStore.mock_drill_id).subscribe(res => {
          setTimeout(() => {
            MockDrillStore.loaded = false;
            this.mockDrillDetails = MockDrillStore.selected;
            this.setResponsesServiceChecks(MockDrillResponseServiceMasterStore.allItems[0].id);
            this.setClass(MockDrillResponseServiceMasterStore.allItems[0].id); this._utilityService.detectChanges(this._cdr);
            MockDrillStore.mockDrillStatus = MockDrillStore.selected.mock_drill_plan.mock_drill_status.languages[0].pivot.title;
            this.setSubMenu();
          }, 1000);
        });
      }
      else
        this._router.navigateByUrl('mock-drill/mock-drills');
    });
  }
  setSubMenu() {
    let subMenuItems;
    // if (MockDrillStore.selected?.submitted_by == null && AuthStore.user.id == MockDrillStore.selected?.created_by.id) {
    //   let subMenuItems = [
    //     { activityName: 'LIST_MOCK_DRILL_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
    //     { activityName: null, submenuItem: { type: 'workflow' } },
    //     { activityName: 'UPDATE_MOCK_DRILL', submenuItem: { type: 'edit_modal' } },
    //     { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
    //     { activityName: 'SUBMIT_MOCK_DRILL', submenuItem: { type: 'submit' } }
    //   ]
    //   this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    // }

    // if (MockDrillStore.selected.next_review_user_level == null) {
    //   let subMenuItems = [
    //     { activityName: 'LIST_MOCK_DRILL_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
    //     { activityName: null, submenuItem: { type: 'workflow' } },
    //     { activityName: 'UPDATE_MOCK_DRILL', submenuItem: { type: 'edit_modal' } },
    //     { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
    //   ]
    //   if (MockDrillStore.selected.submitted_by == null && MockDrillStore.selected?.workflow_items?.length > 0 && AuthStore.user.id == MockDrillStore.selected.created_by.id)
    //     subMenuItems.push({ activityName: 'SUBMIT_MOCK_DRILL', submenuItem: { type: 'submit' } });
    //   this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    // }
    // if (MockDrillStore.selected.next_review_user_level == 1) {
    //   let subMenuItems = [
    //     { activityName: 'LIST_MOCK_DRILL_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
    //     { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
    //   ]
    // if (AuthStore.user.id == MockDrillStore.selected.mock_drill_observations.approver.id) {
    //   subMenuItems.push({ activityName: 'APPROVE_MOCK_DRILL', submenuItem: { type: 'approve' } });
    //   subMenuItems.push({ activityName: 'REVERT_MOCK_DRILL', submenuItem: { type: 'revert' } });
    // }
    //   this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    // }
    // if (MockDrillStore.selected.next_review_user_level == 2) {
    //   let subMenuItems = [
    //     { activityName: 'EXPORT_MOCK_DRILL', submenuItem: { type: 'export_to_excel' } },
    //     { activityName: 'LIST_MOCK_DRILL_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
    //     { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
    //   ]
    //   this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    // }
    console.log(toJS(MockDrillStore.selected))
    if (MockDrillStore.mockDrillStatus != 'completed') {

      if (MockDrillStore.selected.submitted_by == null && MockDrillStore.selected.work_flow_items.length > 0 && this.isProperUser()) {
        subMenuItems = [
          { activityName: 'UPDATE_MOCK_DRILL', submenuItem: { type: 'edit_modal' } },
          { activityName: 'SUBMIT_MOCK_DRILL', submenuItem: { type: 'submit' } },
          { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
        ]
        MockDrillStore.mockDrillWorkflowStatus = "submit";
      }
      else {
        if (this.isUser() && MockDrillStore.selected.submitted_by != null) {
          if (MockDrillStore.selected.next_review_user_level == MockDrillStore.selected.work_flow_items[MockDrillStore.selected.work_flow_items.length - 1]?.level) {
            subMenuItems = [
              { activityName: null, submenuItem: { type: 'approve' } },
              { activityName: null, submenuItem: { type: 'revert' } },
              { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
            ]
            MockDrillStore.mockDrillWorkflowStatus = "approve";
          }
          else if (MockDrillStore.selected.next_review_user_level != MockDrillStore.selected.work_flow_items[MockDrillStore.selected.work_flow_items.length - 1]?.level) {
            subMenuItems = [
              { activityName: null, submenuItem: { type: 'review_submit' } },
              { activityName: null, submenuItem: { type: 'revert' } },
              { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
            ]
            MockDrillStore.mockDrillWorkflowStatus = "revert"
          }
        }
        else {
          subMenuItems = [
            // { activityName: 'UPDATE_MOCK_DRILL', submenuItem: { type: 'edit_modal' } },
            { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
          ]
        }
      }
    }
    else {
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
      ]
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    this._utilityService.detectChanges(this._cdr);
  }
  isUser() {

    if (MockDrillStore.selected.work_flow_items) {
      if (MockDrillStore.selected.work_flow_items.filter(x => x.level == MockDrillStore.selected.next_review_user_level && x.user_id == AuthStore.user.id).length > 0)
        return true;
      else
        return false
      // for (let i of MockDrillStore.selected.work_flow_items) {
      //   if (i.level == MockDrillStore.selected.next_review_user_level) {
      //     var pos = i.work_flow_items.findIndex(e => e.id == AuthStore.user.id)
      //     if (pos != -1)
      //       return true;
      //     else
      //       return false
      //   }
      // }
    }
    else
      return false;
  }
  isProperUser() {
    return AuthStore.user.id == MockDrillStore.selected?.created_by.id ? true : false;
  }

  setClass(dataId) {
    if (MockDrillStore.responseServiceId == dataId) {
      MockDrillStore.responseServiceId == null
    }
    else
      MockDrillStore.responseServiceId = dataId
    this._utilityService.detectChanges(this._cdr)
  }
  // Returns Image Url according to token
  createImageUrl(token) {
    return this._organizationFileService.getThumbnailPreview('user-profile-picture', token, 160, 262);
  }
  /**
  * Returns image preview
  * @param type Type of image
  * @param token Image token
  */
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getMockDrillHistory() {
    if (this.responseServiceChecks == undefined) this.responseServiceChecks = []
    this._mockDrillService.getMockDrilHistory().subscribe(res => {
      this.setSubMenu();
      this._utilityService.detectChanges(this._cdr);
      if (MockDrillStore.mockDrillHistory && MockDrillStore.mockDrillHistory.length > 0)
        $(this.historyPopup.nativeElement).modal('show');
      else this._utilityService.showWarningMessage('warning', 'no_data_found');
    })
  }
  getPopupDetails(user, created?: string) {
    if (user) {
      let userDetailObject: any = {};
      userDetailObject['first_name'] = user.first_name;
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation.title ? user.designation.title : user.designation;
      userDetailObject['image_token'] = user.image ? (user.image.token ? user.image.token : null) : null;
      userDetailObject['email'] = user.email;
      userDetailObject['mobile'] = user.mobile;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = user.department ? user.department : null;
      userDetailObject['status_id'] = user.status ? (user.status.id ? user.status.id : 1) : 1;
      userDetailObject['created_at'] = created ? created : null;
      return userDetailObject;
    }
  }
  downloadTemplate() {
    this._mockDrillService.generateParticipantsTemplate();
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  importParticipants() {
    ImportItemStore.setTitle('import_mock_drill_external_participants');
    ImportItemStore.setImportFlag(true);
    $("#import-popup").addClass(' show d-block');
    this._utilityService.detectChanges(this._cdr);
  }

  //Checking user level
  // isUser() {
  //   if(RiskInfoWorkflowStore?.loaded){
  //     for (let i of MockDrillStore.mockDrillHistory) {
  //       if (i.level == MockDrillStore.selected?.next_review_user_level) {
  //         var pos = i.risk_workflow_item_users.findIndex(e => e.id == AuthStore.user.id)
  //         if (pos != -1)
  //           return true;
  //         else
  //           return false
  //       }
  //     }
  //   }
  //   else{
  //     return false;
  //   }
  // }

  openWorkflowModal() {
    this.workflowObject.type = true
    setTimeout(() => {
      $(this.workflowPopup.nativeElement).modal('show');
    }, 1000)
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy() {
    this.showParticipants = false;
    this.showMembers = false;
    // BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.mockDrillDetails = null;
    this.popupControlMockDrillEventSubscription.unsubscribe();
    this.mockDrillReviewSubscription.unsubscribe();
    this.mockDrillHistorySubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
  }

}
