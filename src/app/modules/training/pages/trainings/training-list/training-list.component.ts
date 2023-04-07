import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Trainings } from 'src/app/core/models/training/trainings/trainings.model';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { TrainingsService } from 'src/app/core/services/training/trainings/trainings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { TrainingDashboardStore } from 'src/app/stores/training/training-dashboard/training-dashboard-store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';
declare var $: any;
@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
  @ViewChild("TrainingFormModal", { static: true }) TrainingFormModal: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
  TrainingsStore = TrainingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  filterSubscription:any;
  trainingModalSubscription: any = null;
  deleteEventSubscription: any;

  TrainingModalObject = {
    id: null,
    type: null,
  };

  popupObject = {
    type: "",
    title: "",
    id: null,
    subtitle: "",
  };

  constructor(private _trainingsService:TrainingsService,
    private _router:Router,
    private _renderer2: Renderer2,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _cdr:ChangeDetectorRef,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.TrainingsStore.loaded = false;
      this.getItems(1);
    });
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_training'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search'} },
        { activityName: 'CREATE_TRAINING', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_TRAINING_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_TRAINING', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'IMPORT_TRAINING', submenuItem: { type: 'import' } },
       
      ]    

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
              // this._utilityService.detectChanges(this._cdr);
            }, 1000);
            break;
            case "template":
              this._trainingsService.generateTemplate();
            break;
          case "export_to_excel":
            this._trainingsService.exportToExcel();
            break;
            case "search":
              TrainingsStore.searchText = SubMenuItemStore.searchText;
              this.getItems(1);
              break;
              case "import":
              ImportItemStore.setTitle('import_training');
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
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._trainingsService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
    this.trainingModalSubscription = this._eventEmitterService.trainingModal.subscribe(
      (res) => {
        this.closeFormModal();
        this.getItems();
      }
    );

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
      (item) => {
        this.modalControl(item);
      }
    );

    this.getItems(1);

    RightSidebarLayoutStore.filterPageTag = 'trainings';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'training_category_ids',
      'training_status_ids',
      'user_ids',
      'training_competency_group_ids',
      'training_competency_ids'
    ]);
  }


  addNewItem() {
    this.TrainingModalObject.type = "Add";
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.TrainingFormModal.nativeElement).modal("show");
      this._renderer2.setStyle(this.TrainingFormModal.nativeElement,'z-index','99999');
    }, 100);
  }

  closeFormModal() {
    $(this.TrainingFormModal.nativeElement).modal("hide");
    this._renderer2.setStyle(this.TrainingFormModal.nativeElement,'z-index','9');
    this.TrainingModalObject.type = null;
  }


  getItems(newPage: number = null){
    if (newPage) TrainingsStore.setCurrentPage(newPage);
    var additionalParams=''
      if (TrainingDashboardStore.dashboardParameter) {
        additionalParams = TrainingDashboardStore.dashboardParameter
      }
      this._trainingsService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  setTrainingSort(type) {
    this._trainingsService.sortTrainingList(type);
    this.getItems();
  }

  getDetails(id){
    if (AuthStore.getActivityPermission(100, 'TRAINING_DETAILS')) {
      TrainingsStore.training_id = id;
    this._router.navigateByUrl('/trainings/training/'+id);
    }
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  
  getTraining(id: number) {
    event.stopPropagation();
    //set form value
    this.TrainingModalObject.id = id;
    TrainingsStore.training_id = id;
    this.TrainingModalObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }


  deleteTraining(status: boolean) {
    if (status && this.popupObject.id) {
      this._trainingsService.deleteTraining(this.popupObject.id).subscribe(
        (resp) => {       
          this._utilityService.detectChanges(this._cdr);
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        },
      );
    } else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }


  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = "";
    this.popupObject.id = id;
    this.popupObject.title = "Delete Training?";
    this.popupObject.subtitle = "common_delete_subtitle";
    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal("hide");
    this._utilityService.detectChanges(this._cdr);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case "":
        this.deleteTraining(status);
        break;
    }
  }

  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    SubMenuItemStore.makeEmpty();
    // this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    this.trainingModalSubscription.unsubscribe();
    TrainingsStore.searchText = null;
    SubMenuItemStore.searchText = '';
  }
}
