import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectTasksService } from 'src/app/core/services/project-management/project-details/project-tasks/project-tasks.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectTasksStore } from 'src/app/stores/project-management/project-details/project-tasks/project-tasks';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $:any
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html'
})
export class TasksListComponent implements OnInit {

  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  ProjectTasksStore = ProjectTasksStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  projectTasksObject = {
    type:null,
    values: null,
    page: false,
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  modalEventSubscription:any;
  networkFailureSubscription:any;
  idleTimeoutSubscription: any;
  popupControlEventSubscription: any;

  constructor(
    private _projectTasksService: ProjectTasksService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _imageService:ImageServiceService,

  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof TasksListComponent
   */
  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_project_task'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'TASK_LIST', submenuItem: {type: 'search'}},
        {activityName: 'CREATE_TASK', submenuItem: {type: 'new_modal'}},
        {activityName: 'EXPORT_TASK', submenuItem: {type: 'export_to_excel'}},
        { activityName: null, submenuItem: { type: 'close', path: '../' } },

      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_TASK')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

    if (SubMenuItemStore.clikedSubMenuItem) {

      switch (SubMenuItemStore.clikedSubMenuItem.type) {
        case "new_modal":        
          this.addprojectTasks();
          break;
        case "search":
          ProjectTasksStore.searchText = SubMenuItemStore.searchText;
          this.pageChange(1);
          break;
          case "export_to_excel":
            this._projectTasksService.exportToExcel();
            break;
        default:
          break;
      }
      // Don't forget to unset clicked item immediately after using it
      SubMenuItemStore.unSetClickedSubMenuItem();
    }
    if(NoDataItemStore.clikedNoDataItem){
      this.addprojectTasks();
     NoDataItemStore.unSetClickedNoDataItem();
   }
 
  })

  this.modalEventSubscription = this._eventEmitterService.addProjectTaskModal.subscribe(res => {
    this.closeFormModal();
  });
  this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
  })

  this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
    if(!status){
      this.changeZIndex();
    }
  })
  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
    if(!status){
      this.changeZIndex();
    }
  })

    this.pageChange();
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  gotoDetailsPage(id){
    this._router.navigateByUrl('/project-management/tasks/' + id);
  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectTasksStore.setCurrentPage(newPage);
    this._projectTasksService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  addprojectTasks(){
    this.projectTasksObject.type = 'Add';
    this.projectTasksObject.values=null;
     this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
    }

  // for opening modal
  openFormModal() {
      $(this.formModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
  }

  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.projectTasksObject.type = null;
    this.pageChange();
  } 


  sortTitle(type: string) {
    this._projectTasksService.sortProjectClosureList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

    // for delete
    delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'delete_project_task';
      this.popupObject.subtitle = 'common_delete_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }
  
      // for popup object clearing
      clearPopupObject() {
        this.popupObject.id = null;
        this.popupObject.title = '';
        this.popupObject.subtitle = '';
        this.popupObject.type = '';
    
      }
  
     // modal control event
     modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case 'are_you_sure': this.deleteProjectTask(status)
          break;
      }
  
    }
  
    // delete function call
    deleteProjectTask(status: boolean) {
      if (status && this.popupObject.id) {
        this._projectTasksService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearPopupObject();
          this.pageChange(1);
        });
      }
      else {
        this.clearPopupObject();
      }
      setTimeout(() => {
        $(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
      this.pageChange();
    }


    editTasks(id) {
      event.stopPropagation();
      this._projectTasksService.getItem(id).subscribe(res => {
        if(res){
          this.projectTasksObject.values = res;
          this.projectTasksObject.type = 'Edit';
          this._utilityService.detectChanges(this._cdr);
          this.openFormModal();
        }
      })
    }


  

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof TasksListComponent
   */
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ProjectTasksStore.searchText = null;
    SubMenuItemStore.searchText = '';
    this.modalEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
  }

}
