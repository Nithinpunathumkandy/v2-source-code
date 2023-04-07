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
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
declare var $: any;

@Component({
  selector: 'app-project-scope-of-work',
  templateUrl: './project-scope-of-work.component.html',
  styleUrls: ['./project-scope-of-work.component.scss']
})
export class ProjectScopeOfWorkComponent implements OnInit {
  @ViewChild('newScope', {static: true}) newScope: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  ProjectMonitoringStore = ProjectMonitoringStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore
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

  selectedSection = 'in_scope';
  projectScopeEventSubscrion: any;
  popupControlEventSubscription: any;

  constructor(private _renderer2: Renderer2, private _router: ActivatedRoute,private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,
    private _route: Router,private _helperService : HelperServiceService, private _projectService : ProjectMonitoringService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.gotoSection(this.selectedSection);
    this.reactionDisposer = autorun(() => {  

      if(NoDataItemStore.clikedNoDataItem){
        this.openSelectPopup();   
        NoDataItemStore.unSetClickedNoDataItem();
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
      setTimeout(() => {
        $(this.newScope.nativeElement).modal('show');
      }, 100);
      // this._renderer2.addClass(this.newScope.nativeElement,'show');
      this._renderer2.setStyle(this.newScope.nativeElement,'display','block');
      this._renderer2.setStyle(this.newScope.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.newScope.nativeElement,'z-index',99999);
    }
  
    closeNewScope(){
   
      setTimeout(() => {
        // $(this.newScope.nativeElement).modal('hide');
        this.newScopeObject.type = null;
        this.newScopeObject.value = null;
        $(this.newScope.nativeElement).modal('hide');
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
     deleteIn(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'delete_inscope_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

     // for delete
     deleteOut(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'delete_outscope_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
  
    }

     // for delete
     deleteAssump(id: number) {
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = id;
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = 'delete_assumption_subtitle';
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
    case 'are_you_sure': this.deleteInscope(status)
      break;
    case 'are_you_sure': this.deleteOutscope(status)
      break;
    case 'are_you_sure': this.deleteAssumption(status)
      break;     
  }

}
gotoSection(type) {
  this.selectedSection = type;
  switch (type) {
    case 'in_scope':
      NoDataItemStore.setNoDataItems({ title: "Looks like Project is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_in_scope" });
      break;
    case 'out_scope':
      
        NoDataItemStore.setNoDataItems({ title: "Looks like Project is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_out_scope" });

      break;
    case 'assumption':
      NoDataItemStore.setNoDataItems({ title: "Looks like Project is not mapped with any item here", subtitle: "common_nodata_subtitle", buttonText: "choose_assumption" });
      break;
    
  } 
  

}
openSelectPopup() {
  switch (this.selectedSection) {
    case 'in_scope': this.openNewScopeModal(this.selectedSection); break;
    case 'out_scope': this.openNewScopeModal(this.selectedSection); break;
    case 'assumption': this.openNewScopeModal(this.selectedSection); break;
  }
}

  // delete function call
  deleteInscope(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectService.deleteScope(this.popupObject.id,this.selectedSection).subscribe(resp => {
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

  // delete function call
  deleteOutscope(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectService.deleteScope(this.popupObject.id,this.selectedSection).subscribe(resp => {
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

  // delete function call
  deleteAssumption(status: boolean) {
    if (status && this.popupObject.id) {
      this._projectService.deleteScope(this.popupObject.id,this.selectedSection).subscribe(resp => {
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

  nodataCheck(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.type == 'in_scope'){
          nodata = false
        }else{
          NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "Add In Scope" });

        }
      }
    }   
    return nodata
  }
  nodataCheckOutScope(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.type == 'out_scope'){
          nodata = false
        }else{
          NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "Add Out Scope" });

        }
      }
    }   
    return nodata
  }
  nodataCheckAssumption(inScope){
    let nodata = true;
    if(inScope){
      for(let data of inScope){
        if(data.type == 'assumption'){
          nodata = false
        }else{
          NoDataItemStore.setNoDataItems({ title: "common_no_data_incident_mapping", subtitle: "common_nodata_subtitle", buttonText: "Add Assumption" });

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
