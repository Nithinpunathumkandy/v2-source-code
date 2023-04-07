import { Component, OnInit , ChangeDetectorRef,Input } from '@angular/core';
import { BusinessProjectsService } from "src/app/core/services/organization/business_profile/business-projects/business-projects.service";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BusinessProjectsStore } from "src/app/stores/organization/business_profile/business-projects.store";
import { ProjectStatusStore } from "src/app/stores/general/project-status.store";
import { BusinessProjects, BusinessProjectsResponse, BusinessProjectDetails } from 'src/app/core/models/organization/business_profile/business-projects';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from "src/app/stores/app.store";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
@Component({
  selector: 'app-projects-modal',
  templateUrl: './projects-modal.component.html',
  styleUrls: ['./projects-modal.component.scss']
})
export class ProjectsModalComponent implements OnInit {
  @Input('removeselected') removeselected:boolean = false;
  @Input('projectsModalTitle')projectsModalTitle: any;
  @Input('title') title:boolean=false;
  
  BusinessProjectsStore = BusinessProjectsStore;
  ProjectStatusStore = ProjectStatusStore;
  selectedProject:BusinessProjects[]=[]
  searchText=null;
  AppStore = AppStore;
  emptyProjects="no_projects"

  constructor(
    private _businessProjectsService:BusinessProjectsService,
    private _utilityService:UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService:EventEmitterService,
    private _helperService:HelperServiceService
  ) { }

  ngOnInit(): void {
    this.selectedProject = JSON.parse(JSON.stringify(BusinessProjectsStore.selectedProjectList));
    this.pageChange(1);
  }

  projectSelected(projects){
    var pos = this.selectedProject.findIndex(e=>e.id == projects.id);
    if(pos != -1)
        this.selectedProject.splice(pos,1);
    else
        this.selectedProject.push(projects);
  }

   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  save(close: boolean = false){
    AppStore.enableLoading();
    BusinessProjectsStore.saveSelected=true;
    this._businessProjectsService.selectRequiredProject(this.selectedProject);
    AppStore.disableLoading();
    let title = this.projectsModalTitle?.component ? this.projectsModalTitle?.component:'item'
    if(this.selectedProject.length > 0) this._utilityService.showSuccessMessage('projects_selected','Selected projects are mapped with the ' +title + ' successfully!')
    if(close) this.cancel();
  }

  cancel(){
    if(BusinessProjectsStore.saveSelected){
      this._eventEmitterService.dismissProjectSelectModal();
    }
    else{
      this.selectedProject = [];
      BusinessProjectsStore.saveSelected=false
      this._eventEmitterService.dismissProjectSelectModal();
    }
     
  }

  clear(){
    this.searchText=''
    this.pageChange(1);
  }

  searchProject(e){
    let params='';
    if(this.removeselected){
      params='&exclude='+BusinessProjectsStore.selectedProjectList;
    }
    this._businessProjectsService.getItems(false, `q=${this.searchText}`+(params?params:'')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  pageChange(newPage: number = null) {
    // Get Projects
    let params='';
    if(this.removeselected){
      params='exclude='+BusinessProjectsStore.selectedProjectList;
    }
    if (newPage) BusinessProjectsStore.setCurrentPage(newPage);
    this._businessProjectsService.getItems(false,(params?params:'')).subscribe(res=>{
      setTimeout(() => {
        document.getElementById('selectall')['checked'] = false;
        this._utilityService.detectChanges(this._cdr);
      }, 100);

    })
    
    
  }

  selectAllProjects(e){
    // if(e.target.checked){
    //   this.selectedProject = BusinessProjectsStore.projectDetails;
    // }
    // else{
    //   this.selectedProject = [];
    // }

    if (e.target.checked) {
      for(let i of BusinessProjectsStore.projectDetails){
        var pos = this.selectedProject.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedProject.push(i);}          
      }
    } else {
      for(let i of BusinessProjectsStore.projectDetails){
        var pos = this.selectedProject.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedProject.splice(pos,1);}    
      }
    }
  }

  projectPresent(id){
    const index = this.selectedProject.findIndex(e => e.id == id);
     if (index > -1)
       return true;
     else
       return false;
  }

}
