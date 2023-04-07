import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { ComplainceChecklistStore } from 'src/app/stores/compliance-management/complaince-checklist/complaince-checklist-store';
import { ComplainceChecklistService } from 'src/app/core/services/compliance-management/complaince-checklist/complaince-checklist.service';
import { AppStore } from 'src/app/stores/app.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
declare var $: any;
@Component({
  selector: 'app-complaince-checklist',
  templateUrl: './complaince-checklist.component.html',
  styleUrls: ['./complaince-checklist.component.scss']
})
export class ComplainceChecklistComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('mailConfirmationPopup', { static: true }) mailConfirmationPopup: ElementRef;
  SubMenuItemStore=SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  NoDataItemStore=NoDataItemStore;
  AppStore=AppStore;
  ComplainceChecklistStore=ComplainceChecklistStore;
  ShareItemStore=ShareItemStore;
  ImportItemStore=ImportItemStore;
  mailConfirmationData = 'cyber_checklist_share_msg'
  checklistObject = {
    values: null,
    type: null
  };
  deleteObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  deletePopupScubscription:any;
  addChecklistSubscription:any;
  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _complainceChecklistService:ComplainceChecklistService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: '', submenuItem: {type: 'new_modal'}},
        { activityName: null, submenuItem: { type: 'refresh' } },
        { activityName: '', submenuItem: { type: 'template' } },
        { activityName: '', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'search' } },
        { activityName: '', submenuItem: { type: 'share' } }
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_checklist'});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createChecklist();
            break;
          case "refresh":
            ComplainceChecklistStore.loaded = false;
              this.pageChange(1)
              break;
          case "template":
            this._complainceChecklistService.generateTemplate();
            break;
          case "share":
            ShareItemStore.setTitle('share_cyber_compliaince_checklist');
            ShareItemStore.formErrors = {};
            break;
          case "export_to_excel":

            this._complainceChecklistService.exportToExcel();
            break;
          case "search":
            ComplainceChecklistStore.searchText = SubMenuItemStore.searchText;
            this.pageChange();
            break;
          case "import":
            ImportItemStore.setTitle('import_cyber_compliaince_checklist');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (ShareItemStore.shareData) {
        this._complainceChecklistService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._complainceChecklistService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
      if (NoDataItemStore.clikedNoDataItem) {
        this.createChecklist();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    
    })

    

    this.addChecklistSubscription = this._eventEmitterService.addChecklistModal.subscribe(res => {
      this.closeFormModal();
    })
    this.deletePopupScubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })
    this.pageChange();
  }

  pageChange(page?)
  {
    if (page) ComplainceChecklistStore.setCurrentPage(page);
    this._complainceChecklistService.getAllItems(false,'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this._renderer2.removeClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    this.checklistObject.type = null;
  }

  createChecklist() {
    this.checklistObject.type = 'Add';
    this.checklistObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();

  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto')
  }

  gotoDetailsPage(id: number) {
    this._router.navigateByUrl(`/compliance-management/checklists/${id}`)
  }

  deleteChecklist(id,event)
  {
    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_checklist';
    $(this.deletePopup.nativeElement).modal('show');
  }
  deactivate(id,event) {
    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.subtitle = 'Are you sure you want to deactivate this checklist?';
    $(this.deletePopup.nativeElement).modal('show');

  }
  activate(id,event) {
    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = 'Activate';
    this.deleteObject.subtitle = 'Are you sure you want to activate this checklist?';
    $(this.deletePopup.nativeElement).modal('show');
  }
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._complainceChecklistService.delete(this.deleteObject.id);
          break;
      case 'Deactivate': type = this._complainceChecklistService.deactivate(this.deleteObject.id);
          break;
      case 'Activate': type = this._complainceChecklistService.activate(this.deleteObject.id);
          break;
      }
      type.subscribe(resp => {
        this.closeConfirmationPopUp();
        this.pageChange(ComplainceChecklistStore.currentPage);
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        setTimeout(() => {
          if (error.status == 405) {
            
    
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
  closeConfirmationPopUp() {
    // setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    // }, 250);
  }
  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }
  edit(id,event)
  {
    event.stopPropagation();
    this._complainceChecklistService.getItem(id).subscribe(res => {
      this.checklistObject.type = 'Edit';
      this.checklistObject.values = res; // for clearing the value
      this.openFormModal();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy()
  {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ComplainceChecklistStore.unsetChecklist();
    ComplainceChecklistStore.unsetSelectedItemDetails();
    this.deletePopupScubscription.unsubscribe();
    this.addChecklistSubscription.unsubscribe();
  }

}
