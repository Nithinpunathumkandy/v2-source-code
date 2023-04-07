import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { MockDrillEvacuationRoleMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-evacuation-role-store';
import { MockDrillEvacuationRoleService } from 'src/app/core/services/masters/mock-drill/mock-drill-evacuation-role/mock-drill-evacuation-role.service';
declare var $: any;
@Component({
  selector: 'app-mock-drill-evacuation-role',
  templateUrl: './mock-drill-evacuation-role.component.html',
  styleUrls: ['./mock-drill-evacuation-role.component.scss']
})
export class MockDrillEvacuationRoleComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  MockDrillEvacuationRoleMasterStore = MockDrillEvacuationRoleMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_mock_drill_evacuation_role_message';

  mockDrillObject = {
    component: 'Master',
    values: null,
    type: null
  }

  mockDrillSubscriptionEvent: any = null;
  popupMockDrillEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  constructor(
    private _mockDrillEvacuationRoleService: MockDrillEvacuationRoleService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_mock_drill_evacuation_role' });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'MOCK_DRILL_Evacuation_Role_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_MOCK_DRILL_Evacuation_Role', submenuItem: { type: 'new_modal' } },
        { activityName: 'EXPORT_MOCK_DRILL_Evacuation_Role', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'GENERATE_MOCK_DRILL_Evacuation_Role', submenuItem: { type: 'template' } },
        { activityName: 'SHARE_MOCK_DRILL_Evacuation_Role', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_MOCK_DRILL_Evacuation_Role', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: 'mock-drill' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_MOCK_DRILL_Evacuation_Role')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "export_to_excel":
            this._mockDrillEvacuationRoleService.exportToExcel();
            break;
          case "search":
            MockDrillEvacuationRoleMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "template":
            this._mockDrillEvacuationRoleService.generateTemplate();
            break;
          case "share":
            ShareItemStore.setTitle('share_mock_drill_evacuation_role_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_mock_drill_evacuation_role');
            ImportItemStore.setImportFlag(true);
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._mockDrillEvacuationRoleService.shareData(ShareItemStore.shareData).subscribe(res => {
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
          console.log(error);
        });
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._mockDrillEvacuationRoleService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

    // for deleting/activating/deactivating using delete modal
    this.popupMockDrillEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.mockDrillSubscriptionEvent = this._eventEmitterService.mockDrillEvacuationRoleModel.subscribe(res => {
      this.closeFormModal();
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
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteMockDrillEvacuationRole(status)
        break;

      case 'Activate': this.activateMockDrillEvacuationRole(status)
        break;

      case 'Deactivate': this.deactivateMockDrillEvacuationRole(status)
        break;
    }
  }

  // delete function call
  deleteMockDrillEvacuationRole(status: boolean) {
    if (status && this.popupObject.id) {
      this._mockDrillEvacuationRoleService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && MockDrillEvacuationRoleMasterStore.getDocumentEvacuationRoleById(this.popupObject.id).status_id == AppStore.activeStatusId) {
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else {
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        }

      })
      );
    }
    else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }

  // calling activcate function
  activateMockDrillEvacuationRole(status: boolean) {
    if (status && this.popupObject.id) {

      this._mockDrillEvacuationRoleService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateMockDrillEvacuationRole(status: boolean) {
    if (status && this.popupObject.id) {

      this._mockDrillEvacuationRoleService.deactivate(this.popupObject.id).subscribe(resp => {
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

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }


  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }
  pageChange(newPage: number = null) {
    if (newPage) MockDrillEvacuationRoleMasterStore.setCurrentPage(newPage);
    this._mockDrillEvacuationRoleService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.mockDrillObject.type = null;
  }
  addNewItem() {
    this.mockDrillObject.type = 'Add';
    this.mockDrillObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  // for sorting
  sortTitle(type: string) {
    this._mockDrillEvacuationRoleService.sortMockDrillList(type, null);
    this.pageChange();
  }

  // Get Mock Drill Evacuation Role by Id
  getMockDrill(id: number) {
    this._mockDrillEvacuationRoleService.getItem(id).subscribe(res => {
      if (res) {
        this.mockDrillObject.values = {
          id: res.id,
          languages: res.languages,
        }
      }
      this.mockDrillObject.type = 'Edit';
      this.openFormModal();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'delete_mock_drill_evacuation_role';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for activate 
  activate(id: number) {
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'activate_mock_drill_evacuation_role';
    this.popupObject.subtitle = 'are_you_sure_activate';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate_mock_drill_evacuation_role';
    this.popupObject.subtitle = 'are_you_sure_deactivate';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  //ngOnDestroy
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.mockDrillSubscriptionEvent.unsubscribe();
    this.popupMockDrillEventSubscription.unsubscribe();
    MockDrillEvacuationRoleMasterStore.searchText = '';
    MockDrillEvacuationRoleMasterStore.currentPage = 1;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
