import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Router } from '@angular/router'
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { listStyleType, ProjectListDatum, SubProject } from 'src/app/core/models/project-management/projects/projects';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { ProjectManagementProjectsService } from 'src/app/core/services/project-management/projects/project-management-projects.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';

declare const $: any;
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @ViewChild('projectModal') projectModal: ProjectModalComponent;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  projectStore = ProjectsStore;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  isPinnedOpen = true;
  editData: ProjectListDatum | any;
  popupType
  searchText$ = new Subject();
  popupControlSubscription: any;
  constructor(
    private _helperService: HelperServiceService,
    private _projectManagementService: ProjectManagementProjectsService,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'PROJECT_LIST', submenuItem: { type: 'search' } },
        { activityName: 'PROJECT_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_PROJECT', submenuItem: { type: 'new_modal' } },
      ]
      this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewProjectModal();
            break;
          case "search":
            ProjectsStore.searchText = SubMenuItemStore.searchText;
            ProjectsStore.setCurrentPage(1);
            if(ProjectsStore.searchText) this.isPinnedOpen = false;
            this.searchText$.next(ProjectsStore.searchText)
            break;
          case "refresh":
            this.getItems();
            this.getPinnedProjects();
            // TestAndExerciseStore.unsetTreatmentList();
            // this.pageChange(1);
            break;
          case "grid":
            this.setListStyle('grid')
            break;
          case "table":
            this.setListStyle('table')
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.openNewProjectModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    });

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'New' });
    this.popupControlSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteItems(item);
    })

    this.initTypeAheadSearch();
    this.getItems(1);
    this.getPinnedProjects();
  }


  setListStyle(type: listStyleType) {
    ProjectsStore.listStyle = type;
  }

  goToProject(id){
    event.stopPropagation();
    event.preventDefault();
    this._router.navigateByUrl(`/project-management/projects/${id}`)
  }

  openNewProjectModal(item?: SubProject, project?: ProjectListDatum) {
    event.stopPropagation();
    event.preventDefault();
    if(item){
      this.editData = {
        title: item?.title,
        description: item?.description,
        customer_id: item?.customer_id,
        customer_title: item?.customer_title,
        start_date: item?.start_date,
        target_date: item?.target_date,
        project_category_id: item?.project_category_id,
        project_type_id: item?.project_type_id,
        project_status_language_title: item?.project_status_language_title,
        project_manager_id: item?.project_manager_id,
        project_manager_first_name: item?.project_manager_first_name,
        project_id: project?.id,
        project_name: project?.title,
        location_id: item?.location_id,
        image: {
          name: item?.image_title,
          url: item?.image_url,
          ext: item?.image_ext,
          thumbnail_url: item?.image_url,
          token: item?.image_token,
          size: item?.image_size
        }
      }
      this.editData.id = item?.id;
      this.popupType = 'EDIT';
    } else {
      this.editData = null;
      this.popupType = 'ADD'
    }
    this._cdr.detectChanges();
    this.projectModal.openProjectModal()
  }

  getItems(newPage: number = null) {
    if (newPage) ProjectsStore.setCurrentPage(newPage);
    this._projectManagementService.getItems(false, 'parent_id=1').subscribe(() => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getSubProject(index, id){
    ProjectsStore.currentSubProjectIndex = index;
    ProjectsStore.is_subproject_loading = true;    
    this._projectManagementService.getItem(id).subscribe(res=> {
      ProjectsStore.is_subproject_loading = false;
      this._cdr.detectChanges();
    });
  }

  initTypeAheadSearch() {
    this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(() => this._projectManagementService.getItems())
    ).subscribe();
  }


  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  deleteItems(status) {
    if (status && this.popupObject.id) {
      this._projectManagementService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    } else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  deleteConfirm(id: number) {
    event.stopPropagation();
    event.preventDefault();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  diffDays(date){
    date = new Date(date);
    let otherDate:any = new Date();
    return Math.ceil((date - otherDate) / (1000 * 60 * 60 * 24));
  } 

  toNumber(num){
    return Number(num)
  }

  getPinnedProjects(page?){
    this._projectManagementService.getPinnedProjects(page).subscribe((res)=> {
        this._utilityService.detectChanges(this._cdr);
    });
  }

  togglePinnedProject(id, type){
    event.preventDefault();
    event.stopPropagation();
    this._projectManagementService.togglePinnedProject(id, type).subscribe(()=> {
        this._utilityService.detectChanges(this._cdr);
        this.getPinnedProjects();
        this.getItems();
    });
  }

  togglePinnedItems(){
    this.isPinnedOpen = !this.isPinnedOpen;
  }



  ngOnDestroy() {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlSubscription.unsubscribe();
    this.searchText$.unsubscribe();
  }
}
