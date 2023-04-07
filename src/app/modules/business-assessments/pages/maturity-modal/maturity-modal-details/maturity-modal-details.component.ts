import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { MaturityModalService } from 'src/app/core/services/business-assessments/maturity-modal/maturity-modal.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MaturityModalStore } from 'src/app/stores/business-assessments/maturity-modal/maturity-modal-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';

declare var $: any;

@Component({
  selector: 'app-maturity-modal-details',
  templateUrl: './maturity-modal-details.component.html',
  styleUrls: ['./maturity-modal-details.component.scss']
})
export class MaturityModalDetailsComponent implements OnInit {
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  MaturityModalStore = MaturityModalStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle:''
  };
  maturityModalSubscriptionEvent: any;
  AppStore = AppStore;
  maturityModalObject = {
    component: 'maturity_modal',
    values: null,
    type: null
  };
  constructor(private _maturityModalService: MaturityModalService,
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
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"maturity_model",
        path:`/business-assessments/maturity-models`
      });
    }
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
     
      MaturityModalStore.setMaturityModalId(id);
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
            this.deleteFramework(MaturityModalStore.maturityModalId);
            break;
          case "edit_modal":
            this.editFramework(MaturityModalStore.maturityModalId);
            break;
          case "deactivate":
            this.deactivate(MaturityModalStore.maturityModalId);
            break;
          case "activate":
            this.activate(MaturityModalStore.maturityModalId);
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
      if (MaturityModalStore.individualMaturityModalLoaded) {
       
        if (MaturityModalStore.individualMaturityModalDetails.status.id == 1) {
          subMenuItems = [
            { activityName: 'UPDATE_MATURITY_MODEL', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_MATURITY_MODEL', submenuItem: { type: 'delete' } },
            { activityName: 'DEACTIVATE_MATURITY_MODEL', submenuItem: { type: 'deactivate' } },
            { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/maturity-models' } },
          ]
        }
        else {

          subMenuItems = [
            { activityName: 'UPDATE_MATURITY_MODEL', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_MATURITY_MODEL', submenuItem: { type: 'delete' } },
            { activityName: 'ACTIVATE_MATURITY_MODEL', submenuItem: { type: 'activate' } },
            { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/maturity-models' } },
          ]
        }
        
        
        this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);
      }
    })

    SubMenuItemStore.setNoUserTab(true);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.maturityModalSubscriptionEvent = this._eventEmitterService.maturityModalControl.subscribe(res => {
      this.closeFormModal();
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
    this._maturityModalService.getItem(MaturityModalStore.maturityModalId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      // if (res['status'].id == 1) {

      // }
    })
  }

  editFramework(id) {

    this._maturityModalService.getItem(id).subscribe(res => {


      this.maturityModalObject.values = {
        id: res['id'],
        title: res['title'],
        description: res['description'],
        option: res['maturity_model_levels']
      }
      this.maturityModalObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);

    })
  }

  deactivate(id) {

    this.deleteObject.id = id;
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.subtitle = 'Are you sure you want to deactivate this maturity model?';
    $(this.deletePopup.nativeElement).modal('show');

  }
  activate(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = 'Activate';
    this.deleteObject.subtitle = 'Are you sure you want to activate this maturity model?';
    $(this.deletePopup.nativeElement).modal('show');
  }

  closeFormModal() {
    this.setDetails();
    this.maturityModalObject.type = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    this.maturityModalObject.type = null;
  }

  viewMore(type) {
    if (type == 'more')
      MaturityModalStore.viewMore = true;
    else
      MaturityModalStore.viewMore = false;
    this._utilityService.detectChanges(this._cdr);
  }


  deleteFramework(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'Are you sure you want to delete this maturity model?';

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
        case '': type = this._maturityModalService.delete(this.deleteObject.id);
          break;
        case 'Deactivate': type = this._maturityModalService.deactivate(this.deleteObject.id);
          break;
        case 'Activate': type = this._maturityModalService.activate(this.deleteObject.id);
          break;
      }

      type.subscribe(resp => {
        this.closeConfirmationPopUp();
        // setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if (this.deleteObject.type == 'Deactivate' || this.deleteObject.type == 'Activate') {
          this.setDetails();
          this.addSubmenu();
        }
        if (this.deleteObject.type == '') {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('/business-assessments/maturity-models');
        }
        // }, 500);
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        setTimeout(() => {
          if (error.status == 405) {
            this.deactivate(this.deleteObject.id);
            this.addSubmenu();
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
      if (MaturityModalStore.individualMaturityModalDetails.status.id == 1) {
        var subMenuItems = [
          { activityName: 'UPDATE_MATURITY_MODEL', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_MATURITY_MODEL', submenuItem: { type: 'delete' } },
          { activityName: 'DEACTIVATE_MATURITY_MODEL', submenuItem: { type: 'deactivate' } },
          { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/maturity-models' } },
        ]
      }
      else {

        var subMenuItems = [
          { activityName: 'UPDATE_MATURITY_MODEL', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_MATURITY_MODEL', submenuItem: { type: 'delete' } },
          { activityName: 'ACTIVATE_MATURITY_MODEL', submenuItem: { type: 'activate' } },
          { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/maturity-models' } },
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
    let userDetails: any = {};
    userDetails.first_name = user.first_name;
    userDetails.last_name = user.last_name;
    userDetails.designation = user.designation;
    userDetails.image_token = user.image.token;
    userDetails.email = user.email;
    userDetails.mobile = user.mobile;
    userDetails.id = user.id;
    userDetails.department = user.created_by_department ? user.created_by_department : null;
    userDetails.status_id = user.created_by_status_id ? user.created_by_status_id : 1;
    return userDetails;
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }


  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();

    this.maturityModalSubscriptionEvent.unsubscribe();
    MaturityModalStore.searchText=null;
    MaturityModalStore.unsetIndiviudalMaturityModalDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }
  

}
