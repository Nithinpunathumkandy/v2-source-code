import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { BcmTemplateService } from 'src/app/core/services/bcm/bcm-template/bcm-template.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BcmTemplateStore } from 'src/app/stores/bcm/bcm-template/bcm-template';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-bcp-template-details',
  templateUrl: './bcp-template-details.component.html',
  styleUrls: ['./bcp-template-details.component.scss']
})
export class BcpTemplateDetailsComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChildren('userSideBar') userSideBar: QueryList<ElementRef>;
  @ViewChild('userRightDetails') userRightDetails: ElementRef;
  @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;

  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  BcmTemplateStore = BcmTemplateStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  Id: number;
  sideCollapsed: boolean = false;

  deleteEventSubscription: any;
  networkFailureSubscription: any;
  modalEventSubscription: any = null;
  idleTimeoutSubscription: any;

  templateObject = {
    values: null,
    type: null
  }

  popupObject = {
    title: '',
    id: null,
    subtitle: '',
    status: '',
    type: null
  };

  constructor(private _activatedRoute: ActivatedRoute,
    private _bcmTemplateService: BcmTemplateService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      this.Id = params.id;
      BcmTemplateStore.bcmTemplateId = this.Id;
      this.getItem(BcmTemplateStore.bcmTemplateId)
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    });

    this.reactionDisposer = autorun(() => {
      if (BcmTemplateStore?.individualLoaded) {
        var subMenuItems = [
          { activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN_TEMPLATE', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_BUSINESS_CONTINUITY_PLAN_TEMPLATE', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: { type: 'close', path: '../' } }
        ]
        this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this.getTemplateDetails(this.BcmTemplateStore.bcmTemplateId);
            }, 200);
            break;
          case "delete":
            setTimeout(() => {
              this.delete(this.BcmTemplateStore.bcmTemplateId);
            }, 200);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteBcpTemplate(item);
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        if ($(this.formModal.nativeElement).hasClass('show')) {
          this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
          this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
        }
      }
    })


    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.modalEventSubscription = this._eventEmitterService.bcpTemplateAdd.subscribe(res => {
      this.closeFormModal()
      // dismissbcpTemplateAdd
    })


  }

  getItem(id) {
    this._bcmTemplateService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getTemplateDetails(id: number) {
    // event.stopPropagation();
    this._bcmTemplateService.getItem(id).subscribe(res => {
      this.templateObject.type = 'Edit';
      this._bcmTemplateService.setFileDetails(null, '', 'logo');
      const bcm_template = BcmTemplateStore.bcmTemplateDetails; // assigning values for edit
      var templateDetails = res;
      if (templateDetails.token) {
        var purl = this._bcmTemplateService.getThumbnailPreview('document-template-document', templateDetails.token);
        var lDetails = {
          name: templateDetails.title,
          ext: templateDetails.ext,
          size: templateDetails.size,
          url: templateDetails.url,
          token: templateDetails.token,
          preview: purl,
          thumbnail_url: templateDetails.url
        };
        this._bcmTemplateService.setFileDetails(lDetails, purl, 'logo');
      }

      this.templateObject.values = {
        template_title: bcm_template.template_title,
        template_content: bcm_template.template_content,
        id: bcm_template.id,
        // description: bcm_template.template_content.description,
        // title: bcm_template.template_content.title,
        // order: bcm_template.template_content.order,
      }
      this.openFormModal();
    })
  }

  openFormModal() {
    setTimeout(() => {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.formModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.formModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 350);
  }

  closeFormModal() {
    this.templateObject.type = null;
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    this.getItem(BcmTemplateStore.bcmTemplateId);
    BcmTemplateStore.clearFileDetails();
  }

  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Template?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // delete function call
  deleteBcpTemplate(status: boolean) {
    if (status && this.popupObject.id) {
      this._bcmTemplateService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this._router.navigateByUrl(`/bcm/business-continuity-plan-template`)
      });
    }
    else {
      this.clearPopupObject();
    }
    this.closeConfirmationPopUp();
  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  createImageUrl(type, token) {
    if (type == 'user-profile-picture')
      return this._imageService.getThumbnailPreview(type, token);
    else if (type == 'document-template-document')
      return this._bcmTemplateService.getThumbnailPreview(type, token);

  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  collapseSide() {
    if (!this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      setTimeout(() => {
        this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
        this._renderer2.addClass(this.userRightDetails.nativeElement, 'flex-98-width');
      }, 150);
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
      this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position', 'fixed');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index', '99999');
      this.sideCollapsed = true;
    }
  }

  unCollapseSide() {
    if (this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.removeClass(this.userRightDetails.nativeElement, 'flex-98-width');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
      this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');

      this.sideCollapsed = false;
    }
  }


  ngOnDestroy() {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
