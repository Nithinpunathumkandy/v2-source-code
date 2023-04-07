import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillProgramService } from 'src/app/core/services/mock-drill/mock-drill-program/mock-drill-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillProgramStore } from 'src/app/stores/mock-drill/mock-drill-program/mock-drill-program-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-mock-drill-program-info',
  templateUrl: './mock-drill-program-info.component.html',
  styleUrls: ['./mock-drill-program-info.component.scss']
})
export class MockDrillProgramInfoComponent implements OnInit {
  @ViewChild('mockDrillPreplanPopup') mockDrillPreplanPopup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  MockDrillProgramStore = MockDrillProgramStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  preplan: any;
  preplanSubscription: any;
  popupControlMockDrillPreplanEventSubscription: any;
  preplanCount: number;
  mockDrillPreplanObject = {
    id: null,
    mock_drill_program_id: null,
    mock_drill_type_id: null,
    start_date: null,
    end_date: null
  }
  deleteObject = {
    type: '',
    title: 'are_you_sure_want_to_delete_this_mock_drill_preplan',
    subtitle: 'are_you_sure_want_to_delete_this_mock_drill_preplan',
    id: null,
    all: false
  };
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _mockDrillProgramService: MockDrillProgramService,
    private route: ActivatedRoute, private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editMockDrillProgram();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.preplanSubscription = this._eventEmitterService.userMockDrillModal.subscribe(element => {
      $(this.mockDrillPreplanPopup.nativeElement).modal('hide');
    })
    this.popupControlMockDrillPreplanEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id'];
      if (id)
        this.getMockDrillProgramDetails(id)
      else
        this._router.navigateByUrl('mock-drill/mock-drill-programs');
    });
  }

  // Modal Control
  modalControl(status: boolean) {
    switch (this.deleteObject.type) {
      case '': this.delete(status)
    }
  }
  getMockDrillProgramDetails(id) {
    MockDrillProgramStore.unsetIndividualMockDrillProgram();
    MockDrillProgramStore.setMockDrillProgramId(id);
    MockDrillProgramStore.loaded = true;
    this._mockDrillProgramService.getItem(MockDrillProgramStore.mock_drill_program_id).subscribe(res => {
      setTimeout(() => {
        MockDrillProgramStore.loaded = false;
        this.setSubMenu();
        // this.getPreplanCount();
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    });
  }
  // Edit Mock Drill
  editMockDrillProgram() {
    MockDrillProgramStore.mock_drill_program_id = MockDrillProgramStore.selectedProgramData.id;
    this._router.navigateByUrl('mock-drill/mock-drill-programs/edit');
  }
  getPopupDetails(user, created?: string) {
    if (user) {
      let userDetailObject: any = {};
      userDetailObject['first_name'] = user.first_name;
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation.title ? user.designation.title : user.designation;
      userDetailObject['image_token'] = user.image?.token;
      userDetailObject['email'] = user.email;
      userDetailObject['mobile'] = user.mobile;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = user.department ? user.department : null;
      userDetailObject['status_id'] = user.status?.id ? user.status?.id : 1;
      userDetailObject['created_at'] = created ? created : null;
      return userDetailObject;
    }
  }
  setSubMenu() {
    if (MockDrillProgramStore.selectedProgramData.mock_drill_program_status["type"] == "closed") {
      let subMenuItems = [
        { activityName: 'LIST_MOCK_DRILL_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
        { activityName: 'UPDATE_MOCK_DRILL', submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drills" } },
      ]
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    }
    else {
      let subMenuItems = [{ activityName: 'UPDATE_MOCK_DRILL_PROGRAM', submenuItem: { type: 'edit_modal' } },
      { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drill-programs" } }]
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    }
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }
  // getPreplanCount() {
  //   this.preplanCount = 0;
  //   MockDrillProgramStore.selectedProgram?.mock_drill_program_preplan.forEach(element => {
  //     this.preplanCount = this.preplanCount + element.count;
  //   });
  // }
  showPreplanPopup(data, type) {
    if (type == "edit")
      this.mockDrillPreplanObject = {
        id: data.id,
        mock_drill_program_id: data.mock_drill_program_id,
        mock_drill_type_id: data.mock_drill_type_id,
        start_date: data.start_date,
        end_date: data.end_date
      }
    else
      this.mockDrillPreplanObject = {
        id: null,
        mock_drill_program_id: MockDrillProgramStore.mock_drill_program_id,
        mock_drill_type_id: null,
        start_date: null,
        end_date: null
      }
    this._utilityService.detectChanges(this._cdr);
    $(this.mockDrillPreplanPopup.nativeElement).modal('show');
  }
  // Delete MOck Drill Preplan
  delete(status) {
    if (status && this.deleteObject.id) {
      this._mockDrillProgramService.deletePreplan(this.deleteObject.id).subscribe(res => {
        this.closeConfirmationPopup();
        this.clearDeleteObject();
        this._utilityService.detectChanges(this._cdr);
        this.getMockDrillProgramDetails(MockDrillProgramStore.mock_drill_program_id)
      }, (error => {
        this.closeConfirmationPopup();
        this.clearDeleteObject();
      }))
    }
    else {
      this.closeConfirmationPopup();
      this.clearDeleteObject();
    }
  }
  //Delete Mock Drill Preplan
  deleteMockDrill(val) {
    this.deleteObject.id = val.id;
    this.deleteObject.all = false;
    this.deleteObject.type = '';
    this.deleteObject.title = 'are_you_sure_want_to_delete_this_mock_drill_preplan';
    this.deleteObject.subtitle = 'are_you_sure_want_to_delete_this_mock_drill_preplan';
    $(this.deletePopup.nativeElement).modal('show');
  }
  ngOnDestroy() {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.preplan = null;
    this.preplanCount = null;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.preplanSubscription.unsubscribe();
    this.popupControlMockDrillPreplanEventSubscription.unsubscribe();
  }
  closeConfirmationPopup() {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
  }
}
