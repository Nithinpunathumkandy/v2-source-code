import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { Subscription } from 'rxjs';
import { CyberIncidentCorrectiveActionService } from 'src/app/core/services/cyber-incident/cyber-incident-corrective-action/cyber-incident-corrective-action.service';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CyberIncidentCorrectiveActionStore } from 'src/app/stores/cyber-incident/cyber-incident-corrective-action-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-corrective-action-list',
  templateUrl: './corrective-action-list.component.html',
  styleUrls: ['./corrective-action-list.component.scss']
})
export class CorrectiveActionListComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild('mailConfirmationPopup', { static: true }) mailConfirmationPopup: ElementRef;
  reactionDisposer: IReactionDisposer;
  CyberIncidentCorrectiveActionStore = CyberIncidentCorrectiveActionStore;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  NoDataItemStore=NoDataItemStore;
  AuthStore=AuthStore;
  SubMenuItemStore=SubMenuItemStore;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  fileUploadPopupStore = fileUploadPopupStore;
  ShareItemStore = ShareItemStore;
  mailConfirmationData = 'corrective_action_share_msg'
  AppStore = AppStore;
  correctiveActionObject = {
    component: 'CorrectiveAction',
    values: null,
    type: null,
    redirect:true
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  addCASubscriptionEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  popupControlEventSubscription: any;
  formErrors: any;
  filterSubscription: Subscription = null;
  ImportItemStore=ImportItemStore;
  constructor(private _helperService: HelperServiceService,
    private  _cyberIncidentCorrectiveActionService : CyberIncidentCorrectiveActionService,
    private _utilityService: UtilityService,
    private _humanCapitalService: HumanCapitalService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventEmitterService: EventEmitterService,
    private _cyberIncidentService: CyberIncidentService,
    private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CyberIncidentCorrectiveActionStore.loaded = false;
      this.pageChange(1);
    })
    RightSidebarLayoutStore.filterPageTag = 'ci_corrective_action';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'responsible_user_ids',
      'cyber_incident_corrective_action_status_ids',
      'cyber_incident_ids',
    ]);
    this.reactionDisposer = autorun(() => {
      if(this.isResponsibleUser() || AuthStore.isRoleChecking('super-admin'))
      {
        NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'new_corrective_action'});
      }
      else
      {
        NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle'});
      }

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {  
          case "new_modal":
            this.addCA();
            break;
          case "template":
            this._cyberIncidentCorrectiveActionService.generateTemplate();
            break;
          case "export_to_excel":
            this._cyberIncidentCorrectiveActionService.exportToExcel();
            break;
          case "share":
            ShareItemStore.setTitle('share_cyber_incident_corrective_actions');
            ShareItemStore.formErrors = {};
            break;
          case "search":
            CyberIncidentCorrectiveActionStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            CyberIncidentCorrectiveActionStore.loaded = false;
            CyberIncidentCorrectiveActionStore.searchText = null;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_cyber_incident_corrective_action');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (ShareItemStore.shareData) {
        this._cyberIncidentCorrectiveActionService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._cyberIncidentCorrectiveActionService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

      if(NoDataItemStore.clikedNoDataItem){
        this.addCA();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      
      this.setMenu()
    })

    this.addCASubscriptionEvent = this._eventEmitterService.addCyberIncidentCAModal.subscribe(res => {
      this.closeFormModal();
    })

    // for deleting  modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.pageChange(1);
   
  }


  pageChange(newPage: number = null) {
    if (newPage) CyberIncidentCorrectiveActionStore.setCurrentPage(newPage);
    this._cyberIncidentCorrectiveActionService.getAllItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  setMenu(){
    let subMenuItems=[];
      if(this.isResponsibleUser() || AuthStore.isRoleChecking('super-admin'))
      {
        subMenuItems = [
          { activityName: null, submenuItem: { type: 'search' } },
          {activityName:null, submenuItem: {type: 'refresh'}},
          { activityName: '', submenuItem: { type: 'new_modal' } },
          { activityName: '', submenuItem: { type: 'template' } },
          { activityName: '', submenuItem: { type: 'import' } },
          { activityName: '', submenuItem: { type: 'export_to_excel' } },
          { activityName: '', submenuItem: { type: 'share' } },
          { activityName: null, submenuItem: { type: 'close', path: '/cyber-incident/dashboard' } },
        ]
      }
      else
      {
        subMenuItems = [
          { activityName: null, submenuItem: { type: 'search' } },
          {activityName:null, submenuItem: {type: 'refresh'}},
          //{ activityName: '', submenuItem: { type: 'new_modal' } },
          { activityName: '', submenuItem: { type: 'template' } },
          //{ activityName: '', submenuItem: { type: 'import' } },
          { activityName: '', submenuItem: { type: 'export_to_excel' } },
          { activityName: '', submenuItem: { type: 'share' } },
          { activityName: null, submenuItem: { type: 'close', path: '/cyber-incident/dashboard' } },
        ]
      }
    
    this._helperService.checkSubMenuItemPermissions(100,subMenuItems);
  }

  editCorrectiveACtion(action, event) {
    event.stopPropagation();
    CyberIncidentCorrectiveActionStore.setSubMenuHide(true);
    CyberIncidentCorrectiveActionStore.clearDocumentDetails();
    this._cyberIncidentCorrectiveActionService.getItem(action.id).subscribe(res => {
      if (res.documents.length > 0) {
        this.setDocuments(res.documents)
      }
    this.correctiveActionObject.values = {
      id: res.id,
      title: res.title,
      cyber_incident_id: res.cyber_incident.id,
      estimated_cost: res.estimated_cost,
      responsible_user_ids: toJS(res.responsible_user),
      description: res.description,
      start_date: this._helperService.processDate(res.start_date, 'split'),
      target_date: this._helperService.processDate(res.target_date, 'split'),
      documents: ''
    }
    this.correctiveActionObject.type = 'Edit';
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);

  })
    
    
  }

  setDocuments(documents) {
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._cyberIncidentService.getThumbnailPreview('corrective-action', element.token);
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    // this.enableScrollbar();
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token) { 
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  gotoCorrectiveActionDetails(action) {
    this._router.navigateByUrl('/cyber-incident/cyber-incident-corrective-actions/'+action.id)
  }

  sortTitle(type: string) {
    this._cyberIncidentCorrectiveActionService.sortList(type, null);
    this.pageChange();
  }

  isResponsibleUser() {
    if(CyberIncidentCorrectiveActionStore.correctiveActionDetails?.responsible_user)
      {
        for (let i of CyberIncidentCorrectiveActionStore.correctiveActionDetails?.responsible_user) {
          if (i?.id == AuthStore.user.id){
            return true;
          }
      }
      }
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteActionPlan(status)
        break;
    }
  }

  deleteActionPlan(status: boolean) {
    if (status && this.popupObject.id) {

      this._cyberIncidentCorrectiveActionService.delete(this.popupObject.id).subscribe(resp => {
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
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
    // CyberIncidentCorrectiveActionStore.auditFindingId = null;
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    //   this.popupObject.title = '';
    //   this.popupObject.subtitle = '';
    //  this.popupObject.type = '';
  }

  // for delete
  delete(actionPlan, event) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = actionPlan.id;
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = 'it_will_remove_the_corrective_action';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for opening modal
  openFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('show');
    }, 50);
    this._renderer2.addClass(this.addCAformModal.nativeElement, 'show');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'auto')
  }

  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this._renderer2.removeClass(this.addCAformModal.nativeElement, 'show');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.addCAformModal.nativeElement, 'overflow', 'none');
    this.correctiveActionObject.type = null;
    this.pageChange();
  }

  //calling corrective action add modal
  addCA() {
    CyberIncidentCorrectiveActionStore.setSubMenuHide(false);
    this.correctiveActionObject.type = null;
    this.correctiveActionObject.values = null;
    this.CyberIncidentCorrectiveActionStore.clearDocumentDetails();
    this.correctiveActionObject.type = 'Add';

    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);

  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    CyberIncidentCorrectiveActionStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCASubscriptionEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    // CorrectiveActionsStore.searchText = '';
    CyberIncidentCorrectiveActionStore.loaded = false;
    // this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    // RightSidebarLayoutStore.showFilter = false;
    CyberIncidentCorrectiveActionStore.unsetCorrectiveActions();
    // EADashboardStore.dashboardParam = null;
    // EADashboardStore.unSetFilterParams();
  }
}
