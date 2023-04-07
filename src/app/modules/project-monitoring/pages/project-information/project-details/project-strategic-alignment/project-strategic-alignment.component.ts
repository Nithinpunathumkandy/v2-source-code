import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
declare var $: any;

@Component({
  selector: 'app-project-strategic-alignment',
  templateUrl: './project-strategic-alignment.component.html',
  styleUrls: ['./project-strategic-alignment.component.scss']
})
export class ProjectStrategicAlignmentComponent implements OnInit {
  @ViewChild('newStrategyic', {static: true}) newStrategyic: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  objective = [{
    title : 'objective1',
    id: 1
  }]

  newStrategyicObject = {
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

  projectThemeObject = {
    component: 'Master',
    type: null,
    values: null
  }
  ProjectMonitoringStore = ProjectMonitoringStore;
  AppStore = AppStore;
  AuthStore = AuthStore
  reactionDisposer: IReactionDisposer;
  popupControlEventSubscription: any;
  selectedThemeId: any;
  selectedThemePos: any = 0;
  selectedObjectiveIndex: any = 0;
  popupControlStrategicEventSubscription: any;

  constructor(private _renderer2: Renderer2, private _router: Router,
    private _helperService: HelperServiceService, private _cdr: ChangeDetectorRef,  private _imageService:ImageServiceService,
    private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,private _projectService : ProjectMonitoringService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {    
      NoDataItemStore.setNoDataItems({title:"pm_theme_nodata_title", subtitle: 'pm_theme_nodata_subtitle',buttonText: 'pm_new_theme'});
  
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.openNewStrategicModal()
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
      if(NoDataItemStore.clikedNoDataItem){
        this.openNewStrategicModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    // SubMenuItemStore.setSubMenuItems([
    //   { type: "new_modal" },
    //   {type: "close", path: "../"}
    // ]);

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
       this.modalControl(item);
    })
    this.popupControlStrategicEventSubscription = this._eventEmitterService.strategicAlignmentModal.subscribe(item => {
      this.closeNewStrategic();
      this.getStrategicList()

    })
    this.getStrategicList()
  }

  openNewStrategicModal(){
    this.newStrategyicObject.type =  "Add"
    this.openNewStrategic();
    }
  

    getSubMenus() {
    
     if(ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='draft' || ProjectMonitoringStore.individualDetails?.project_monitoring_status?.type =='send-back') {
      var subMenuItems = [
        {activityName: 'CREATE_PROJECT_STRATEGIC_ALIGNMENT', submenuItem: {type: 'new_modal'}},
        {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }else {
      var subMenuItems = [
        {activityName: 'CREATE_PROJECT_EXTRNAL_USER', submenuItem: {type: ''}},
        {activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
    }
    this._utilityService.detectChanges(this._cdr);
  }
    
    openNewStrategic(){
      setTimeout(() => {
        $(this.newStrategyic.nativeElement).modal('show');
      }, 100);
      // this._renderer2.addClass(this.newStrategyic.nativeElement,'show');
      this._renderer2.setStyle(this.newStrategyic.nativeElement,'display','block');
      this._renderer2.setStyle(this.newStrategyic.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.newStrategyic.nativeElement,'z-index',99999);
    }
  
    closeNewStrategic(){
   
      setTimeout(() => {
        // $(this.newStrategyic.nativeElement).modal('hide');
        this.newStrategyicObject.type = null;
        this.newStrategyicObject.value = null;
        $(this.newStrategyic.nativeElement).modal('hide');
        this._renderer2.removeClass(this.newStrategyic.nativeElement,'show');
        this._renderer2.setStyle(this.newStrategyic.nativeElement,'display','none');
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      }, 200);
    }

    getStrategicList(){
      this._projectService.getStrategicAlignments().subscribe(res=>{
        this.getSubMenus()
        this._utilityService.detectChanges(this._cdr);
      })
    }

    selectTheme(pos,id){
      console.log("id",id)
      this.selectedThemeId = id
      this.selectedThemePos = pos;
      // ProjectMonitoringStore.setFocusAreaId(id)
      // this.getObjectives(this.selectedFocusAreaId);
      // this._utilityService.detectChanges(this._cdr);
    }

    selectObjectiveIndexChange(index,id){

      if(this.selectedObjectiveIndex == index){
        this.selectedObjectiveIndex = null;
      }else{
        this.selectedObjectiveIndex = index
      }
    }

    editStrategicAlignment(data){
      this.newStrategyicObject.type =  "Edit"
      this.newStrategyicObject.value = data;
      this.openNewStrategic();
    }

     // for delete
     delete(id: number) {
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'delete_strategy_subtitle';
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
    case 'are_you_sure': this.deleteProject(status)
      break;
  }

}

  // delete function call
  deleteProject(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectService.deleteStrategicAlignment(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.getStrategicList()
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
      this.popupControlEventSubscription.unsubscribe();
      this.popupControlStrategicEventSubscription.unsubscribe();


    }

}
