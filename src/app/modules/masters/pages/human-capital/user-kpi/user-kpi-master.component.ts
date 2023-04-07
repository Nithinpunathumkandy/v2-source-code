import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { KpiMasterStore } from 'src/app/stores/masters/human-capital/kpi-master.store';
import { KpiService } from 'src/app/core/services/masters/human-capital/kpi/kpi.service'
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Kpi } from 'src/app/core/models/masters/human-capital/user-kpi';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from "src/app/stores/app.store";
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-kpi-master',
  templateUrl: './user-kpi-master.component.html',
  styleUrls: ['./user-kpi-master.component.scss']
})
export class UserKpiMasterComponent implements OnInit, OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;


  KpiMasterStore = KpiMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_kpi_message';

  userKpiObject = {
    component: 'Master',
    values: null,
    type: null
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  userKpiSubscriptionEvent: any = null;
  popupUserKpiEventSubscription: any;
  closingChildModalEvent: any;
  closingChildKpiCategoryEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(private _kpiService: KpiService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
  ) { }

  ngOnInit(): void {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'New KPI'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'KPI_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_KPI', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_KPI_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_KPI', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_KPI', submenuItem: { type: 'share'}},
        {activityName: 'IMPORT_KPI', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path:'human-capital'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_KPI')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
     
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._kpiService.generateTemplate();
            break;
          case "export_to_excel":
            this._kpiService.exportToExcel();
            break;
          case "search":
            KpiMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_kpi_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_kpi');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ShareItemStore.shareData){
        this._kpiService.shareData(ShareItemStore.shareData).subscribe(res=>{
            ShareItemStore.unsetShareData();
            ShareItemStore.setTitle('');
            ShareItemStore.unsetData();
            $('.modal-backdrop').remove();
            document.body.classList.remove('modal-open');
            setTimeout(() => {
              $(this.mailConfirmationPopup.nativeElement).modal('show');              
            }, 200);
        },(error)=>{
          if (error.status == 422){
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();
          console.log(error);
        });
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._kpiService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    })

    // for deleting/activating/deactivating using delete modal
    this.popupUserKpiEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.userKpiSubscriptionEvent = this._eventEmitterService.userKpiControl.subscribe(res => {
      this.closeFormModal();
    })

    // closing child modal

    this.closingChildModalEvent = this._eventEmitterService.humanCapitalKpiChildControl.subscribe(res => {
      this.closeChild();
    })

    // for closing kpi category child
    this.closingChildKpiCategoryEvent = this._eventEmitterService.closeKpiCategoryChild.subscribe(res =>{
      this.closeKpiCategoryChild();
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

    this.pageChange(1);


  }

  addNewItem(){
    this.userKpiObject.type = 'Add';
    this.userKpiObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) KpiMasterStore.setCurrentPage(newPage);
    this._kpiService.getKpis(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.userKpiObject.type = null;
  }


  // closing child function 

  closeChild() {
    setTimeout(() => {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }, 50);
  }

  closeKpiCategoryChild(){
    setTimeout(() => {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }, 50);

  }
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteUserKpi(status)
        break;

      case 'Activate': this.activateUserUserKpi(status)
        break;

      case 'Deactivate': this.deactivateUserUserKpi(status)
        break;

    }

  }

  // delete function call
  deleteUserKpi(status: boolean) {
    if (status && this.popupObject.id) {
      this._kpiService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && KpiMasterStore.getKpiItemById(this.popupObject.id).status_id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else{
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        }

      })
      );
    }
    else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }

  closeConfirmationPopUp(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

  // calling activcate function

  activateUserUserKpi(status: boolean) {
    if (status && this.popupObject.id) {

      this._kpiService.activate(this.popupObject.id).subscribe(resp => {
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

  // calling deactivate function

  deactivateUserUserKpi(status: boolean) {
    if (status && this.popupObject.id) {

      this._kpiService.deactivate(this.popupObject.id).subscribe(resp => {
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

  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate User Kpi?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate User Kpi?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete  User Kpi?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }



  getKpi(id) {

    this.KpiMasterStore.clearDocumentDetails();
    this._kpiService.getIndividualKpi(id).subscribe(res => {


      if (KpiMasterStore.loaded) {

        const UserKpi: Kpi = KpiMasterStore.individualKpiDetails;

        //set form value
        if (UserKpi.documents && UserKpi.documents.length > 0) {
          for (let i of UserKpi.documents) {
            let docurl = this._humanCapitalService.getThumbnailPreview('user-kpis', i.token);
            let docDetails = {
              created_at: i.created_at,
              created_by: i.created_by,
              updated_at: i.updated_at,
              updated_by: i.updated_by,
              name: i.title,
              ext: i.ext,
              size: i.size,
              url: i.url,
              thumbnail_url: i.url,
              token: i.token,
              preview: docurl,
              id: i.id,
              user_kpi_id: i.user_kpi_id

            };
            this._kpiService.setDocumentDetails(docDetails, docurl);
          }

        }

        //set form value
        this.userKpiObject.values = {
          id: UserKpi.id,
          unit_id: UserKpi.unit ? UserKpi.unit.id : null,
          description: UserKpi.description,
          title: UserKpi.title,
          kpi_category_id: UserKpi.kpi_category ? UserKpi.kpi_category.id : null,
          kpi_type_id: UserKpi.kpi_type ? UserKpi.kpi_type.id : null,
          target: UserKpi.target,
          documents: '',
          is_dashboard:UserKpi.is_dashboard,
        }
        this.userKpiObject.type = 'Edit';
        this.openFormModal();
      }

      this._utilityService.detectChanges(this._cdr);
    });
  }


  // for sorting
  sortTitle(type: string) {
    // KpiMasterStore.setCurrentPage(1);
    this._kpiService.sortUserKpiList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupUserKpiEventSubscription.unsubscribe();
    this.userKpiSubscriptionEvent.unsubscribe();
    this.closingChildModalEvent.unsubscribe();
    this.closingChildKpiCategoryEvent.unsubscribe();
    KpiMasterStore.searchText = '';
    KpiMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
