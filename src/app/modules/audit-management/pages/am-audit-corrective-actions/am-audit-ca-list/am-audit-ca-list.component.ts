import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { AmAuditFindingCaService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding-ca/am-audit-finding-ca.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { AmFindingCAStore } from 'src/app/stores/audit-management/am-audit-finding/am-finding-ca.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-am-audit-ca-list',
  templateUrl: './am-audit-ca-list.component.html',
  styleUrls: ['./am-audit-ca-list.component.scss']
})
export class AmAuditCaListComponent implements OnInit {

  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AmFindingCAStore = AmFindingCAStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  
  reactionDisposer: IReactionDisposer;
  addCASubscriptionEvent: any = null;
  deleteEventSubscription: any;
  popupControlEventSubscription:any;
  filterSubscription: Subscription = null;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
  };

  correctiveActionObject = {
    component: 'FindingCorrectiveAction',
    values: null,
    type: null
  };

  constructor(private _correctiveActionService: AmAuditFindingCaService,
    private _utilityService:UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router:Router,
    private _renderer2: Renderer2,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _auditManagementService: AuditManagementService,) { }

    ngOnInit(): void {

      RightSidebarLayoutStore.showFilter = true;
      this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
        this.AmFindingCAStore.loaded = false;
        this.pageChange(1);
      })

      AppStore.showDiscussion = false;
      NoDataItemStore.setNoDataItems({title:"", subtitle: 'common_no_data_title'});
      this.reactionDisposer = autorun(() => {  
        var subMenuItems = [
          {activityName: 'FINDING_CORRECTIVE_ACTION_LIST', submenuItem: {type: 'search'}},
          {activityName:null, submenuItem: {type: 'refresh'}},
          // {activityName: 'CREATE_FINDING_CORRECTIVE_ACTION', submenuItem: {type: 'new_modal'}},
          // {activityName: 'GENERATE_FINDING_CORRECTIVE_ACTION_TEMPLATE', submenuItem: {type: 'template'}},
          {activityName: 'EXPORT_FINDING_CORRECTIVE_ACTION', submenuItem: {type: 'export_to_excel'}},
        ]
        if(!AuthStore.getActivityPermission(3200,'CREATE_FINDING_CORRECTIVE_ACTION')){
          NoDataItemStore.deleteObject('subtitle');
          NoDataItemStore.deleteObject('buttonText');
        }
        this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "new_modal":
              this.openNewCaModal();
              break;
            case "template":
                this._correctiveActionService.generateTemplate();
                break;
            case "export_to_excel":
                this._correctiveActionService.exportToExcel();
                break;
            case "search":
              AmFindingCAStore.searchText = SubMenuItemStore.searchText;
               this.pageChange(1); 
               break;
               case 'refresh':
                AmFindingCAStore.loaded = false
                this.pageChange(1); 
                break
            default:
              break;
          }
          // Don't forget to unset clicked item immediately after using it
          SubMenuItemStore.unSetClickedSubMenuItem();
        } 
        SubMenuItemStore.setNoUserTab(true);
        if(NoDataItemStore.clikedNoDataItem){
          this.openNewCaModal();
          NoDataItemStore.unSetClickedNoDataItem();
        }
      });
      AppStore.showDiscussion = false;
      this.addCASubscriptionEvent = this._eventEmitterService.amAuditFindingCaModal.subscribe(res => {
        this.closeNewCa()
        this.pageChange(1)
      })
      this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })

      RightSidebarLayoutStore.filterPageTag = 'am_finding_corrective_action';
      this._rightSidebarFilterService.setFiltersForCurrentPage([
        'responsible_user_ids'
      ]);

      this.pageChange(1)
    }

  pageChange(newPage:number = null){
    if (newPage) AmFindingCAStore.setCurrentPage(newPage);
    this._correctiveActionService.getAllItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openNewCaModal(){
    this.correctiveActionObject.type = 'Add';
    this.correctiveActionObject.values = null;
    this.openFormModal();
  }

  openFormModal(){
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.addCAformModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.addCAformModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.addCAformModal.nativeElement,'z-index',99999);
  }


  closeNewCa(){
 
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this.correctiveActionObject.type = null;
    this.pageChange();
  }

  editCa(id){
    event.stopPropagation();
    AmFindingCAStore.setAuditFindingCaId(id);
    this._correctiveActionService.getCa(id).subscribe(res => {
      AmAuditFieldWorkStore.setAuditFieldWorkId(res?.am_audit_finding?.am_audit_id)

    this.correctiveActionObject.values = {
      id: id,
      am_audit_id : res['am_audit_finding']?.am_audit_id,
      finding_id : res['am_audit_finding']?.id,
      title: res['title'],
      responsible_user_id: res['responsible_user']?.id,
      description: res['description'],
      findings: res['am_audit_finding'],
      start_date: this._helperService.processDate(res['start_date'], 'split'),
      target_date: this._helperService.processDate(res['target_date'], 'split'),
      documents: res['am_audit_finding_corrective_action_documents']
    }
    this.clearCommonFilePopupDocuments();
    if (res['am_audit_finding_corrective_action_documents']?.length > 0) {
      this.setDocuments(res['am_audit_finding_corrective_action_documents']);
    }

    this.correctiveActionObject.type = 'Edit';

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('show');
    }, 100);

  })
}
  

  setDocuments(documents) { 
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents?.forEach(element => {

      if (element.document_id) {
        element.kh_document?.versions.forEach(innerElement => {
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
          var purl = this._auditManagementService.getThumbnailPreview('corrective-action', element.token);
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
  
  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'are_you_sure': this.deleteCa(status)
      break;  
    }
  }

   // for delete
   delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure';
    this.popupObject.subtitle = 'delete_am_ca_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

 // delete function call
 deleteCa(status: boolean) {
  if (status && this.popupObject.id) {
      this._correctiveActionService.deleteCa(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        AmFindingCAStore.new_ca_id = null;
        this.pageChange();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

}


getResponsiblePopupDetails(users) {
  let userDetial: any = {};
  userDetial['first_name'] = users?.responsible_user_first_name;
  userDetial['last_name'] = users?.responsible_user_last_name;
  userDetial['designation'] = users?.responsible_user_designation;
  userDetial['image_token'] = users?.responsible_user_image_token;
  userDetial['email'] = users?.responsible_user_email;
  userDetial['mobile'] = users?.responsible_user_mobile;
  userDetial['id'] = users?.responsible_user_id;
  userDetial['department'] = users?.responsible_user_department;
  userDetial['status_id'] = users?.responsible_user_status_id ? users?.responsible_user_status_id : users?.status?.id;
  return userDetial;

}
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
}

  sortTitle(type: string) {
     this._correctiveActionService.sortCaList(type, SubMenuItemStore.searchText);
     this.pageChange()
  }

  gotoCorrectiveActionDetails(id){
    if (AuthStore.getActivityPermission(3900, 'FINDING_CORRECTIVE_ACTION_DETAILS')) {
      this._router.navigateByUrl('/audit-management/am-audit-finding-corrective-actions/'+id);
    }
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
   
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.addCASubscriptionEvent.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    RightSidebarLayoutStore.resetFilter();
    this.popupControlEventSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
  }

}
