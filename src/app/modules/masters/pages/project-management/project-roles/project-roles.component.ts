
import {  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ProjectRolesMasterStore } from 'src/app/stores/masters/project-management/project-roles';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ProjectRolesService } from 'src/app/core/services/masters/project-management/project-roles/project-roles.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectRoles } from 'src/app/core/models/masters/project-management/project-roles';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-project-roles',
  templateUrl: './project-roles.component.html',
  styleUrls: ['./project-roles.component.scss']
})
export class ProjectRolesComponent implements OnInit ,OnDestroy{
  
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  ProjectRolesMasterStore=ProjectRolesMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore=SubMenuItemStore;
  AuthStore=AuthStore;
  AppStore=AppStore;
  mailConfirmationData = 'share_project_role_message';

  popupControlProjectRolesSubscriptionEvent: any;
  projectRolesSubscriptionEvent:any=null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  projectRolesObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    id: null,
    type: '',
    title: '',
    subtitle: ''
  };
  
  constructor(private _projectRolesServes:ProjectRolesService,
    private _helperService: HelperServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(()=>{

      var subMenuItems = [
        {activityName: 'PROJECT_ROLE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_PROJECT_ROLE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_PROJECT_ROLE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_PROJECT_ROLE', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_PROJECT_ROLE', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_PROJECT_ROLE', submenuItem: {type: 'import'}},
        {activityName: null, submenuItem: {type: 'close', path: 'project-management'}},
      ]

      if(!AuthStore.getActivityPermission(1100,'CREATE_PROJECT_ROLE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }


      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_project_role'});

      if(SubMenuItemStore.clikedSubMenuItem){
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
              setTimeout(() => {
              this.addNewItem();
              }, 1000);
              break;
          case "template":
            this._projectRolesServes.generateTemplate();
              break;
          case "export_to_excel":
            this._projectRolesServes.exportToExcel();
              break;
          case "search":
            ProjectRolesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
              break;
          case "share":
            ShareItemStore.setTitle('share_project_role_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_project_role');
            ImportItemStore.setImportFlag(true);
            break;
          default:
              break;
        }
        
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ShareItemStore.shareData){
        this._projectRolesServes.shareData(ShareItemStore.shareData).subscribe(res=>{
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
        this._projectRolesServes.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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

    this.projectRolesSubscriptionEvent=this._eventEmitterService.porjectRolesControl.subscribe(res => {
      this.closeFormModal();
    })

    this.popupControlProjectRolesSubscriptionEvent = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
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
      this.projectRolesObject.type = 'Add';
      this.projectRolesObject.values = null; 
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
  }

  openFormModal(){
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);
  }

  closeFormModal(){
      $(this.formModal.nativeElement).modal('hide');
      this.projectRolesObject.type = null;
  }

  pageChange(newPage: number=null){
    if (newPage) ProjectRolesMasterStore.setCurrentPage(newPage);
      this._projectRolesServes.getItems(false,null,true).subscribe(()=> setTimeout(()=> this._utilityService.detectChanges(this._cdr),100));
  }
 
  getProjectRoles(id: number) //Edit Function
  { 
    const projectRolesSingle: ProjectRoles = ProjectRolesMasterStore.getProjectRolesById(id);
    
          this.projectRolesObject.values = {
              id: projectRolesSingle.id,
              title: projectRolesSingle.title,
              description: projectRolesSingle.description
          }
    this.projectRolesObject.type = 'Edit';
    this.openFormModal();  
  }
  
 
  // delete function call
  deleteProjectRoles(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectRolesServes.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && ProjectRolesMasterStore.getProjectRolesById(this.popupObject.id).status_id == AppStore.activeStatusId){
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
  
  activateProjectRoles(status: boolean) //Activate
  {
    if (status && this.popupObject.id) {

      this._projectRolesServes.activate(this.popupObject.id).subscribe(resp => {
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
  
  deactivateProjectRoles(status: boolean) //Deactivate
  {
    if (status && this.popupObject.id) {
      this._projectRolesServes.deactivate(this.popupObject.id).subscribe(resp => {
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
  
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  modalControl(status: boolean)
  {
    switch (this.popupObject.type) {
      case '': this.deleteProjectRoles(status)
        break;
      case 'Activate': this.activateProjectRoles(status)
        break;
      case 'Deactivate': this.deactivateProjectRoles(status)
        break;
    }
  }

  delete(id: number) //delete
  {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Project Roles?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
 
  activate(id: number)  // for activate 
  {
    // event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.type = 'Activate';
    this.popupObject.title = 'Activate Poject Roles?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
 
  deactivate(id: number)  // for deactivate
  {
    // event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.type = 'Deactivate';
    this.popupObject.title = 'Deactivate Project Roles?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  sortTitle(type: string) {

    this._projectRolesServes.sortProjectRoleslList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy(){

    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.projectRolesSubscriptionEvent.unsubscribe();
    this.popupControlProjectRolesSubscriptionEvent.unsubscribe();
    ProjectRolesMasterStore.searchText = '';
    ProjectRolesMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}

