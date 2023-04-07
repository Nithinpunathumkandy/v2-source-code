import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { Router } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auditable-item-list',
  templateUrl: './auditable-item-list.component.html',
  styleUrls: ['./auditable-item-list.component.scss']
})
export class AuditableItemListComponent implements OnInit , OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("importRiskPopup") importRiskPopup: ElementRef;
  @ViewChild("importProcessPopup") importProcessPopup: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  AuditableItemMasterStore = AuditableItemMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  filterSubscription: Subscription = null;

  auditableItemObject = {
    component: 'Master',
    values: null,
    type: null
  };

  importRiskObject = {
    component: 'Master',
    values: null,
    type: null
  };

  importProcessObject = {
    component: 'Master',
    values: null,
    type: null
  };


  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };


  auditableItemSubscriptionEvent: any = null;
  popupControlAuditableEventSubscription: any;

  importRiskSubscriptionEvent: any;
  importprocessSubscriptionEvent: any;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor( private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _auditableItemService: AuditableItemService,
    private _rightSidebarFilterService: RightSidebarFilterService
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AuditableItemMasterStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    AppStore.showDiscussion = false;

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_auditable_item'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_AUDITABLE_ITEM', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_AUDITABLE_ITEM_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDITABLE_ITEM', submenuItem: {type: 'export_to_excel'}},
        {activityName: '', submenuItem: {type: 'import'}},
        {activityName: 'IMPORT_AUDITABLE_ITEM_FROM_RISK', submenuItem: {type: 'import-risk'}},
        {activityName: 'IMPORT_AUDITABLE_ITEM_FROM_PROCESS', submenuItem: {type: 'import-process'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_AUDITABLE_ITEM')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.AuditableItemMasterStore.clearDocumentDetails();// clear document details
            this.AuditableItemMasterStore.unSelectControls();// clear controls details
            this.AuditableItemMasterStore.unSelectChecklist();// clear checklist details
            this.addAuditableItem();
            break;
          case "template":
            this._auditableItemService.generateTemplate();
            break;
          case "export_to_excel":
            this._auditableItemService.exportToExcel();
            break;
          case "search":
            AuditableItemMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            AuditableItemMasterStore.loaded = false;
            AuditableItemMasterStore.searchText = null;
            this.pageChange(1);
            break;
          case "import-risk":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.gotoRiskModal();
            }, 1000);
            break;
          case "import-process":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.gotoProcessModal();
            }, 1000);
            break;
          case "import":
            ImportItemStore.setTitle('import_auditable_item');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addAuditableItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._auditableItemService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          if(res){
            this.pageChange(1);
          }
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
    this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })


     // calling import process modal
     this.importprocessSubscriptionEvent = this._eventEmitterService.importProcessModal.subscribe(res=>{

      this.closeImportProcessModal();
    })

    // calling import risk modal

    this.importRiskSubscriptionEvent = this._eventEmitterService.importRiskModal.subscribe(res =>{

      this.closeImportRiskModal();
    })


    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })


    // // setting submenu items
    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   {type: 'refresh'},
    //   {type:'new_modal'},
    //   { type: 'import-risk' },
    //   { type: 'import-process' },
    //   { type: 'template' },
    //   { type: 'export_to_excel' ,path:'internal-audit' }

    // ]);
    RightSidebarLayoutStore.filterPageTag = 'audit_item';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'risk_ids',
      'risk_rating_ids',
      'auditable_item_category_ids',
      'auditable_item_type_ids'
  
    ]);

    this.pageChange(1);
  }



  pageChange(newPage: number = null) {
    if (newPage) AuditableItemMasterStore.setCurrentPage(newPage);
    this._auditableItemService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  

  // for adding auditable item
  addAuditableItem(){
    this._router.navigateByUrl('internal-audit/auditable-items/add-auditable-item');
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

  getAuditableItem(id:number){

    this._router.navigateByUrl('/internal-audit/auditable-items/'+id);
  }

   //edit function

   editAuditableItem(id:number){
    event.stopPropagation();
    this._auditableItemService.getItem(id).subscribe(res=>{
      this._router.navigateByUrl('/internal-audit/auditable-items/edit-auditable-item');
      this._utilityService.detectChanges(this._cdr)
    });

  }


  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditableItem(status)
        break;

      case 'Activate': this.activateAuditableItem(status)
        break;

      case 'Deactivate': this.deactivateAuditableItem(status)
        break;

    }

  }

  gotoRiskModal(){
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.importRiskPopup.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
    this._renderer2.removeAttribute(this.importRiskPopup.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.importRiskPopup.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);

    this.importRiskObject.type = 'AuditableItemRisk';
  }

  gotoProcessModal(){
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.importProcessPopup.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
    this._renderer2.removeAttribute(this.importProcessPopup.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.importProcessPopup.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);

    this.importProcessObject.type = 'AuditableItemProcess';
  }

  closeImportProcessModal(){
  
     
      this.pageChange(1);// calling for redreshing the list
      this._utilityService.detectChanges(this._cdr);
      this.importProcessObject.type = null;
      this._renderer2.removeClass(this.importProcessPopup.nativeElement, 'show')
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.importProcessPopup.nativeElement, 'display', 'none');
      // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      this._renderer2.setAttribute(this.importProcessPopup.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();

      setTimeout(() => {
        this._renderer2.removeClass(this.importProcessPopup.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
  
  }
  closeImportRiskModal(){
   
      
      this.pageChange(1);// calling for redreshing the list
      this._utilityService.detectChanges(this._cdr);
      this.importRiskObject.type = null;
      this._renderer2.removeClass(this.importRiskPopup.nativeElement, 'show')
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.importRiskPopup.nativeElement, 'display', 'none');
      // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      this._renderer2.setAttribute(this.importRiskPopup.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();


      setTimeout(() => {
        this._renderer2.removeClass(this.importRiskPopup.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
     
  }

  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }


  changeZIndex(){
    if($(this.importRiskPopup.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.importRiskPopup.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.importRiskPopup.nativeElement,'overflow','auto');
    }
    else if($(this.importProcessPopup.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.importProcessPopup.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.importProcessPopup.nativeElement,'overflow','auto');
    }
  }



  // delete function call
  deleteAuditableItem(status: boolean) {

    if (status && this.popupObject.id) {
      this._auditableItemService.delete(this.popupObject.id).subscribe(resp => {
          this._utilityService.detectChanges(this._cdr);
      
        this.clearPopupObject();
       // this.closeConfirmationPopup();
      },(error=>{
        
       
          setTimeout(() => {
            if(error.status == 405){ 
          this.deactivate(this.popupObject.id);
          this._utilityService.detectChanges(this._cdr);
        }
        }, 500);
          // this.clearPopupObject();
          // this.closeConfirmationPopup();
      })
      );
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
    setTimeout(() => {
      this.closeConfirmationPopup();
    }, 100);  

  }


  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  // calling activcate function

  activateAuditableItem(status: boolean) {
    if (status && this.popupObject.id) {
      this._auditableItemService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateAuditableItem(status: boolean) {
    if (status && this.popupObject.id) {
      this._auditableItemService.deactivate(this.popupObject.id).subscribe(resp => {
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

  // for activate 
  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Auditable Item?';
    this.popupObject.subtitle = 'activate_auditable_item_subtitle';
    this.popupObject.type = 'Activate';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Auditable Item?';
    this.popupObject.subtitle = 'deactivate_auditable_item_subtitle';
    this.popupObject.type = 'Deactivate';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Auditable Item?';
    this.popupObject.subtitle = 'delete_adutibale_item';
    this.popupObject.type = '';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    // AuditableItemMasterStore.setCurrentPage(1);
    this._auditableItemService.sortAuditableItemlList(type, SubMenuItemStore.searchText);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditableItemMasterStore.searchText = null;
    this.popupControlAuditableEventSubscription.unsubscribe();
    this.importRiskSubscriptionEvent.unsubscribe();
    this.importprocessSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    RightSidebarLayoutStore.showFilter = false;
    SubMenuItemStore.searchText = '';
    AuditableItemMasterStore.searchText = '';
    AuditableItemMasterStore.clearAuditableItem()
  }

}

