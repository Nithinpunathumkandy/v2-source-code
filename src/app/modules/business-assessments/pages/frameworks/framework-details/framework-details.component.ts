import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { FrameworksService } from 'src/app/core/services/business-assessments/frameworks/frameworks.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FrameworksStore } from 'src/app/stores/business-assessments/frameworks.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';

declare var $: any;

@Component({
  selector: 'app-framework-details',
  templateUrl: './framework-details.component.html',
  styleUrls: ['./framework-details.component.scss']
})
export class FrameworkDetailsComponent implements OnInit {
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  FrameworksStore = FrameworksStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  userDetailObject = {
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
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle:''
  };
  frameworkSubscriptionEvent: any;
  AppStore = AppStore;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  frameworkObject = {
    component: 'BusinessAssessment',
    values: null,
    type: null
  };
  constructor(private _frameworksService: FrameworksService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private route: ActivatedRoute,
    private _renderer2: Renderer2,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
     
      this.FrameworksStore.setFrameworkId(id);
      this.setDetails();
    });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [];
      // var subMenuItems = [
      //   { activityName: 'UPDATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'edit_modal' } },
      //   { activityName: 'DELETE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'delete' } },
      //   { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/frameworks' } },
      // ]
      // this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);


      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "delete":
            this.deleteFramework(FrameworksStore.frameworkId);
            break;
          case "edit_modal":
            this.editFramework(FrameworksStore.frameworkId);
            break;
          case "deactivate":
            this.deactivate(FrameworksStore.frameworkId);
            break;
          case "activate":
            this.activate(FrameworksStore.frameworkId);
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (SubMenuItemStore.clikedSubMenuItem) {

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (FrameworksStore.individual_framework_loaded) {
        if (FrameworksStore.individualFrameworkDetails.status.id == 1) {
          subMenuItems = [
            { activityName: 'UPDATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'delete' } },
            { activityName: 'DEACTIVATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'deactivate' } },
            { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/frameworks' } },
          ]
        }
        else {

          subMenuItems = [
            { activityName: 'UPDATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'delete' } },
            { activityName: 'ACTIVATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'activate' } },
            { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/frameworks' } },
          ]
        }
        this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);
      }
    })

    SubMenuItemStore.setNoUserTab(true);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.frameworkSubscriptionEvent = this._eventEmitterService.frameworkControl.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
   
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  setDetails() {     
    this._frameworksService.getItem(FrameworksStore.frameworkId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      // if (res['status'].id == 1) {

      // }
    })
  }

  editFramework(id) {

    this._frameworksService.getItem(id).subscribe(res => {


      this.frameworkObject.values = {
        id: res['id'],
        title: res['title'],
        description: res['description'],
        maturity_models: res['maturity_models'],
        is_control_assessment:res['is_control_assessment'],
        option: res['business_assessment_framework_options']
      }
      this.frameworkObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);

    })
  }

  deactivate(id) {

    this.deleteObject.id = id;
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.subtitle = 'Are you sure you want to deactivate this framework?';
    $(this.deletePopup.nativeElement).modal('show');

  }
  activate(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Activate';
    this.deleteObject.subtitle = 'Are you sure you want to activate this framework?';
    $(this.deletePopup.nativeElement).modal('show');
  }

  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    this.frameworkObject.type = null;
  }

  viewMore(type) {
    if (type == 'more')
      FrameworksStore.view_more = true;
    else
      FrameworksStore.view_more = false;
    this._utilityService.detectChanges(this._cdr);
  }


  deleteFramework(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'Are you sure you want to delete this framework?';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;

  }

  /**
 * Delete the framework
 * @param id -franework id
 */
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._frameworksService.delete(this.deleteObject.id);
          break;
        case 'Deactivate': type = this._frameworksService.deactivate(this.deleteObject.id);
          break;
        case 'Activate': type = this._frameworksService.activate(this.deleteObject.id);
          break;
      }

      type.subscribe(resp => {
        this.closeConfirmationPopUp();
        // setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if (this.deleteObject.type == 'Deactivate' || this.deleteObject.type == 'Activate') {
          this.addSubmenu();
        }
        if (this.deleteObject.type == '') {

          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('/business-assessments/frameworks');



        }
        // }, 500);
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        setTimeout(() => {
          if (error.status == 405) {
            //this.deactivate(this.deleteObject.id);
            //this.addSubmenu();
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.closeConfirmationPopUp();
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  addSubmenu() {

    setTimeout(() => {
      if (FrameworksStore.individualFrameworkDetails.status.id == 1) {
        var subMenuItems = [
          { activityName: 'UPDATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'delete' } },
          { activityName: 'DEACTIVATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'deactivate' } },
          { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/frameworks' } },
        ]
      }
      else {

        var subMenuItems = [
          { activityName: 'UPDATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'delete' } },
          { activityName: 'ACTIVATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'activate' } },
          { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/frameworks' } },
        ]
      }
      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }, 250);


  }

  closeConfirmationPopUp() {
    // setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    // }, 250);
  }

  getPopupDetails(user) {
    this.userDetailObject.first_name = user.first_name;
    this.userDetailObject.last_name = user.last_name;
    this.userDetailObject.designation = user.designation;
    this.userDetailObject.image_token = user.image.token;
    this.userDetailObject.email = user.email;
    this.userDetailObject.mobile = user.mobile;
    this.userDetailObject.id = user.id;
    this.userDetailObject.department = user.created_by_department ? user.created_by_department : null;
    this.userDetailObject.status_id = user.created_by_status_id ? user.created_by_status_id : 1;
    return this.userDetailObject;
  }
  getArrayFormatedString(type,items){
      
    return this._helperService.getArraySeperatedString(',',type,items);
  }

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.frameworkSubscriptionEvent.unsubscribe();
    FrameworksStore.searchText=null;
    FrameworksStore.unsetIndiviudalFrameworkDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
