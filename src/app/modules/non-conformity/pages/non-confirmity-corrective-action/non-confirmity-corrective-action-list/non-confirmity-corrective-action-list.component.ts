import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { FindingCorrectiveActionService } from 'src/app/core/services/non-conformity/findings/finding-corrective-action/finding-corrective-action.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FindingCorrectiveActionStore } from 'src/app/stores/non-conformity/findings/finding-corrective-action-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-non-confirmity-corrective-action-list',
  templateUrl: './non-confirmity-corrective-action-list.component.html',
  styleUrls: ['./non-confirmity-corrective-action-list.component.scss']
})
export class NonConfirmityCorrectiveActionListComponent implements OnInit,OnDestroy {

  @ViewChild('AddCAformModal', { static: true }) AddCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  FindingCorrectiveActionStore = FindingCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  addCASubscriptionEvent :any;
  popupControlEventSubscription:any;
	filterSubscription: Subscription = null;
  
  correctiveActionObject = {
    component: 'CorrectiveAction',
    values: null,
    type: null
  };

  popupObject = {
    category: '',
    type: '',
    title: '',
    id: null,
    subtitle: '',
    finding_id:null
  };

  constructor(private _correctiveActionService:FindingCorrectiveActionService,
    private _utilityService:UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router:Router,
    private _renderer2: Renderer2,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _eventEmitterService:EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {
    
    RightSidebarLayoutStore.showFilter = true;
		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.FindingCorrectiveActionStore.loaded = false;
      this.getCorrectiveActions(1);
		})

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search'} },
        { activityName: 'CREATE_NOC_FINDING_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_TRAINING_TEMPLATE', submenuItem: { type: 'template' } },
        // { activityName: 'EXPORT_TRAINING', submenuItem: { type: 'export_to_excel' } },
       
      ]
      
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'Add Corrective Action'});
      if(NoDataItemStore.clikedNoDataItem){
        this.addCA();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addCA();
              this._utilityService.detectChanges(this._cdr);
            }, 1000);
            break;
            // case "template":
            //   this._correctiveActionService.generateTemplate();
            // break;
          // case "export_to_excel":
          //   this._correctiveActionService.exportToExcel();
          //   break;
            case "search":
              FindingCorrectiveActionStore.searchText = SubMenuItemStore.searchText;
              this.getCorrectiveActions(1);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    // for closing the modal
    this.addCASubscriptionEvent = this._eventEmitterService.findingCorrectiveActionModalControl.subscribe(res => {
      this.closeFormModal();
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;

    RightSidebarLayoutStore.filterPageTag = 'noc_corrective_action';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  'organization_ids',
		  'division_ids',
		  'department_ids',
		  'section_ids',
		  'sub_section_ids',
		  'finding_ids',
		  'finding_corrective_action_status_ids',
      'responsible_user_ids'
		]);

    this.getCorrectiveActions(1);
  }

  getCorrectiveActions(newPage: number = null){
    if (newPage) FindingCorrectiveActionStore.setCurrentPage(newPage);
    this._correctiveActionService.getItems(false).subscribe(()=>this._utilityService.detectChanges(this._cdr));
  }

  getCorrectiveActionDetails(id){
    FindingCorrectiveActionStore.FindingCorrectiveActionId = id;
    this._router.navigateByUrl('/non-conformity/finding-corrective-actions/'+id);
  }

  //calling corrective action add modal
  addCA(){
    FindingCorrectiveActionStore.setSubMenuHide(false);
    this.correctiveActionObject.type = null;
    this.correctiveActionObject.values = null;
    this.FindingCorrectiveActionStore.clearDocumentDetails();
    this.correctiveActionObject.type = 'Add';
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);

  }

  // for opening modal
  openFormModal() {
    // this.CorrectiveActionMasterStore.clearDocumentDetails();
    // setTimeout(() => {
    //   $(this.AddCAformModal.nativeElement).modal('show');
    // }, 50);
    this._renderer2.addClass(this.AddCAformModal.nativeElement, 'show');
		this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'z-index', '99999');
		this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
		this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'overflow', 'auto')
  }

  // for closing the rca form modal
  closeFormModal() {
    // setTimeout(() => {
    //   $(this.AddCAformModal.nativeElement).modal('hide');
    //   this._utilityService.detectChanges(this._cdr);
      
    // }, 100);
    this._renderer2.removeClass(this.AddCAformModal.nativeElement, 'show');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.AddCAformModal.nativeElement, 'overflow', 'none');
    this.correctiveActionObject.type = null;
    this.getCorrectiveActions();
    this._utilityService.detectChanges(this._cdr); 
  }

  editCorrectiveACtion(id) {
    FindingCorrectiveActionStore.setSubMenuHide(true);
    event.stopPropagation();
    this._correctiveActionService.getItem(id).subscribe(res=>{
      this.correctiveActionObject.type = 'Edit';
      FindingCorrectiveActionStore.clearDocumentDetails();
      const corrective_action = FindingCorrectiveActionStore.correctiveActionDetails; // assigning values for edit
      // setTimeout(() => {
        if(corrective_action.documents.length > 0){
          this.setDocuments(corrective_action.documents)          
        }
      // }, 200);
      let finding = {
        id:corrective_action.finding?.id,
        title:corrective_action.finding?.title,
        label : corrective_action.finding?.title,
        department_ids:corrective_action.finding.departments[0]?.id,
        departments:corrective_action.finding.departments[0]?.title,
      }
  
      this.correctiveActionObject.values = {
        id: corrective_action.id,
        title: corrective_action.title,
        finding_id: corrective_action.finding_id,
        finding : finding,
        responsible_user_id: corrective_action.responsible_user.id,
        description: corrective_action.description,
        start_date: this._helperService.processDate(corrective_action.start_date, 'split'),
        target_date: this._helperService.processDate(corrective_action.target_date, 'split'),
        documents: ''
      }
      this.openFormModal();
    }) 
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteCorrectiveActions(status)
      break;  
    }
  }

  delete(item){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = item.id;
    this.popupObject.finding_id = item.finding_id;
    this.popupObject.title = 'Delete Corrective Action?';
    this.popupObject.subtitle = "common_delete_subtitle";

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deleteCorrectiveActions(status){
    if (status && this.popupObject.id) {

      this._correctiveActionService.deleteItem(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        FindingCorrectiveActionStore.FindingCorrectiveActionId = null;
        this.getCorrectiveActions();
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
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
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
          var purl = this._correctiveActionService.getThumbnailPreview('corrective-action', element.token);
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

  setCorrectiveActionSort(type) {
    this._correctiveActionService.sortCorrectiveActionList(type);
    this.getCorrectiveActions();
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
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addCASubscriptionEvent.unsubscribe();
    FindingCorrectiveActionStore.loaded = false;
    FindingCorrectiveActionStore.FindingCorrectiveActionId = null;
    this.popupControlEventSubscription.unsubscribe();
		this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
		RightSidebarLayoutStore.showFilter = false;
    AppStore.showDiscussion = false;
  }

}
