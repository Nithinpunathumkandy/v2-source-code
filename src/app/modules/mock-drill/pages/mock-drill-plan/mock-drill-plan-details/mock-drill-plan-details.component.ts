import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillPlanStore } from 'src/app/stores/mock-drill/mock-drill-plan/mock-drill-plan-store';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { MockDrillPlanService } from 'src/app/core/services/mock-drill/mock-drill-plan/mock-drill-plan.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { number } from '@amcharts/amcharts4/core';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
@Component({
  selector: 'app-mock-drill-plan-details',
  templateUrl: './mock-drill-plan-details.component.html',
  styleUrls: ['./mock-drill-plan-details.component.scss']
})
export class MockDrillPlanDetailsComponent implements OnInit {
  MockDrillPlanStore = MockDrillPlanStore;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  mockDrillPlanDetails: any;
  reactionDisposer: IReactionDisposer;
  constructor(
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _organizationFileService: OrganizationfileService,
    private _mockDrillPlanService: MockDrillPlanService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.mockDrillPlanDetails = null;
    MockDrillPlanStore.unsetMockDrillPlanId();
    MockDrillPlanStore.unsetIndividualMockDrillPlan();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", buttonText: '' });
    this.getMockDrillDetails();
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editMockDrillPlan();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }
  // Edit Mock Drill Plan
  editMockDrillPlan() {
    MockDrillPlanStore.setMockDrillPlanId(MockDrillPlanStore.mock_drill_plan_id);
    this._router.navigateByUrl('mock-drill/mock-drill-plans/edit');
  }

  getMockDrillDetails() {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id'];
      if (id) {
        MockDrillPlanStore.setMockDrillPlanId(id);
        this._mockDrillPlanService.getItem(MockDrillPlanStore.mock_drill_plan_id).subscribe(res => {
          setTimeout(() => {
            this.mockDrillPlanDetails = MockDrillPlanStore.selectedPlan;
            var subMenuItems = [];
            if (this.mockDrillPlanDetails?.mock_drill_status?.mock_drill_status == null || this.mockDrillPlanDetails?.mock_drill_status?.mock_drill_status == 'Planned')
              subMenuItems = [
                { activityName: 'UPDATE_MOCK_DRILL_PLAN', submenuItem: { type: 'edit_modal' } },
                { activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drill-plans" } },
              ]
            else
              subMenuItems = [{ activityName: null, submenuItem: { type: 'close', path: "/mock-drill/mock-drill-plans" } }]
            this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
            this._utilityService.detectChanges(this._cdr);
          }, 100);
        });
      }
      else
        this._router.navigateByUrl('mock-drill/mock-drill-plans');
    })
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
  ngOnDestroy() {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
  }
}
