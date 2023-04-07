import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectMilestoneService } from 'src/app/core/services/project-monitoring/project-milestone.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-milestone-progress-update',
  templateUrl: './milestone-progress-update.component.html',
  styleUrls: ['./milestone-progress-update.component.scss']
})
export class MilestoneProgressUpdateComponent implements OnInit {
  @ViewChild('newProgress', {static: true}) newProgress: ElementRef;

  newProgressObject = {
    id : null,
    type : null,
    value : null
  }
  noDataSourceHistory = {
    noData: "No History", border: false
  }
  noDataSourceMilestone = {
    noData: "No Milestone", border: false
  }
  no_of_milestone : number = 0;
  ProjectMilestoneStore = ProjectMilestoneStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;

  projectProgressEventSubscrion: any;
  constructor(private _eventEmitterService: EventEmitterService,
              private _renderer2: Renderer2,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _helperService : HelperServiceService, 
              private _projectMilestoneService : ProjectMilestoneService,
              private _projectService : ProjectMonitoringService,
              private _imageService:ImageServiceService,
              ) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {    
      
      var subMenuItems = [
         {activityName:null, submenuItem: {type: 'close', path: '../'}}
      ]
     
      this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "new_modal":
          //    this.openNewProjectModal();
          //   break;
         
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      // if(NoDataItemStore.clikedNoDataItem){
      //    this.openNewProjectModal();
      //   NoDataItemStore.unSetClickedNoDataItem();
      // }
    });
    this.projectProgressEventSubscrion = this._eventEmitterService.projectMProgressModal.subscribe(item => {
      this.closeNewProgress()
      this.getHistory();    
      this.getMileStoneList()
    })

    // this.getIndividualProfileInformation(ProjectMonitoringStore.selectedProjectId)
    this.getMileStoneList();
     this.getHistory()
  }

  getMileStoneList(){
    this.no_of_milestone = 0;
    this._projectMilestoneService.getMilestons().subscribe(res=>{
      this.completedMilestone()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getHistory(){
    this._projectMilestoneService.getMilestonsHistory().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMileStoneProgress(){
    let milestone : any = 0
    if(ProjectMilestoneStore.milesstonesHistory.length > 0){
     milestone = ProjectMilestoneStore.milesstonesHistory[0].milestone_progress
    }
    return milestone
  }

  getIndividualProfileInformation(id){
    this._projectService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  completedMilestone(){
    if(ProjectMilestoneStore.milesstones.length> 0){
    for(let value of ProjectMilestoneStore.milesstones){
      if(value.completion == "100.00"){
        this.no_of_milestone = this.no_of_milestone + 1;
  
      }
    }
  }
  }

  completion(per){
    if(per){
      return Number(per)
    }
  }


   //passing token to get preview
   createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
    // milestone progress
    addNewMilestoneProgress(){
      this.newProgressObject.type = 'Add';
      this.openNewProgress();
    }
  
    openNewProgress(){
      this._renderer2.addClass(this.newProgress.nativeElement,'show');
      this._renderer2.setStyle(this.newProgress.nativeElement,'display','block');
      this._renderer2.setStyle(this.newProgress.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.newProgress.nativeElement,'z-index',99999);
    }
  
    closeNewProgress(){
   
      setTimeout(() => {
        // $(this.outComes.nativeElement).modal('hide');
        this.newProgressObject.type = null;
        this.newProgressObject.value = null;
        this._renderer2.removeClass(this.newProgress.nativeElement,'show');
        this._renderer2.setStyle(this.newProgress.nativeElement,'display','none');
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      }, 200);
    }

}
