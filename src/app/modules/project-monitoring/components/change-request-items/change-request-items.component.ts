import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectChangeRequestService } from 'src/app/core/services/project-monitoring/project-change-request/project-change-request.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-change-request-items',
  templateUrl: './change-request-items.component.html',
  styleUrls: ['./change-request-items.component.scss']
})
export class ChangeRequestItemsComponent implements OnInit {
  @Input('source') changeRequestSource: any;

  selectedItems: any = [];
  selectedId: any;
  ProjectMonitoringStore = ProjectMonitoringStore;
  AppStore = AppStore
  ProjectChangeRequestStore = ProjectChangeRequestStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  constructor(private _changeRequestService : ProjectChangeRequestService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _router: Router) { }

  ngOnInit(): void {
    if(this.changeRequestSource.type == "Edit"){
     this.setEditData()
    }
    this.getItems()
  }

  setEditData(){
    if(this.changeRequestSource){
      for(let data of this.changeRequestSource.value.change_request_items){
        this.selectedItems.push(data.id)
        ProjectChangeRequestStore.selectedTabs.push(data)
        this.checkSelectedStatus(data.id)
      }
    }
  }

  checkSelectedStatus(id: number) {
    var pos = null;
    pos = this.selectedItems.findIndex(e => e == id);
    if (pos != -1) return true;
    else return false;

  }

  getItems(){
    this._changeRequestService.getItem().subscribe(res=>{
      if(ProjectMonitoringStore.individualDetails?.project_type.is_budgeted == 0){
        let pos =  ProjectChangeRequestStore.changeRequestItmes.findIndex(e=> e.type =='budget')
        if(pos != -1){
         ProjectChangeRequestStore.changeRequestItmes.splice(pos,1)
        }
       }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  cancel(){
    this._eventEmitterService.dissmissProjectChangeRequestItemsModal()
    }

  changeFirstStepForm(){
    let obj = {
      change_request_item_ids : this.selectedItems
    }
    let save
    if(this.changeRequestSource.type == 'Edit'){
       save = this._changeRequestService.updateChangeRequestItems(obj,this.changeRequestSource.value.id)
    }else {
      save = this._changeRequestService.saveChangeRequestItems(obj)

    }
    save.subscribe(res=>{
      ProjectChangeRequestStore.selectedId = res.id
      this.selectedId = res.id
      this.cancel()
      if(this.changeRequestSource.type == 'Add'){
        this._router.navigateByUrl('/project-monitoring/projects/'+ProjectMonitoringStore.selectedProjectId+'/change-request/add');
      }else {
        this._router.navigateByUrl('/project-monitoring/projects/'+ProjectMonitoringStore.selectedProjectId+'/change-request/edit');
      }
      this._utilityService.detectChanges(this._cdr);
    })

  }

  checkBudgeted(){
   
    
  }

 

  

  changeItems(event,item){
    // if(event){
    //   this.selectedItems.push(item.id)
    //   ProjectChangeRequestStore.selectedTabs.push(item)
    // }else {
    //   let pos = this.selectedItems.findIndex(e=>e == item.id)
    //   if(pos != -1){
    //     this.selectedItems.splice(pos,1)
    //   }
    //   let kpos = ProjectChangeRequestStore.selectedTabs.findIndex(e=>e.id == item.id)
    //   if(kpos != -1){
    //     ProjectChangeRequestStore.selectedTabs.splice(kpos,1)
    //   }
    // }
   let pos = this.selectedItems.findIndex(e=>e == item.id)
   if(pos != -1){
    this.selectedItems.splice(pos,1)
   }else {
    this.selectedItems.push(item.id)
   }
   let kpos = ProjectChangeRequestStore.selectedTabs.findIndex(e=>e.id == item.id)
   if(kpos != -1){
    ProjectChangeRequestStore.selectedTabs.splice(kpos,1)
   }else {
    ProjectChangeRequestStore.selectedTabs.push(item)
   }
    this._utilityService.detectChanges(this._cdr);
  }

}
