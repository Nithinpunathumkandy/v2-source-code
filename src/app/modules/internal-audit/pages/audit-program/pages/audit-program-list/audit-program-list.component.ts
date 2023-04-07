import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { Subscription } from 'rxjs';
import { AuditProgram } from 'src/app/core/models/internal-audit/audit-program/audit-program';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import {AuditProgramMasterStore} from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-program-list',
  templateUrl: './audit-program-list.component.html',
  styleUrls: ['./audit-program-list.component.scss']
})
export class AuditProgramListComponent implements OnInit , OnDestroy{
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  addAuditProgramObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupControlEventSubscription: any;
  addAuditProgramEventSubscription: any;
  filterSubscription: Subscription = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  constructor(private _auditProgramService : AuditProgramService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _imageService:ImageServiceService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _rightSidebarFilterService: RightSidebarFilterService
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AuditProgramMasterStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    AppStore.showDiscussion = false;

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_audit_program'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_AUDIT_PROGRAM', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_AUDIT_PROGRAM_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDIT_PROGRAM', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'import'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_AUDIT_PROGRAM')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
  
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addAuditProgramObject.type = 'Add';
              this.addAuditProgramObject.values = null; // for clearing the value
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          case "template":
            this._auditProgramService.generateTemplate();
            break;
          case "export_to_excel":
            this._auditProgramService.exportToExcel();
            break;
          case "search":
            AuditProgramMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
            case "refresh":
              AuditProgramMasterStore.loaded=false;
              AuditProgramMasterStore.searchText = null;
              this.pageChange(1);
              break;
            case "import":
              ImportItemStore.setTitle('import_audit_program');
              ImportItemStore.setImportFlag(true);
              break;
            default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addAuditProgramObject.type = 'Add';
        this.addAuditProgramObject.values = null; // for clearing the value
        this.openFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._auditProgramService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
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
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);


     // for deleting/activating/deactivating using delete modal
     this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.addAuditProgramEventSubscription = this._eventEmitterService.addAuditProgramModal.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })
    //  // setting submenu items
    //  SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   {type:'new_modal'},
    //   { type: 'template' },
    //   { type: 'export_to_excel' ,path:'internal-audit' }

    // ]);

    RightSidebarLayoutStore.filterPageTag = 'audit_programz';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      // 'audit_program_ids',
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'audit_program_status_ids',
  
    ]);
    this.pageChange(1);
    
  }
  pageChange(newPage: number = null) {
    if (newPage) AuditProgramMasterStore.setCurrentPage(newPage);
    this._auditProgramService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // for opening modal
  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }
  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.addAuditProgramObject.type = null;
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


   // Returns default image
   getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }



  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  // edit function
  getAuditProgram(id: number){
    event.stopPropagation();

    this._auditProgramService.getItem(id).subscribe(res=>{

      if(AuditProgramMasterStore.individualLoaded){

        const auditProgram: AuditProgram = AuditProgramMasterStore.individualAuditPrograms;

        this.addAuditProgramObject.values = {
          id: auditProgram.id,
          title: auditProgram.title,
          description: auditProgram.description,
          from: this._helperService.processDate(auditProgram.start_date,'split'),
          to: this._helperService.processDate(auditProgram.end_date,'split'),
        }
        this.addAuditProgramObject.type = 'Edit';
        this.openFormModal();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  
  }

  gotToAuditProgramDetails(id: number){
    this._router.navigateByUrl('/internal-audit/audit-programs/'+id);
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'are_you_sure': this.deleteAuditProgram(status)
        break;
    }

  }


  // delete function call
  deleteAuditProgram(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditProgramService.delete(this.popupObject.id).subscribe(resp => {
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
 
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'are_you_sure';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Audit Program?';
    this.popupObject.subtitle = 'remove_audit_program_list_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }



   // for sorting
   sortTitle(type: string) {
    // AuditProgramMasterStore.setCurrentPage(1);
    this._auditProgramService.sortAuditProgramList(type, SubMenuItemStore.searchText);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditProgramMasterStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlEventSubscription.unsubscribe();
    this.addAuditProgramEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();    
    RightSidebarLayoutStore.showFilter = false;
    AuditProgramMasterStore.clearAuditPrograms();
  }


}
