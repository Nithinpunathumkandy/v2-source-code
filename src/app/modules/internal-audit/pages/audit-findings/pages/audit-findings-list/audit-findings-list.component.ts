import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import {AuditFindingsStore} from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IADashboardStore } from 'src/app/stores/internal-audit/dashboard/dasboard-store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audit-findings-list',
  templateUrl: './audit-findings-list.component.html',
  styleUrls: ['./audit-findings-list.component.scss']
})
export class AuditFindingsListComponent implements OnInit, OnDestroy{
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  AuditFindingsStore = AuditFindingsStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  AuditStore = AuditStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlEventSubscription: any;
  filterSubscription: Subscription = null;
  
  constructor(private _auditFindingsService: AuditFindingsService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _imageService: ImageServiceService
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AuditFindingsStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
  
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.clearCommonFilePopupDocuments();
            AuditFindingsStore.clearDocumentDetails();
            AuditFindingsStore.unSelectAuditableItem();
            AuditFindingsStore.unSelectChecklists();
            AuditStore.audit_id = null;
            this.addFindings();
            break;
          // case "template":
          //   this._auditFindingsService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._auditFindingsService.exportToExcel();
            break;
          case "search":
            AuditFindingsStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            AuditFindingsStore.loaded = false;
            AuditFindingsStore.searchText = null;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addFindings();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_finding'});

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);


     // for deleting/activating/deactivating using delete modal
     this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

     // setting submenu items
     SubMenuItemStore.setSubMenuItems([
      { type: 'search' },
      { type: 'refresh' },
      {type:'new_modal'},
      // { type: 'template' },
      { type: 'export_to_excel' ,path:'internal-audit' }

    ]);
    AuditFindingsStore.setOrderBy('asc');
    RightSidebarLayoutStore.filterPageTag = 'audit_finding';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'audit_ids',
      'finding_category_ids',
      'auditable_item_ids',
      'risk_rating_ids',
      'finding_status_ids',
      'audit_program_ids'
     
    ]);

    this.pageChange(1);
    
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditFindingsStore.setCurrentPage(newPage);
    var additionalParams=''
      if (IADashboardStore.dashboardParameter) {
        additionalParams = IADashboardStore.dashboardParameter
      }
      this._auditFindingsService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  addFindings(){
    AuditFindingsStore.clearDocumentDetails();
    AuditFindingsStore.unSelectAuditableItem();
    AuditFindingsStore.unSelectChecklists();
    AuditStore.audit_id = null;
    this._router.navigateByUrl('/internal-audit/findings/add-findings');
  }

  gotToAuditFindingsDetails(id:number){
    this._router.navigateByUrl('/internal-audit/findings/'+id);
  }

  editAuditFindings(id:number){
    AuditFindingsStore.auditFindingId=id;
    event.stopPropagation();
    AuditStore.audit_id = null;
    this._auditFindingsService.getItem(id).subscribe(res=>{
      this._router.navigateByUrl('/internal-audit/findings/edit-findings');
      this._utilityService.detectChanges(this._cdr)
    });
    
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

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditProgram(status)
        break;
    }

  }

    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
  

    createImagePreview(type, token) {
      return this._imageService.getThumbnailPreview(type, token)
    }


  // delete function call
  deleteAuditProgram(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditFindingsService.delete(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Findings?';
    this.popupObject.subtitle = 'delete_findings';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }



   // for sorting
   sortTitle(type: string) {
    // AuditProgramMasterStore.setCurrentPage(1);
    this._auditFindingsService.sortFindingslList(type, SubMenuItemStore.searchText);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditFindingsStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    AuditFindingsStore.unsetFindings();
    AuditStore.clearAudits()
  }



}
