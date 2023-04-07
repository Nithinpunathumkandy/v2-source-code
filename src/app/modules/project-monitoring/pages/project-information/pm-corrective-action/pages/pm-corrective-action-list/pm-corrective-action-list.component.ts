import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ProjectIssueCaService } from 'src/app/core/services/project-monitoring/project-ca/project-issue-ca.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CaStore } from 'src/app/stores/project-monitoring/project-issue-ca-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-pm-corrective-action-list',
  templateUrl: './pm-corrective-action-list.component.html'
})
export class PmCorrectiveActionListComponent implements OnInit,OnDestroy {

  @ViewChild('newCa', { static: true }) newCa: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  CaStore = CaStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  
  reactionDisposer: IReactionDisposer;
  caSubscriptionEvent: any = null;
  popupControlEventSubscription:any;
  filterSubscription: Subscription = null;
  
  newCaObject = {
    id : null,
    value: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
  };

  constructor(private _projectIssueCaService:ProjectIssueCaService,
    private _utilityService:UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router:Router,
    private _renderer2: Renderer2,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _fileUploadPopupService: FileUploadPopupService,) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof PmCorrectiveActionListComponent
   */
    ngOnInit(): void {

      RightSidebarLayoutStore.showFilter = true;
      this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
        this.CaStore.loaded = false;
        this._utilityService.detectChanges(this._cdr);
        this.pageChange(1);
      })

      SubMenuItemStore.setNoUserTab(true);
      AppStore.showDiscussion = false;
      NoDataItemStore.setNoDataItems({title:"No Corrective Action has been added", subtitle: 'Click on the below button to add a new Corrective Action',buttonText: 'New Corrective Action'});
      this.reactionDisposer = autorun(() => {  
  
        var subMenuItems = [
          {activityName: 'PROJECT_ISSUE_CORRECTIVE_ACTION_LIST', submenuItem: {type: 'search'}},
          {activityName:null, submenuItem: {type: 'refresh'}},
          {activityName: 'CREATE_PROJECT_ISSUE_CORRECTIVE_ACTION', submenuItem: {type: 'new_modal'}},
          // {activityName: 'GENERATE_PROJECT_ISSUE_CORRECTIVE_ACTION_TEMPLATE', submenuItem: {type: 'template'}},
          {activityName: 'EXPORT_PROJECT_ISSUE_CORRECTIVE_ACTION', submenuItem: {type: 'export_to_excel'}},
          // {activityName: null, submenuItem: { type: 'close', path: '../' } },
        ]
        if(!AuthStore.getActivityPermission(3200,'CREATE_PROJECT_ISSUE_CORRECTIVE_ACTION')){
          NoDataItemStore.deleteObject('subtitle');
          NoDataItemStore.deleteObject('buttonText');
        }
        this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "new_modal":
              this.openNewCaModal();
              break;
            // case "template":
            //     this._projectIssueCaService.generateTemplate();
            //     break;
            case "export_to_excel":
                this._projectIssueCaService.exportToExcel();
                break;
            case "search":
               CaStore.searchText = SubMenuItemStore.searchText;
               this.pageChange(1); 
               break;
               case 'refresh':
                CaStore.loaded = false
                this.pageChange(1); 
                break
                // case "export_to_excel":
                // this._projectIssueCaService.exportToExcel();
                // break;
            default:
              break;
          }
          // Don't forget to unset clicked item immediately after using it
          SubMenuItemStore.unSetClickedSubMenuItem();
        } 
        if(NoDataItemStore.clikedNoDataItem){
          this.openNewCaModal();
          NoDataItemStore.unSetClickedNoDataItem();
        }
      });

      this.caSubscriptionEvent = this._eventEmitterService.projectIssueCaModal.subscribe(item => {
        this.closeNewCa()
        this.pageChange(1)
      })
      this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })

      RightSidebarLayoutStore.filterPageTag = 'project_issue_corrective';
      this._rightSidebarFilterService.setFiltersForCurrentPage([
        'organization_ids',
        'division_ids',
        'department_ids',
        'section_ids',
        'sub_section_ids',
        'project_issue_corrective_action_status_ids',
        'project_issue_ids',
        'responsible_user_ids'
      ]);

      this.pageChange(1)
    }

  pageChange(newPage:number = null){
    if (newPage) CaStore.setCurrentPage(newPage);
    this._projectIssueCaService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openNewCaModal(){
    this.newCaObject.type = 'Add';
    this.newCaObject.value = null; // for clearing the value
    this.openNewCa()

  }

  openNewCa(){
    setTimeout(() => {
      $(this.newCa.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.newCa.nativeElement,'display','block');
    this._renderer2.setStyle(this.newCa.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newCa.nativeElement,'z-index',99999);
  }


  closeNewCa(){
 
    setTimeout(() => {
      this.newCaObject.type = null;
      this.newCaObject.value = null;
      $(this.newCa.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newCa.nativeElement,'show');
      this._renderer2.setStyle(this.newCa.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  editCa(value){
    event.stopPropagation();
     this._projectIssueCaService.getCa(value.id).subscribe(res=>{
       console.log(res)
      this.newCaObject.type = 'Edit';
      this.newCaObject.value = res;
      this.openNewCa();
      this.setDocuments(res.documents);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setDocuments(documents) { 
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

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
          var purl = this._projectIssueCaService.getThumbnailPreview('project-issue-corrective-action-document', element.token);
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
    this.popupObject.subtitle = 'delete_ca_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

 // delete function call
 deleteCa(status: boolean) {
  if (status && this.popupObject.id) {
    this._projectIssueCaService.deleteCa(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.pageChange(1)
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

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
}
  sortTitle(type: string) {
     this._projectIssueCaService.sortCaList(type, SubMenuItemStore.searchText);
     this.pageChange()
  }

  gotoCorrectiveActionDetails(id){
    if (AuthStore.getActivityPermission(100, 'PROJECT_ISSUE_CORRECTIVE_ACTION_DETAILS')) {
    this._router.navigateByUrl('/project-monitoring/projects-issue-corrective-actions/'+id);
    }
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof PmCorrectiveActionListComponent
   */    
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.caSubscriptionEvent.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    RightSidebarLayoutStore.resetFilter();
    this.popupControlEventSubscription.unsubscribe();
  }

}
