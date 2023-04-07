import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { TaskWeightage } from 'src/app/core/models/masters/project-management/project-task-weightage';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectTaskWeightageService } from 'src/app/core/services/masters/project-management/project-task-weightage/project-task-weightage.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { TaskWeightageMasterStore } from 'src/app/stores/masters/project-management/project-task-weightage-store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;
@Component({
  selector: 'app-project-task-weightage',
  templateUrl: './project-task-weightage.component.html',
  styleUrls: ['./project-task-weightage.component.scss']
})
export class ProjectTaskWeightageComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  TaskWeightageMasterStore = TaskWeightageMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_project_task_weightage_message';
  
  TaskWeightageObject = {
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

  TaskWeightageSubscriptionEvent: any = null;
  popupControlTaskWeightageEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

        constructor(private _TaskWeightageService: ProjectTaskWeightageService,
          private _cdr: ChangeDetectorRef,
          private _renderer2: Renderer2,
          private _helperService: HelperServiceService,
          private _eventEmitterService:EventEmitterService,
          private _utilityService: UtilityService) { }

        ngOnInit(): void {
         
            this.reactionDisposer = autorun(() => {
              var subMenuItems = [
                { activityName: 'TASK_WEIGHTAGE_LIST', submenuItem: { type: 'search' } },
                // { activityName: 'CREATE_TASK_WEIGHTAGE', submenuItem: { type: 'new_modal' } },
                // { activityName: 'GENERATE_TASK_WEIGHTAGE_TEMPLATE', submenuItem: { type: 'template' } },
                // { activityName: 'EXPORT_TASK_WEIGHTAGE', submenuItem: { type: 'export_to_excel' } },
                {activityName: 'SHARE_TASK_WEIGHTAGE', submenuItem: {type: 'share'}},
                // {activityName: 'IMPORT_TASK_WEIGHTAGE', submenuItem: {type: 'import'}},
                { activityName: null, submenuItem: { type: 'close', path: 'project-management' } },
              ]
              this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

          NoDataItemStore.setNoDataItems({title: "common_nodata_title"});

              if (SubMenuItemStore.clikedSubMenuItem) {
                switch (SubMenuItemStore.clikedSubMenuItem.type) {
                  case "new_modal":
                    setTimeout(() => {
                      this.addNewItem();
                    }, 1000);
                    break;
        
                  case "template":
                    this._TaskWeightageService.generateTemplate();
                    break;
        
                  case "export_to_excel":
                    this._TaskWeightageService.exportToExcel();
                    break;
        
                  case "search":
                    TaskWeightageMasterStore.searchText = SubMenuItemStore.searchText;
                    this.pageChange(1);
                    break;
                  case "share":
                    ShareItemStore.setTitle('share_project_task_category_title');
                    ShareItemStore.formErrors = {};
                    break;
                  case "import":
                    ImportItemStore.setTitle('import_project_task_category');
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
                this._TaskWeightageService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
                this._TaskWeightageService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
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
        
            this.popupControlTaskWeightageEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
              this.modalControl(item);
            })
            this.TaskWeightageSubscriptionEvent = this._eventEmitterService.projectTaskWeightage.subscribe(res => {
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
          this.TaskWeightageObject.type = 'Add';
          this.TaskWeightageObject.values = null; // for clearing the value
          this._utilityService.detectChanges(this._cdr);
          this.openFormModal();
        }
        pageChange(newPage: number = null) {
          if (newPage) TaskWeightageMasterStore.setCurrentPage(newPage);
          this._TaskWeightageService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
        }

        openFormModal() {
          setTimeout(() => {
            $(this.formModal.nativeElement).modal('show');
          }, 50);
        }

        closeFormModal() {
          $(this.formModal.nativeElement).modal('hide');
          this.TaskWeightageObject.type = null;
        }

        sortTitle(type: string) {
          this._TaskWeightageService.sortTaskCategryList(type);
          this.pageChange();
        }
      
        getTaskWeightageById(id: number) {
          this._TaskWeightageService.getItemById(id).subscribe(res => {
            this.loadPopup();
            this._utilityService.detectChanges(this._cdr);
          })
        }

        activate(id: number) {
          // event.stopPropagation();
          this.popupObject.type = 'Activate';
          this.popupObject.id = id;
          this.popupObject.title = 'Activate Task Category?';
          this.popupObject.subtitle = 'common_activate_subtitle';
      
          $(this.confirmationPopUp.nativeElement).modal('show');
        }

        deactivate(id: number) {
          // event.stopPropagation();
          this.popupObject.type = 'Deactivate';
          this.popupObject.id = id;
          this.popupObject.title = 'Deactivate Task Category?';
          this.popupObject.subtitle = 'common_deactivate_subtitle';
      
          $(this.confirmationPopUp.nativeElement).modal('show');
        }

        delete(id: number) {
          // event.stopPropagation();
          this.popupObject.type = '';
          this.popupObject.id = id;
          this.popupObject.title = 'Delete Task Category?';
          this.popupObject.subtitle = 'common_delete_subtitle';
      
          $(this.confirmationPopUp.nativeElement).modal('show');
        }

        modalControl(status: boolean) {
          switch (this.popupObject.type) {
            case '': this.deleteTaskWeightage(status)
              break;
      
            case 'Activate': this.activateTaskWeightage(status)
              break;
      
            case 'Deactivate': this.deactivateTaskWeightage(status)
              break;
      
          }
        }

        clearPopupObject() {
          this.popupObject.id = null;
          // this.popupObject.title = '';
          // this.popupObject.subtitle = '';
          // this.popupObject.type = ''; 
        }

      
  // delete function call
  deleteTaskWeightage(status: boolean) {
    if (status && this.popupObject.id) {
      this._TaskWeightageService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
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
        activateTaskWeightage(status: boolean) {
          if (status && this.popupObject.id) {
      
            this._TaskWeightageService.activate(this.popupObject.id).subscribe(resp => {
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

        deactivateTaskWeightage(status: boolean) {
          if (status && this.popupObject.id) {
      
            this._TaskWeightageService.deactivate(this.popupObject.id).subscribe(resp => {
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

        loadPopup()
        {
        const projectCategorySingle:TaskWeightage  = TaskWeightageMasterStore.individualTaskWeightageId;
              
              this.TaskWeightageObject.values = {
                id: projectCategorySingle.id,
                title: projectCategorySingle.title,
                description: projectCategorySingle.description,
                
              }
              this.TaskWeightageObject.type = 'Edit';
              this.openFormModal();
        }

    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      TaskWeightageMasterStore.searchText = '';
      TaskWeightageMasterStore.currentPage = 1 ;
      this.TaskWeightageSubscriptionEvent.unsubscribe();
      this.popupControlTaskWeightageEventSubscription.unsubscribe();
      this.idleTimeoutSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    }
  
}