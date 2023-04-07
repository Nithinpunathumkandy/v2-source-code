import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CyberIncidentImpactAnalysisCategoryService } from 'src/app/core/services/masters/cyber-incident/cyber-incident-impact-analysis-category/cyber-incident-impact-analysis-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CyberIncidentImpactAnalysisCategoryMasterStore } from 'src/app/stores/masters/cyber-incident/cyber-incident-impact-analysis-category-store';

declare var $: any;
@Component({
  selector: 'app-cyber-incident-impact-analysis-category',
  templateUrl: './cyber-incident-impact-analysis-category.component.html',
  styleUrls: ['./cyber-incident-impact-analysis-category.component.scss']
})
export class CyberIncidentImpactAnalysisCategoryComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  CyberIncidentImpactAnalysisCategoryMasterStore = CyberIncidentImpactAnalysisCategoryMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  ImportItemStore = ImportItemStore;
  ShareItemStore = ShareItemStore;
  mailConfirmationData = 'cyber_incident_impact_analysis_category_share_message';

  CICategoryObject = {
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


  CICategorySubscriptionEvent: any = null;
  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(
    private _cyberIncidentImpactAnalysisCategoryService: CyberIncidentImpactAnalysisCategoryService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2
  ) { }

  ngOnInit() {

    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_cyber_incident_impact_analysis_category'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'CYBER_INCIDENT_IMPACT_ANALYSIS_CATEGORY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_CYBER_INCIDENT_IMPACT_ANALYSIS_CATEGORY', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_CYBER_INCIDENT_IMPACT_ANALYSIS_CATEGORY', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_CYBER_INCIDENT_IMPACT_ANALYSIS_CATEGORY', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_CYBER_INCIDENT_IMPACT_ANALYSIS_CATEGORY', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_CYBER_INCIDENT_IMPACT_ANALYSIS_CATEGORY', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'cyber-incident'}},
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_CYBER_INCIDENT_IMPACT_ANALYSIS_CATEGORY')){
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
            this._cyberIncidentImpactAnalysisCategoryService.generateTemplate();
            break;
          case "export_to_excel":
            this._cyberIncidentImpactAnalysisCategoryService.exportToExcel();
            break;
          case "search":
            CyberIncidentImpactAnalysisCategoryMasterStore.searchText  = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('cyber_incident_impact_analysis_category_share_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('cyber_incident_impact_analysis_category_import');
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
        this._cyberIncidentImpactAnalysisCategoryService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._cyberIncidentImpactAnalysisCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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



    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    
    this.CICategorySubscriptionEvent = this._eventEmitterService.cyberIncidentImpactAnalysisCategory.subscribe(res=>{
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

    this.pageChange(1);
  }

  addNewItem(){
      this.CICategoryObject.type = 'Add';
      this.CICategoryObject.values = null; // for clearing the value
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }

  pageChange(newPage: number = null) {
    if (newPage) CyberIncidentImpactAnalysisCategoryMasterStore.setCurrentPage(newPage);
    this._cyberIncidentImpactAnalysisCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Delte New Modal

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteCIImpactAnalysisCategory(status)
        break;

      case 'Activate': this.activateCIImpactAnalysisCategory(status)
        break;

      case 'Deactivate': this.deactivateCIImpactAnalysisCategory(status)
        break;

    }

  }


  // delete function call
  deleteCIImpactAnalysisCategory(status: boolean) {
    if (status && this.popupObject.id) {
      this._cyberIncidentImpactAnalysisCategoryService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && CyberIncidentImpactAnalysisCategoryMasterStore.getCategoryById(this.popupObject.id).status_id == AppStore.activeStatusId){
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

  activateCIImpactAnalysisCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._cyberIncidentImpactAnalysisCategoryService.activate(this.popupObject.id).subscribe(resp => {
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

  deactivateCIImpactAnalysisCategory(status: boolean) {
    if (status && this.popupObject.id) {

      this._cyberIncidentImpactAnalysisCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Cyber Incident Impact Analysis Category?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Cyber Incident Impact Analysis Category?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Cyber Incident Impact Analysis Category?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.CICategoryObject.type = null;
  }
  

  getCIImpactAnalysisCategory(id: number) {
    this._cyberIncidentImpactAnalysisCategoryService.getItem(id).subscribe(res=>{
      if(res){
      this.CICategoryObject.values = {
        id: res.id,
        title: res.title,  
        description: res.description  
      }
    }
    this.CICategoryObject.type = 'Edit';
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);
    })
  }

  // for sorting
 sortTitle(type: string) {
  // ControlCategoryMasterStore.setCurrentPage(1);
  this._cyberIncidentImpactAnalysisCategoryService.sortCyberIncidentImpactAnalysisCategoryList(type, SubMenuItemStore.searchText);
  this.pageChange();
}


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.CICategorySubscriptionEvent.unsubscribe();
    CyberIncidentImpactAnalysisCategoryMasterStore.searchText = '';
    CyberIncidentImpactAnalysisCategoryMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
