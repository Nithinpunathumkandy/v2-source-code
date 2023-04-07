import { Component, OnInit, ChangeDetectorRef, Input,ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2, OnDestroy} from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { ProjectSettingsCategoryTimeService } from 'src/app/core/services/project-management/project-details/project-settings/category-time/project-settings-category-time.service';
import { ProjectTimeCategoryService } from 'src/app/core/services/masters/project-management/project-time-category/project-time-category.service';
import { ProjectSettingsCategoryTimeStore } from 'src/app/stores/project-management/project-details/project-settings/category-time/pm-category-time.store';
import { ProjectTimeCategoryMasterStore } from 'src/app/stores/masters/project-management/project-time-category-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


declare var $: any;
@Component({
  selector: 'app-pm-settings-category-modal',
  templateUrl: './pm-settings-category-modal.component.html',
  styleUrls: ['./pm-settings-category-modal.component.scss']
})
export class PmSettingsCategoryModalComponent implements OnInit, OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  //@ViewChild('controlIssueCategoryModal') controlIssueCategoryModal: ElementRef;

  @Input('source') issueCategoryData: any;

  AppStore = AppStore;
  ProjectsStore=ProjectsStore;
  ProjectSettingsCategoryTimeStore=ProjectSettingsCategoryTimeStore;
  CategoryTimeMasterStore = ProjectTimeCategoryMasterStore;
  
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
    private _projectSettingsCategoryTimeService: ProjectSettingsCategoryTimeService,
    private _taskCategoryService: ProjectTimeCategoryService,
    private _helperService: HelperServiceService
    ) { }

  ngOnInit(): void {
    this.selectedIssueCategory = JSON.parse(JSON.stringify(ProjectTimeCategoryMasterStore._selectedTaskCategoryAll));
    this.pageChange(1);
    if(ProjectSettingsCategoryTimeStore.allItems.length)
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

    this.taskCategorySubscriptionEvent = this._eventEmitterService.projectTimeCategory.subscribe(res => {
      this.closeMasterFormModal();
    })
  }
  pageChange(newPage: number = null) {
    if (newPage) ProjectTimeCategoryMasterStore.setCurrentPage(newPage);
    this._taskCategoryService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  sortTitle(type: string) {
    this._taskCategoryService.sortTaskCategryList(type);
    this.pageChange();
  }
  closeFormModal(){
    this.selectedIssueCategory = JSON.parse(JSON.stringify(ProjectTimeCategoryMasterStore._selectedTaskCategoryAll));
    this._eventEmitterService.dismissProjectIssueCategoryModal();
    this.searchText = null;
    this.searchInIssueCategoryList(this.searchText);
    this._cdr.detectChanges();
    
  }

  newAddIssueCategoryChecked(){
    //console.log(id);
    ProjectTimeCategoryMasterStore.setCurrentPage(1);
    this.selectedIssueCategory=ProjectSettingsCategoryTimeStore.allItems;
    //ProjectTimeCategoryMasterStore.searchText = SubMenuItemStore.searchText;
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
    this._projectSettingsCategoryTimeService.addIssueCategory(this.getById(this.selectedIssueCategory)).subscribe(res => { 
      if (this.selectedIssueCategory.length > 0) this._utilityService.showSuccessMessage('IssueCategory', 'the_selected_objective_has_been_added_to_your_list');
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
    ProjectTimeCategoryMasterStore.setCurrentPage(1);
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
      for(let i of ProjectTimeCategoryMasterStore.allItems){
        var pos = this.selectedIssueCategory.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedIssueCategory.push(i);}          
      }
    } else {
      this.selectAll = false;
      for(let i of ProjectTimeCategoryMasterStore.allItems){
        var pos = this.selectedIssueCategory.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedIssueCategory.splice(pos,1);}    
      }
    }
  }

  checkIssueCategoryPresent(criteria){
    // if(this.selectedIssueCategory.length==0)
    // {
    //   this.selectedIssueCategory = JSON.parse(JSON.stringify(ProjectTimeCategoryMasterStore._selectedTaskCategoryAll));
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
      if (newPage) ProjectSettingsCategoryTimeStore.setCurrentPage(newPage);
      this._projectSettingsCategoryTimeService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100))
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
