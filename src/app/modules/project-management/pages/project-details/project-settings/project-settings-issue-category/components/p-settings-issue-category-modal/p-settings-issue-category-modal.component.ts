import { Component, OnInit, ChangeDetectorRef, Input,ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2, OnDestroy} from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectSettingsIssueCategoryStore } from 'src/app/stores/project-management/project-details/project-settings/project-settings-issue-category/project-settings-issue-category-store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { ProjectTaskCategoryService } from 'src/app/core/services/masters/project-management/project-task-category/project-task-category.service';
import { TaskCategoryMasterStore } from 'src/app/stores/masters/project-management/project-task-category-store';
import { ProjectSettingsIssueCategoryService } from 'src/app/core/services/project-management/project-details/project-settings/project-issue-category/project-settings-issue-category.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


declare var $: any;
@Component({
  selector: 'app-project-settings-issue-category-modal',
  templateUrl: './p-settings-issue-category-modal.component.html',
  styleUrls: ['./p-settings-issue-category-modal.component.scss']
})
export class ProjectSettingsIssueCategoryModalComponent implements OnInit, OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  //@ViewChild('controlIssueCategoryModal') controlIssueCategoryModal: ElementRef;

  @Input('source') issueCategoryData: any;

  AppStore = AppStore;
  ProjectsStore=ProjectsStore;
  ProjectSettingsIssueCategoryStore=ProjectSettingsIssueCategoryStore;
  TaskCategoryMasterStore = TaskCategoryMasterStore;
  
  serviceSubscriptionEvent: any = null;
  taskCategorySubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  selectedIssueCategory=[];
  selectAll = false;
  searchText=null;
  formErrors: any;

  taskCategoryObject = {
    component: 'Master',
    values: null,
    type: null
  };

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _projectSettingsIssueCategoryService: ProjectSettingsIssueCategoryService,
    private _taskCategoryService: ProjectTaskCategoryService,
    private _helperService: HelperServiceService
    ) { }

  ngOnInit(): void {
    this.selectedIssueCategory = JSON.parse(JSON.stringify(TaskCategoryMasterStore._selectedTaskCategoryAll));
    this.pageChange(1);
    if(ProjectSettingsIssueCategoryStore.allItems.length)
    {
      
      this.newAddIssueCategoryChecked();
    }
    else
    {
      
      this.selectedIssueCategory=[];
    }
    //this.newAddIssueCategoryChecked(res);
    this.serviceSubscriptionEvent = this._eventEmitterService.issueCategoryModal.subscribe(res=>{
      if(res){
        
        //this.newAddIssueCategoryChecked(res);
      }
      //this.closeFormModal();
      //console.log("hi");
    })

    this.taskCategorySubscriptionEvent = this._eventEmitterService.projectTaskCategory.subscribe(res => {
      this.closeMasterFormModal();
    })
  }
  pageChange(newPage: number = null) {
    if (newPage) TaskCategoryMasterStore.setCurrentPage(newPage);
    this._taskCategoryService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  sortTitle(type: string) {
    this._taskCategoryService.sortTaskCategryList(type);
    this.pageChange();
  }
  closeFormModal(){
    this.selectedIssueCategory = JSON.parse(JSON.stringify(TaskCategoryMasterStore._selectedTaskCategoryAll));
    this._eventEmitterService.dismissProjectIssueCategoryModal();
    this.searchText = null;
    this.searchInIssueCategoryList(this.searchText);
    
  }

  newAddIssueCategoryChecked(){
    //console.log(id);
    TaskCategoryMasterStore.setCurrentPage(1);
    this.selectedIssueCategory=ProjectSettingsIssueCategoryStore.allItems;
    //TaskCategoryMasterStore.searchText = SubMenuItemStore.searchText;
    // this._projectSettingsIssueCategoryService.getItems(false).subscribe(res => { 
         
    //   this.selectedIssueCategory.push(res.data);
    //   this._utilityService.detectChanges(this._cdr);
    // });
  }

  cancel() {
    this.closeFormModal();
  }
  getById(item)
  {
    //console.log(item)
    let data=[];
    for(let i of item)
    {
      data.push(i.id);
    }
    //console.log(data);
    return data;
  }

  save(close?) {
    AppStore.enableLoading();
    this._taskCategoryService.selectRequiredIssueCategory(this.selectedIssueCategory);
    this._projectSettingsIssueCategoryService.addIssueCategory(this.getById(this.selectedIssueCategory)).subscribe(res => { 
      this._utilityService.showSuccessMessage('IssueCategory', 'the_selected_objective_has_been_added_to_your_list');
      if (close) this.cancel();
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    }); 
  }

  searchInIssueCategoryList(e){
    if(e){
      this.searchText = e.target.value;
    }else{
      this.searchText=e;
    }
    TaskCategoryMasterStore.setCurrentPage(1);
    if (this.searchText) {
      this._taskCategoryService.getItems(false, `&q=${this.searchText}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      }); 
    } else{
      this.pageChange();
      this.loadIssueCategories();
    }
  }

  checkAll(e){
    if (e.target.checked) {
      this.selectAll = true;
      for(let i of TaskCategoryMasterStore.allItems){
        var pos = this.selectedIssueCategory.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedIssueCategory.push(i);}          
      }
    } else {
      this.selectAll = false;
      for(let i of TaskCategoryMasterStore.allItems){
        var pos = this.selectedIssueCategory.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedIssueCategory.splice(pos,1);}    
      }
    }
  }

  checkIssueCategoryPresent(criteria){
    // if(this.selectedIssueCategory.length==0)
    // {
    //   this.selectedIssueCategory = JSON.parse(JSON.stringify(TaskCategoryMasterStore._selectedTaskCategoryAll));
    // }
    var pos = this.selectedIssueCategory.findIndex(e => e.id == criteria.id);
    if (pos != -1)
      return true;
    else
      return false;
  
  }

  selectIssueCategory(criteria,splice:boolean = true){
    var pos = this.selectedIssueCategory.findIndex(e => e.id == criteria.id);
      if (pos != -1){
        if(splice) this.selectedIssueCategory.splice(pos, 1);
      }
      else
        this.selectedIssueCategory.push(criteria);
    }

    loadIssueCategories(newPage: number = null)
    {
      if (newPage) ProjectSettingsIssueCategoryStore.setCurrentPage(newPage);
      this._projectSettingsIssueCategoryService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100))
    }

    openMasterTaskCategory()
    {
          this.taskCategoryObject.type = 'Add';
          this.taskCategoryObject.values = null; // for clearing the value
          this._utilityService.detectChanges(this._cdr);
          this.openFormModal();
    }

    openFormModal() {
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 50);
    }

    closeMasterFormModal() {
      $(this.formModal.nativeElement).modal('hide');
      this.taskCategoryObject.type = null;
      this._cdr.detectChanges();
    }

    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }
  

  ngOnDestroy() {
    this.serviceSubscriptionEvent.unsubscribe();
    this.taskCategorySubscriptionEvent.unsubscribe();
    //this.idleTimeoutSubscription.unsubscribe();
  }

}
