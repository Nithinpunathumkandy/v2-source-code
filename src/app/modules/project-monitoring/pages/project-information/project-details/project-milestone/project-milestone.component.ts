import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectMilestoneService } from 'src/app/core/services/project-monitoring/project-milestone.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-project-milestone',
  templateUrl: './project-milestone.component.html',
  styleUrls: ['./project-milestone.component.scss']
})
export class ProjectMilestoneComponent implements OnInit {
  @ViewChild('newMilestone', {static: true}) newMilestone: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


   ProjectMonitoringStore = ProjectMonitoringStore;
  ProjectMilestoneStore = ProjectMilestoneStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore
  reactionDisposer: IReactionDisposer;

  newMilestoneObject = {
    id : null,
    type : null,
    value : null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  projectMileStoneEventSubscrion: any;
  popupControlEventSubscription: any;
  constructor(private _renderer2: Renderer2, private _router: Router,
    private _helperService: HelperServiceService, private _cdr: ChangeDetectorRef,  private _imageService:ImageServiceService,
    private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,private _projectMilestoneService : ProjectMilestoneService) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {    
      
      var subMenuItems = [
         {activityName:null, submenuItem: {type: 'close', path: '../'}}
      ]
      if(!AuthStore.getActivityPermission(3700,'CREATE_PROJECT_MILESTONE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(3700, subMenuItems);
      NoDataItemStore.setNoDataItems({title:"pm_milestone_nodata_title", subtitle: 'pm_milestone_nodata_subtitle',buttonText: 'pm_new_milestone'});

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
      if(NoDataItemStore.clikedNoDataItem){
         this.openNewProjectModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.projectMileStoneEventSubscrion = this._eventEmitterService.projectMileStoneModal.subscribe(item => {
      this.closeNewMilestone()
      this.getMileStoneList()
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.getMileStoneList()
  }

  getMileStoneList(){
    this._projectMilestoneService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  isEven(num){
    if(num % 2 == 0){
      return true

    }else {
      return false
    }
  }

  openNewProjectModal(){
  this.newMilestoneObject.type =  "Add"
  this.openNewMilestone();
  }

  
  openNewMilestone(){
    setTimeout(() => {
      $(this.newMilestone.nativeElement).modal('show');
    }, 100);
    // this._renderer2.addClass(this.newMilestone.nativeElement,'show');
    this._renderer2.setStyle(this.newMilestone.nativeElement,'display','block');
    this._renderer2.setStyle(this.newMilestone.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.newMilestone.nativeElement,'z-index',99999);
  }

  closeNewMilestone(){
 
    setTimeout(() => {
      // $(this.newMilestone.nativeElement).modal('hide');
      this.newMilestoneObject.type = null;
      this.newMilestoneObject.value = null;
      $(this.newMilestone.nativeElement).modal('hide');
      this._renderer2.removeClass(this.newMilestone.nativeElement,'show');
      this._renderer2.setStyle(this.newMilestone.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

 
  editMileStone(data){
    this._projectMilestoneService.getInduvalMilestons(data.id).subscribe(res=>{
      this.newMilestoneObject.type =  "Edit"
      this.newMilestoneObject.value = res
      this.openNewMilestone();
      this._utilityService.detectChanges(this._cdr);

    })

  }

        // for delete
        delete(id: number) {
          event.stopPropagation();
          this.popupObject.type = 'are_you_sure';
          this.popupObject.id = id;
          this.popupObject.title = 'are_you_sure';
          this.popupObject.subtitle = 'delete_milestone_subtitle';
          this._utilityService.detectChanges(this._cdr);
          $(this.confirmationPopUp.nativeElement).modal('show');
      
        }
  
            // for popup object clearing
      clearPopupObject() {
        this.popupObject.id = null;
      }
  
         // modal control event
     modalControl(status: boolean) {
      switch (this.popupObject.type) {
        case 'are_you_sure': this.deleteMilestone(status)
          break;
      }
  
    }

    mileStonCompletion(data){
      return Number(data);
    }
  
      // delete function call
      deleteMilestone(status: boolean) {
        if (status && this.popupObject.id) {
          this._projectMilestoneService.deleteMileston(this.popupObject.id).subscribe(resp => {
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            this.getMileStoneList()
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

      ngOnDestroy(){
        if (this.reactionDisposer) this.reactionDisposer();
        SubMenuItemStore.makeEmpty();
        this.projectMileStoneEventSubscrion.unsubscribe()
        this.popupControlEventSubscription.unsubscribe()
    
      }
}
