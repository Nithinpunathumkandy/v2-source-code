import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, Renderer2 } from "@angular/core";
import { ControlsService } from "../../../../../../core/services/bpm/controls/controls.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { ControlStore } from "../../../../../../stores/bpm/controls/controls.store";
import { IReactionDisposer, autorun } from "mobx";
import { Router } from "@angular/router";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";
import { RightSidebarFilterService } from "src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service";
import { RightSidebarLayoutStore } from "src/app/stores/general/right-sidebar-layout.store";
import { Subscription } from "rxjs";
import { fileUploadPopupStore } from "src/app/stores/file-upload-popup/fileUploadPopup.store";
import { DocumentFileService } from "src/app/core/services/knowledge-hub/documents/document-file.service";
import { FileUploadPopupService } from "src/app/core/services/fileUploadPopup/file-upload-popup.service";
import { BPMDashboardStore } from "src/app/stores/bpm/bpm-dashboard/bpm-dashboard-store";

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-controls-list",
  templateUrl: "./controls-list.component.html",
  styleUrls: ["./controls-list.component.scss"],
})
export class ControlsListComponent implements OnInit {

  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  ControlStore = ControlStore;
  reactionDisposer: IReactionDisposer;
  fileUploadPopupStore=fileUploadPopupStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  formErrors: any;

  controlObject = {
    component: 'Master',
    values: null,
    type:null
  }

  
  popupObject = {
    title: '',
    id: null,
    subtitle: '',
    status:'',
    type:null
  };

  deleteEventSubscription: any;
  controlSubscriptionEvent: any = null;
  ModalStyleSubscriptionEvent: any;
  idleTimeoutSubscription: any;
  filterSubscription: Subscription = null;
  controlEfficiencyMeasuresSubscriptionEvent: any = null;
  networkFailureSubscription: any;
  fileUploadPopupSubscription:any;
  constructor(
    private _controLService: ControlsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
  ) {}

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ControlStore.control_loaded = false;
      // this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    NoDataItemStore.setNoDataItems({title: "control_nodata_title", subtitle: 'control_nodata_subtitle',buttonText: 'add_new_control'});
    AppStore.showDiscussion = false;

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_CONTROL', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_CONTROL_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_CONTROL', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_CONTROL', submenuItem: {type: 'import'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_CONTROL')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.controlObject.type = 'Add'
              this.controlObject.values=null
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          case "template":
            this._controLService.generateTemplate();
            break;
          case "export_to_excel":
            this._controLService.exportToExcel();
            break;
          case "search":
            ControlStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            ControlStore.searchText = '';
            this.ControlStore.control_loaded = false;
            BPMDashboardStore.bpmDashboardParam = false;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_control');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.controlObject.type = 'Add'
        this.controlObject.values=null
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._controLService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    });
    

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.controlSubscriptionEvent = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal()
    })

    // SubScribing to Set the Style of Modal Once Closed in Child Component.

    this.fileUploadPopupSubscription=this._eventEmitterService.fileUploadPopup.subscribe(res=>{
      this.setZIndex()
    })

    this.ModalStyleSubscriptionEvent = this._eventEmitterService.ModalStyle.subscribe(res => {

      this.setZIndex()
    })

    this.controlEfficiencyMeasuresSubscriptionEvent = this._eventEmitterService.controlEfficienyMeasures.subscribe(res => {
      this.setZIndex()
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        if($(this.formModal.nativeElement).hasClass('show')){
          this.setZIndex()
        }     
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        if($(this.formModal.nativeElement).hasClass('show')){
          this.setZIndex()
        }  
        // if($(this.controlTypesFormModal.nativeElement).hasClass('show')){
        //   this._renderer2.setStyle(this.controlTypesFormModal.nativeElement,'z-index',999999);
        //   this._renderer2.setStyle(this.controlTypesFormModal.nativeElement,'overflow','auto');
        // }
        // if($(this.controlCategoryFormModal.nativeElement).hasClass('show')){
        //   this._renderer2.setStyle(this.controlCategoryFormModal.nativeElement,'z-index',999999);
        //   this._renderer2.setStyle(this.controlCategoryFormModal.nativeElement,'overflow','auto');
        // }
        // if($(this.controlSubCategoryFormModal.nativeElement).hasClass('show')){
        //   this._renderer2.setStyle(this.controlSubCategoryFormModal.nativeElement,'z-index',999999);
        //   this._renderer2.setStyle(this.controlSubCategoryFormModal.nativeElement,'overflow','auto');
        // }
        // if($(this.controlEfficiencyModal.nativeElement).hasClass('show')){
        //   this._renderer2.setStyle(this.controlEfficiencyModal.nativeElement,'z-index',999999);
        //   this._renderer2.setStyle(this.controlEfficiencyModal.nativeElement,'overflow','auto');
        // }
      }
    })


    SubMenuItemStore.setNoUserTab(true);
    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   { type: "new_modal" },
    //   { type: "template" },
    //   { type: "export_to_excel" },
    // ]);

    // ControlStore.setOrderBy(null);
    RightSidebarLayoutStore.filterPageTag = 'controls';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      // 'organization_ids',
      // 'division_ids',
      // 'department_ids',
      // 'section_ids',
      // 'sub_section_ids',
      'control_type_ids',
      'control_category_ids',
      'control_sub_category_ids',
      'control_mode_ids',
      'control_efficiency_measure_ids',
      'accountable_user_ids',
      'responsible_user_ids',
      'consulted_user_ids',
      'informed_user_ids'
    ]);
    this.pageChange(1);
  }


  pageChange(newPage: number = null) {
    if (newPage) ControlStore.setCurrentPage(newPage);
    this._controLService
      .getAllItems(false,BPMDashboardStore.bpmDashboardParam ? '&process_controls='+BPMDashboardStore.bpmDashboardParam : '',true)
      .subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }
  // Delete New Modal

  setZIndex(){
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
    this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
  }

  setControlSort(type) {
    ControlStore.setCurrentPage(1);
    this._controLService.sortControlList(type,true);
  }

  deleteConfirm(id: number,status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title='Delete Control?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this.popupObject.type = ''
    this.popupObject.status=status
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }


  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Control?';
    this.popupObject.subtitle = 'common_activate_subtitle';
    this.popupObject.type='Activate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deactivateConfirm(id: number) {
    if(event) event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Control?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
    this.popupObject.type='Deactivate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }
    /**
   * Delete Control | Activate Control |  Deactivate Control
   * @param id -Control id
   */

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteControl(status)
        break;
      case 'Activate': this.activateControl(status)
        break;
      case 'Deactivate': this.deactivateControl(status)
        break;

    }

  }

  // Delete Process Function
  
  deleteControl(status: boolean) {
    if (status && this.popupObject.id) {
      if (this.popupObject.status == 'Inactive') {
        if (status && this.popupObject.id) {
          this._controLService.delete(this.popupObject.id).subscribe(resp => {
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
            
      this._controLService.delete(this.popupObject.id).subscribe(resp => {
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

   activateControl(status: boolean) {
    if (status && this.popupObject.id) {
      this._controLService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateControl(status: boolean) {
    if (status && this.popupObject.id) {
      this._controLService.deactivate(this.popupObject.id).subscribe(resp => {
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
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

}

closeConfirmationPopup(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}

  // Getting & Passing Data To Update by Id

  getControl(id: number) {
    event.stopPropagation();
    this._controLService.getItemById(id).subscribe(res => {
      this.setDocuments(res.control_documents)
      var controlDetails = res
      this.controlObject.values = {
        id: id,
        reference_code:controlDetails.reference_code,
        description:controlDetails.description,
        title: controlDetails.title,
        control_type_id: controlDetails.control_type?controlDetails.control_type.id:'',
        control_category_id: controlDetails.control_category?controlDetails.control_category.id:null,
        control_sub_category_id: controlDetails.control_sub_category?controlDetails.control_sub_category.id:'',
        control_objectives:controlDetails.control_objectives,
        control_efficiency_measure: controlDetails.control_efficiency_measure ? controlDetails.control_efficiency_measure.id : null,
        control_efficiency_remarks: controlDetails.control_control_efficiency_remarks ? controlDetails.control_control_efficiency_remarks : '',
        control_mode_id:controlDetails.control_mode?.id?controlDetails.control_mode.id:null,
      }

      this.controlObject.type = 'Edit';
     this.openFormModal();
      this._utilityService.detectChanges(this._cdr);

    })


  }

  setDocuments(documents){

    let khDocuments = [];
    documents.forEach(element => {

      if(element.document_id){
        element.kh_document.versions.forEach(innerElement => {

          if(innerElement.is_latest){
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document':true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId':element.id,
              ...innerElement
              
            })
          }

        });
      }
      else
      {
        if (element && element.token) {
          var purl = this._documentFileService.getThumbnailPreview('control-document', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document':false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }
  // Function To Redirect to Details Page
  gotoControlDetails(id) {
    
    ControlStore.unsetControlDetails();
    ControlStore.unSelectControls();
    
    this._router.navigateByUrl("/bpm/controls/"+id);
  }

  
  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.controlObject.type = null;
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe()
    this.controlSubscriptionEvent.unsubscribe()
    this.ModalStyleSubscriptionEvent.unsubscribe()
    this.idleTimeoutSubscription.unsubscribe();
    this.controlEfficiencyMeasuresSubscriptionEvent.unsubscribe();
    this.fileUploadPopupSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    SubMenuItemStore.searchText = '';
    ControlStore.searchText = '';
    BPMDashboardStore.bpmDashboardParam = false;
  }

  

}
