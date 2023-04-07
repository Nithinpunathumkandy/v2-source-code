import { ChangeDetectorRef, Component, OnDestroy, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ProjectSettingsIssueCategoryService } from 'src/app/core/services/project-management/project-details/project-settings/project-issue-category/project-settings-issue-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { ProjectSettingsCategoryTimeService } from 'src/app/core/services/project-management/project-details/project-settings/category-time/project-settings-category-time.service';
import { ProjectSettingsCategoryTimeStore } from 'src/app/stores/project-management/project-details/project-settings/category-time/pm-category-time.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { autorun, IReactionDisposer } from 'mobx';
declare var $: any;
@Component({
  selector: 'app-project-settings-category',
  templateUrl: './project-settings-category.component.html',
  styleUrls: ['./project-settings-category.component.scss']
})
export class ProjectSettingsCategoryComponent implements OnInit, OnDestroy {

  @ViewChild('addIssueCategory') addIssueCategory: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
  addIssueCategoryEvent: any;
  IssueCategoryOpened = false;
  ProjectsStore = ProjectsStore;
  ProjectSettingsCategoryTimeStore = ProjectSettingsCategoryTimeStore;
  reactionDisposer: IReactionDisposer;
  issueCategoryObject = {
    project_id: null,

  }
  deleteEventSubscription: any;

  popupObject = {
    type: "",
    title: "",
    id: null,
    subtitle: "",
  };
  constructor(
    private _projectSettingsCategoryTimeService: ProjectSettingsCategoryTimeService,
    private _utilityService: UtilityService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.pageChange(1);
    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({ title: "pm_category_time_title", subtitle: 'add_project_category_time_description', buttonText: 'add_pm_category_time' });
      if (NoDataItemStore.clikedNoDataItem) {
        this.openIssueCategoryModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    //objectiveItemAddModalControl
    this.addIssueCategoryEvent = this._eventEmitterService.issueCategoryModal.subscribe(element => {
      this.closeIssueCategoryModal();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
      (item) => {
        this.deleteMaintenance(item);
      }
    );


  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectSettingsCategoryTimeStore.setCurrentPage(newPage);
    this._projectSettingsCategoryTimeService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100))
  }

  sortTitle(type: string) {
    this._projectSettingsCategoryTimeService.sortTaskCategryList(type);
    this.pageChange();
  }

  openIssueCategoryModal() {
    this.IssueCategoryOpened = true;
    this.issueCategoryObject.project_id = this.ProjectsStore.selectedProjectID;
    //this.scheduleObject.values = { status: AssetMaintenanceScheduleStore?.individualSchedule?.asset_maintenance_schedule_status?.id }
    this._renderer2.setStyle(this.addIssueCategory.nativeElement, 'z-index', 999999);
    this._renderer2.addClass(this.addIssueCategory.nativeElement, 'show');
    this._renderer2.setStyle(this.addIssueCategory.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.addIssueCategory.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  closeIssueCategoryModal() {
    this.IssueCategoryOpened = false;
    this._renderer2.setStyle(this.addIssueCategory.nativeElement, 'z-index', 9);
    this._renderer2.removeClass(this.addIssueCategory.nativeElement, 'show');
    this._renderer2.setStyle(this.addIssueCategory.nativeElement, 'display', 'none');
    this._cdr.detectChanges();
  }

  clearPopupObject() {
    this.popupObject.id = null;

  }

  deleteMaintenance(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectSettingsCategoryTimeService.deleteIssueCategory(this.popupObject.id).subscribe(
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

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal("hide");
    this._utilityService.detectChanges(this._cdr);
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = "";
    this.popupObject.id = id;
    this.popupObject.title = "Delete Issue Category?";
    this.popupObject.subtitle = "common_delete_subtitle";
    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    this.deleteEventSubscription.unsubscribe();
    this.addIssueCategoryEvent.unsubscribe();
  }
}
