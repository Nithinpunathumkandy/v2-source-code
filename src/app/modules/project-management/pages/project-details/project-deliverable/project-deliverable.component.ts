import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Deliverable } from 'src/app/core/models/project-management/project-details/project-deliverable/project-deliverable';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectDeliverableService } from 'src/app/core/services/project-management/project-details/project-deliverable/project-deliverable.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { DeliverableMasterStore } from 'src/app/stores/project-management/project-details/project-deliverable/project-deliverable-store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
declare var $: any;
@Component({
  selector: 'app-project-deliverable',
  templateUrl: './project-deliverable.component.html',
  styleUrls: ['./project-deliverable.component.scss']
})
export class ProjectDeliverableComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  DeliverableMasterStore = DeliverableMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_project_deliverable_message';

  DeliverableObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  DeliverableSubscriptionEvent: any = null;
  popupControlDeliverableEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _deliverableService: ProjectDeliverableService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'PROJECT_DELIVERABLE_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_PROJECT_DELIVERABLE', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_DELIVERABLES_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_PROJECT_DELIVERABLE', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_PROJECT_DELIVERABLE', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_DELIVERABLES', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_project_deliverable' });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;

          case "template":
            this._deliverableService.generateTemplate();
            break;

          case "export_to_excel":
            this._deliverableService.exportToExcel();
            break;

          case "search":
            DeliverableMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_project_deliverable_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_project_deliverable');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._deliverableService.shareData(ShareItemStore.shareData).subscribe(res => {
          ShareItemStore.unsetShareData();
          ShareItemStore.setTitle('');
          ShareItemStore.unsetData();
          $('.modal-backdrop').remove();
          document.body.classList.remove('modal-open');
          setTimeout(() => {
            $(this.mailConfirmationPopup.nativeElement).modal('show');
          }, 200);
        }, (error) => {
          if (error.status == 422) {
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();

        });
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._deliverableService.importData(ImportItemStore.getFileDetails).subscribe(res => {
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
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

    this.popupControlDeliverableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteItems(item);
    })
    this.DeliverableSubscriptionEvent = this._eventEmitterService.projectDeliverable.subscribe(res => {
      this.closeFormModal();
      this.pageChange();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.pageChange(1);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  addNewItem() {
    this.DeliverableObject.type = 'Add';
    this.DeliverableObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  pageChange(newPage: number = null) {
    if (newPage) DeliverableMasterStore.setCurrentPage(newPage);
    this._deliverableService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.DeliverableObject.type = null;
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr)
    }, 50);
  }

  deleteItems(status) {
    if (status && this.popupObject.id) {
      this._deliverableService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    } else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }


  getDeliverableById(id: number) {
    this._deliverableService.getItemById(id).subscribe(res => {


      this.loadPopup();
      this._utilityService.detectChanges(this._cdr);

    })
  }

  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Deliverable?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }



  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = ''; 
  }

  sortTitle(type: string) {
    this._deliverableService.sortDeliverableList(type);
    this.pageChange();
  }




  loadPopup() {
    const projectDeliverableSingle: Deliverable = DeliverableMasterStore.individualDeliverableId;


    this.DeliverableObject.values = {
      id: projectDeliverableSingle.id,
      title: projectDeliverableSingle.item,
      description: projectDeliverableSingle.TargetDate,

    }
    this.DeliverableObject.type = 'Edit';


    this.openFormModal();
  }

  editFormModal(data) {


    this.DeliverableObject.values = {
      title: data?.title,
      responsible_user_id: data?.responsible_user_id,
      target_date: data?.target_date,
      id: data?.id

    }
    this.DeliverableObject.type = 'Edit';

    this.openFormModal()
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    DeliverableMasterStore.searchText = '';
    this.DeliverableSubscriptionEvent.unsubscribe();
    this.popupControlDeliverableEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}