import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;


@Component({
  selector: 'app-project-out-inscope',
  templateUrl: './project-out-inscope.component.html',
  styleUrls: ['./project-out-inscope.component.scss']
})
export class ProjectOutInscopeComponent implements OnInit {
  @ViewChild('newScope', {static: true}) newScope: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  ProjectMonitoringStore = ProjectMonitoringStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  reactionDisposer: IReactionDisposer;
  emptyMessage="no_data_found"

  newScopeObject = {
    id : null,
    type : null,
    scopeType : '',
    value : null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  projectScopeEventSubscrion: any;
  popupControlEventSubscription: any;


  constructor(private _renderer2: Renderer2, private _router: ActivatedRoute,private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,
    private _route: Router,private _helperService : HelperServiceService, private _projectService : ProjectMonitoringService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            //  this.editProjectInformation(ProjectMonitoringStore.selectedProjectId);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
    });
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: "../"}
    ]);

    this.projectScopeEventSubscrion = this._eventEmitterService.projectScopeModal.subscribe(item => {
      this.closeNewScope()
      this.getScopes()
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.getScopes();
  }

  openNewScopeModal(type){
    this.newScopeObject.type =  "Add"
    this.newScopeObject.scopeType =  type
    this.openNewScope();
    }
  
    
    openNewScope(){
      this._renderer2.addClass(this.newScope.nativeElement,'show');
      this._renderer2.setStyle(this.newScope.nativeElement,'display','block');
      this._renderer2.setStyle(this.newScope.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.newScope.nativeElement,'z-index',99999);
    }
  
    closeNewScope(){
   
      setTimeout(() => {
        // $(this.newScope.nativeElement).modal('hide');
        this.newScopeObject.type = null;
        this.newScopeObject.value = null;
        this._renderer2.removeClass(this.newScope.nativeElement,'show');
        this._renderer2.setStyle(this.newScope.nativeElement,'display','none');
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      }, 200);
    }

  getScopes(){
    this._projectService.getScopes().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  


  editScope(type,scope){
    this.newScopeObject.type =  "Edit"
    this.newScopeObject.scopeType =  type
    this.newScopeObject.value =  scope

    this.openNewScope()

  }

     // for delete
     delete(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'delete?';
      this.popupObject.subtitle = 'delete__outscope_subtitle';
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
    case '': this.deleteProject(status)
      break;
  }

}

  // delete function call
  deleteProject(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectService.deleteScope(this.popupObject.id,null).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.getScopes();
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

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  nodataCheck(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.type == 'out_scope'){
          nodata = false
        }
      }
    }   
    return nodata
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.projectScopeEventSubscrion.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();

  }

}
