import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { BcmTemplateService } from 'src/app/core/services/bcm/bcm-template/bcm-template.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BcmTemplateStore } from 'src/app/stores/bcm/bcm-template/bcm-template';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
declare var $: any;

@Component({
  selector: 'app-bcp-template-list',
  templateUrl: './bcp-template-list.component.html',
  styleUrls: ['./bcp-template-list.component.scss']
})
export class BcpTemplateListComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  BcmTemplateStore = BcmTemplateStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  deleteEventSubscription: any;
  networkFailureSubscription: any;
  modalEventSubscription: any = null;
  idleTimeoutSubscription: any;

  popupObject = {
    title: '',
    id: null,
    subtitle: '',
    status: '',
    type: null
  };

  templateObject = {
    values: null,
    type: null
  }

  constructor(
    private _bcmTemplateService: BcmTemplateService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    this.pageChange(1);


    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BUSINESS_CONTINUITY_PLAN_TEMPLATE_LIST', submenuItem: { type: 'search' } },
        { activityName: 'BUSINESS_CONTINUITY_PLAN_TEMPLATE_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_BUSINESS_CONTINUITY_PLAN_TEMPLATE', submenuItem: { type: 'new_modal' } },
        // { activityName: 'EXPORT_BUSINESS_CONTINUITY_PLAN_TEMPLATE', submenuItem: { type: 'export_to_excel' } },
      ]
      this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "Looks like we don't have Template's added here!", subtitle: 'Add Template if there is any. To add, simply tap the button below. ', buttonText: 'Add New Template' });
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.templateObject.type = 'Add'
              // BcmTemplateStore.addFlag = true;
              this.templateObject.values = null
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          case "refresh":
            BcmTemplateStore.unsetBcmTemplate();
            this.pageChange(1);
            break;
          case "search":
            BcmTemplateStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          // case "template":
          //   this._bcmTemplateService.generateTemplate();
          //   break;
          // case "export_to_excel":
          //   this._bcmTemplateService.exportToExcel();
          //   break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.templateObject.type = 'Add'
        this.templateObject.values = null
        this.openFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
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
  pageChange(newPage: number = null) {
    if (newPage) BcmTemplateStore.setCurrentPage(newPage);

    this._bcmTemplateService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token, type) {
    return this._bcmTemplateService.getThumbnailPreview(type, token);
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  goTdetailsPage(id){
    this._router.navigateByUrl(`/bcm/business-continuity-plan-template/${id}`)
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
    this.pageChange();
    BcmTemplateStore.clearFileDetails();
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  getTemplateDetails(id: number) {
    event.stopPropagation();
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
        template_title:bcm_template.template_title,
        template_content: bcm_template.template_content,
        id: bcm_template.id,
        // description: bcm_template.template_content.description,
        // title: bcm_template.template_content.title,
        // order: bcm_template.template_content.order,
      }
      this.openFormModal();
    })
  }

  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Template?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Template?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Template?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteBcpTemplate(status)
        break;

      case 'Activate': this.activateBcpTemplate(status)
        break;

      case 'Deactivate': this.deactivateBcpTemplate(status)
        break;
    }
  }

  // delete function call
  deleteBcpTemplate(status: boolean) {
    if (status && this.popupObject.id) {
      this._bcmTemplateService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.pageChange();
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

  // calling activcate function
  activateBcpTemplate(status: boolean) {
    if (status && this.popupObject.id) {

      this._bcmTemplateService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  // calling deactivate function
  deactivateBcpTemplate(status: boolean) {
    if (status && this.popupObject.id) {

      this._bcmTemplateService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    BcmTemplateStore.searchText = '';
    BcmTemplateStore.unsetBcmTemplate();
    BcmTemplateStore.currentPage = 1;

  }
}
