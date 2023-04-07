import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { UtilityService } from "src/app/shared/services/utility.service";
import { OrganizationModulesService } from "src/app/core/services/settings/organization-modules/organization-modules.service";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { AuthStore } from "src/app/stores/auth.store";
import { OrganizationModuleGroup } from 'src/app/core/models/settings/organization-modules';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-organization-modules',
  templateUrl: './organization-modules.component.html',
  styleUrls: ['./organization-modules.component.scss']
})
export class OrganizationModulesComponent implements OnInit {

  OrganizationModulesStore = OrganizationModulesStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  formErrors: any;
  selectedModule = null;
  orderChanged: boolean = false;
  module;
  subModules;
  isMenu;
  constructor(private _organizationModulesService: OrganizationModulesService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    this._organizationModulesService.getModulesSettings(null).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }


	createPostData(){
		var postData = {
      module_id: this.subModules.module_id,
      module_group_id: this.module,
      is_menu: this.isMenu
		};
		return postData;
	  }

  starButton(modules,subModules, isMenu) {
    event.stopPropagation();
    this.module = modules.id;
    this.subModules = subModules;
    this.isMenu = isMenu;
      AppStore.enableLoading();
      this._organizationModulesService.updateStarMenu(this.createPostData()).subscribe((res: any) => {
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      }, (err: HttpErrorResponse) => {
        AppStore.disableLoading()
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        this._utilityService.detectChanges(this._cdr);
      });
  }

  moduleChange(event,moduleGroup){
    moduleGroup.isEnabled = event.target.checked;
    let moduleGroupActivity = null;
    if(!event.target.checked)
      moduleGroupActivity = this._organizationModulesService.deactivateModuleGroup(moduleGroup.id);
    else
      moduleGroupActivity = this._organizationModulesService.activateModuleGroup(moduleGroup.id);
    moduleGroupActivity.subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    },(error=>{
      moduleGroup.isEnabled = !event.target.checked;
    }));
  }

  submoduleChange(event,moduleGroup,module){
    console.log('module',moduleGroup,'sub',module)
    module.isEnabled = event.target.checked;
    let moduleActivity = null;
    if(!event.target.checked)
      moduleActivity = this._organizationModulesService.deactivateModule(module.module_id);
    else
      moduleActivity = this._organizationModulesService.activateModule(module.module_id);
    moduleActivity.subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    },(error=>{
      module.isEnabled = !event.target.checked;
    }));
  }

  drop(event: CdkDragDrop<OrganizationModuleGroup[]>) {
    this.orderChanged = true;
    moveItemInArray(this.OrganizationModulesStore.organizationModulesSettings, event.previousIndex, event.currentIndex);
  }

  dropModules(event:any,pos){
    moveItemInArray(this.OrganizationModulesStore.organizationModulesSettings[pos].modules, event.previousIndex, event.currentIndex);
    this.updateModulesOrder(this.OrganizationModulesStore.organizationModulesSettings[pos].id,this.OrganizationModulesStore.organizationModulesSettings[pos].modules)
  }

  setSelectedModule(index){
    if(this.selectedModule != index)
      this.selectedModule = index;
    else
      this.selectedModule = null;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  updateModuleGroupOrder(){
    AppStore.enableLoading();
    let items = this.processModuleGroupList();
    this._organizationModulesService.updateModuleGroupOrder(items).subscribe(res=>{
      AppStore.disableLoading();
      this.orderChanged = false;
      this._utilityService.detectChanges(this._cdr);
    },(error =>{
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
    )
  }

  updateModulesOrder(moduleId, modules){
    let items = this.processModuleList(modules);
    this._organizationModulesService.updateModuleOrder(items,moduleId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    },(error =>{
      this._utilityService.detectChanges(this._cdr);
    })
    )
  }

  sortModules(modules){
    return modules.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
  }

  processModuleList(modules){
    let returnArray = [];
    modules.forEach((item,index) =>{
      let orderItem = {order: index+1, module_id: item.module_id};
      returnArray.push(orderItem);
    })
    return { "module": returnArray };
  }

  processModuleGroupList(){
    let returnArray = [];
    this.OrganizationModulesStore.organizationModulesSettings.forEach((item,index) =>{
      let orderItem = {order: index+1, module_group_id: item.id};
      returnArray.push(orderItem);
    })
    return { "module_groups": returnArray };
  }

  checking(Id){
    const moduleId=[100, 200, 1200, 1100, 1300];
    return !moduleId.includes(Id);
  }

}
