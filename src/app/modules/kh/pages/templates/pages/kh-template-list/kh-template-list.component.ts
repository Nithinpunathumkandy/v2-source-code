import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { KnTemplatesService } from 'src/app/core/services/knowledge-hub/templates/kn-templates.service'
import { IReactionDisposer, autorun } from "mobx";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { TemplateStore } from 'src/app/stores/knowledge-hub/templates/templates.store'
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
declare var $: any;

@Component({
  selector: 'app-kh-template-list',
  templateUrl: './kh-template-list.component.html',
  styleUrls: ['./kh-template-list.component.scss']
})
export class KhTemplateListComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('docTypeModal') docTypeModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  TemplateStore = TemplateStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  templateObject = {
    values: null,
    type: null
  }

  docTypeObject = {
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

  deleteEventSubscription: any;
  modalEventSubscription: any;
  docTypeModalSubscription: any
  ModalStyleSubscriptionEvent: any;
  networkFailureSubscription: any;
  filterSubscription: Subscription = null;

  constructor(
    private _router: Router,
    private _khTempateService: KnTemplatesService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _khFileService: KhFileServiceService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.TemplateStore.templatesLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    AppStore.showDiscussion = false;

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search' } },
        { activityName: 'DOCUMENT_TEMPLATE_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_DOCUMENT_TEMPLATE', submenuItem: { type: 'new_modal' } },        
        { activityName: 'EXPORT_DOCUMENT_TEMPLATE', submenuItem: { type: 'export_to_excel' } },
      ]
      this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "Looks like we don't have Template's added here!", subtitle: 'Add Template if there is any. To add, simply tap the button below. ', buttonText: 'Add New Template' });
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.templateObject.type = 'Add'
              TemplateStore.addFlag = true;
              this.templateObject.values = null
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          case "refresh":
            TemplateStore.unsetTemplate();
            this.pageChange(1);
            break;
          case "search":
            TemplateStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "template":
            this._khTempateService.generateTemplate();
            break;
          case "export_to_excel":
            this._khTempateService.exportToExcel();
            break;
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

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal()
    })

    this.docTypeModalSubscription = this._eventEmitterService.docTypePopup.subscribe(res => {
      this.closeDocTypePopupModal()
    })
    // SubScribing to Set the Style of Modal Once Closed in Child Component.

    this.ModalStyleSubscriptionEvent = this._eventEmitterService.ModalStyle.subscribe(res => {

      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    })
    SubMenuItemStore.setNoUserTab(true);
    RightSidebarLayoutStore.filterPageTag = 'document_template';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'document_type_ids'
    ]);
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) TemplateStore.setCurrentPage(newPage);
    this._khTempateService
      .getAllItems()
      .subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }

  downloadTemplate(templateId, fileId, fileName, fileDetails) {

    this._khFileService.downloadFile('document-templates', templateId, fileId, null, fileName, fileDetails)


  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token, type) {
    return this._khFileService.getThumbnailPreview(type, token);
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

  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.templateObject.type = null;
  }

  gotoDetails(id) {
    this._router.navigateByUrl("/knowledge-hub/template/" + id);
  }


  deleteConfirm(id: number, status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Template?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this.popupObject.type = ''
    this.popupObject.status = status
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }


  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Template?';
    this.popupObject.subtitle = 'it_will_activate_the_template';
    this.popupObject.type = 'Activate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deactivateConfirm(id: number) {
    if (event) event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Template?';
    this.popupObject.subtitle = 'it_will_deactivate_the_template';
    this.popupObject.type = 'Deactivate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteTemplate(status)
        break;
      case 'Activate': this.activateTemplate(status)
        break;
      case 'Deactivate': this.deactivateTemplate(status)
        break;

    }

  }

  // Delete Process Function

  deleteTemplate(status: boolean) {
    if (status && this.popupObject.id) {
      if (this.popupObject.status == 'Inactive') {
        if (status && this.popupObject.id) {
          this._khTempateService.delete(this.popupObject.id).subscribe(resp => {
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            this.closeConfirmationPopup();
            this.clearPopupObject();
          });
        }
        else {
          this.closeConfirmationPopup();
          this.clearPopupObject();
        }
      }
      else {

        this._khTempateService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearPopupObject();
          this.closeConfirmationPopup();
        }, (error => {
          if (error.status == 405) {
            let id = this.popupObject.id;
            this.clearPopupObject();
            this.closeConfirmationPopup();
            setTimeout(() => {
              this.deactivateConfirm(id);
            }, 500);
          }
        })
        );
      }
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }


  // calling activcate function

  activateTemplate(status: boolean) {
    if (status && this.popupObject.id) {
      this._khTempateService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  // calling deactivate function

  deactivateTemplate(status: boolean) {
    if (status && this.popupObject.id) {
      this._khTempateService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }


  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  closeConfirmationPopup() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }


  getTemplateDetails(id) {
    // this.TemplateStore.clearTemplateFiles();

    this._khTempateService.getItemById(id).subscribe((res) => {

      var templateDetails = res
      templateDetails.documents.forEach(element => {

        if (element && element.token) {
          var purl = this._khFileService.getThumbnailPreview('document-template-document', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id
          }
        }
        this._khTempateService.setTemplateFile(lDetails, purl, 'support-file')
      });

      this.templateObject.values = {
        id: templateDetails.id,
        title: templateDetails.title,
        description: templateDetails.description ? templateDetails.description : '',
        documents: templateDetails.description ? templateDetails.documents : '',
        document_type_ids: templateDetails.document_types ? this.getEditValue(templateDetails.document_types) : [],
        organization_ids: templateDetails.organizations ? this.getEditValue(templateDetails.organizations) : [],
        section_ids: templateDetails.sections ? this.getEditValue(templateDetails.sections) : [],
        sub_section_ids: templateDetails.sub_sections ? this.getEditValue(templateDetails.sub_sections) : [],
        division_ids: templateDetails.divisions ? this.getEditValue(templateDetails.divisions) : [],
        department_ids: templateDetails.departments ? this.getEditValue(templateDetails.departments) : [],
      }
      this.templateObject.type = 'Edit';
      TemplateStore.addFlag = false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    })


  }

  getEditValue(data) {
    var editvalue = []
    data.forEach(element => {
      editvalue.push(element)
    });
    return editvalue
  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  openDocTypePopupModal() {
    setTimeout(() => {
      $(this.docTypeModal.nativeElement).modal('show');
    }, 100);
  }

  closeDocTypePopupModal() {
    $(this.docTypeModal.nativeElement).modal('hide');
    this.docTypeObject.type = null;
    this.docTypeObject.values = null
  }

  openDoctype(event, docTypeArray) {
    event.stopPropagation();
    this.docTypeObject.type = 'Add'
    this.docTypeObject.values = docTypeArray
    this.openDocTypePopupModal()
    this._utilityService.detectChanges(this._cdr);
  }


  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe()
    this.modalEventSubscription.unsubscribe()
    this.docTypeModalSubscription.unsubscribe()
    this.ModalStyleSubscriptionEvent.unsubscribe()
    SubMenuItemStore.searchText = null;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    this.networkFailureSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    TemplateStore.searchText = '';
    TemplateStore.unsetTemplate()
  }

}
