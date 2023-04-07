import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { UtilityService } from "src/app/shared/services/utility.service";
import { IReactionDisposer, autorun } from "mobx";
import { ProcessService } from '../../../../../../core/services/bpm/process/process.service'
import {ProcessStore} from '../../../../../../stores/bpm/process/processes.store'
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { AppStore } from "src/app/stores/app.store";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { BPMDashboardStore } from 'src/app/stores/bpm/bpm-dashboard/bpm-dashboard-store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.scss']
})
export class ProcessListComponent implements OnInit {


  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ProcessStore = ProcessStore;
  ControlStore = ControlStore;
  AppStore = AppStore;
  AuthStore = AuthStore;

  processObject = {
    component: 'Master',
    values: null,
    type:null
  }
  formErrors: any;

  popupObject = {
    title: '',
    id: null,
    subtitle: '',
    type:null
  };

  deleteEventSubscription: any;

  filterSubscription: Subscription = null;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _processService: ProcessService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _imageService:ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) {}

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ProcessStore.processes_loaded = false;
      this.pageChange(1,false);
    })
    
    NoDataItemStore.setNoDataItems({title:"process_nodata_title", subtitle: 'process_nodata_subtitle',buttonText: 'add_new_process'});
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_PROCESS', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_PROCESS_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_PROCESS', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_PROCESS', submenuItem: {type: 'import'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_PROCESS')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addProcess()
            }, 1000);
            break;
          case "template":
            this._processService.generateTemplate();
            break;
          case "export_to_excel":
            this._processService.exportToExcel();
            break;
            case "search":
              ProcessStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            ProcessStore.searchText = '';
            this.ProcessStore.processes_loaded=false;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_process_title');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
      
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.addProcess();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._processService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    SubMenuItemStore.setNoUserTab(true);
    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   { type: "new_modal" },
    //   { type: "template" },
    //   { type: "export_to_excel" },
    // ]);
    // ProcessStore.setOrderBy(null);
    RightSidebarLayoutStore.filterPageTag = 'process';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'process_group_ids',
      'process_category_ids',
      'process_risk_rating_ids',
      'accountable_user_ids',
      'responsible_user_ids',
      'consulted_user_ids',
      'informed_user_ids',
      'status',
    ]);

    this.pageChange(1,false,'&status=all');
    // this.getStatusIds();
  }

  // getStatusIds() {
  //   this._processService
  //     .getStatusIds(true)
  //     .subscribe(() =>
  //       setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
  //     );
  // }
  
  editProcess(ProcessList){
    event.stopPropagation();
    ProcessStore.setProcessId(ProcessList.id)
    this._processService.getItemById(ProcessList.id).subscribe(res=>{
      this._router.navigateByUrl('/bpm/process/edit-process');
      this._utilityService.detectChanges(this._cdr)
    });
  }

  goToProcessDetails(id) {
    this._router.navigateByUrl("/bpm/process/" + id);
    // this._processService.getItemById(id).subscribe()
  }

  addProcess() {
    ProcessStore.clearProcessAtachements()
    ProcessStore.clearProcessFlowDocuments()
    ControlStore.unSelectControls()
    this._router.navigateByUrl('/bpm/process/add-process');
}

  

  pageChange(newPage: number = null,status?,param?) {
    if (newPage) ProcessStore.setCurrentPage(newPage);
    var additionalParams=''
      if (BPMDashboardStore.dashboardParameter) {
        additionalParams = BPMDashboardStore.dashboardParameter
      }
      this._processService.getAllItems(false,additionalParams ? additionalParams : '').subscribe(() => 
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.processObject.type = null;
  }

  // Delte New Modal

  deleteConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title='Delete Process?';
    this.popupObject.subtitle='common_delete_subtitle';
    this.popupObject.type = ''
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }
  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Process?';
    this.popupObject.subtitle = 'common_activate_subtitle';
    this.popupObject.type='Activate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }
  deactivateConfirm(id: number) {
    if(event) event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Process?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
    this.popupObject.type='Deactivate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteProcess(status)
        break;
      case 'Activate': this.activateProcess(status)
        break;
      case 'Deactivate': this.deactivateProcess(status)
        break;

    }

  }

  // Delete Process Function
  
  deleteProcess(status: boolean) {
      if (status && this.popupObject.id) {
        this._processService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearPopupObject();
          this.closeConfirmationPopup();
        },(error=>{
          if(error.status == 405){
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
      else {
        this.closeConfirmationPopup();
        this.clearPopupObject();
      }  
    }

  
   // calling activcate function

   activateProcess(status: boolean) {
    if (status && this.popupObject.id) {
      this._processService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateProcess(status: boolean) {
    if (status && this.popupObject.id) {
      this._processService.deactivate(this.popupObject.id).subscribe(resp => {
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

  setProcessSort(type) {
    ProcessStore.setCurrentPage(1);
    this._processService.sortProcessList(type,SubMenuItemStore.searchText);
  }


  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.style.height = '45px';
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    this.deleteEventSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    ProcessStore.searchText = '';
  }
  


}
