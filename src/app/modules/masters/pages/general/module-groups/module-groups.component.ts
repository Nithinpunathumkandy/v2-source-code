import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { OrganizationModulesService } from "src/app/core/services/settings/organization-modules/organization-modules.service";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationModules } from 'src/app/core/models/settings/organization-modules';
declare var $: any;

@Component({
  selector: 'app-module-groups',
  templateUrl: './module-groups.component.html',
  styleUrls: ['./module-groups.component.scss']
})
export class ModuleGroupsComponent implements OnInit {
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild ('formModulemenuModal',{static:true}) formModulemenuModal: ElementRef;

  AuthStore = AuthStore;
  OrganizationModulesStore = OrganizationModulesStore;
  reactionDisposer: IReactionDisposer;

  OrganizationSubmenuObject = {
    type:null,
    values: null
  }
  
  OrganizationModuleObject= {
    type:null,
    values: null
  }
  selectedModule = null;
  modalEventSubscription:any;
  moduleModalEventSubscription:any;

  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _organizationModulesService: OrganizationModulesService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close', path: 'masters'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.modalEventSubscription = this._eventEmitterService.moduleSubemnu.subscribe(res => {
      this.closeFormModal();
    });

    this.moduleModalEventSubscription = this._eventEmitterService.modulemenu.subscribe(res => {
      this.closeModuleFormModal();
    });
    
    this.pageChange();
  }

  pageChange(newPage?:number){
    this._organizationModulesService.getModulesSettings(null).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // for opening modal
  openFormModal() {
    $(this.formModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  setSelectedModule(index){
    if(this.selectedModule != index)
      this.selectedModule = index;
    else
      this.selectedModule = null;
  }

  // for close modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.OrganizationSubmenuObject.type = null;
    this.pageChange();
  } 

  // for opening modal
  openModuleFormModal() {
    $(this.formModulemenuModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // for close modal
  closeModuleFormModal() {
    $(this.formModulemenuModal.nativeElement).modal('hide');
    this.OrganizationModuleObject.type = null;
    this.pageChange();
  } 

  getModule(id) {
    event.stopPropagation();
    const moduleDetail = OrganizationModulesStore.getOrganizationModuleByid(id)
    this.OrganizationModuleObject.values = {
      id: moduleDetail.id,
      title: moduleDetail.title,
    };
    console.log(moduleDetail);
    this.OrganizationModuleObject.type = 'Edit';
    this._utilityService.detectChanges(this._cdr);
    this.openModuleFormModal();
  }

  getSubModule(id) {
    event.stopPropagation();
    const subMenuDetail = OrganizationModulesStore.getOrganizationSubmenuByid(id)
    this.OrganizationSubmenuObject.values = {
      id: subMenuDetail.module_id,
      title: subMenuDetail.title,
    };
        this.OrganizationSubmenuObject.type = 'Edit';
        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
    this.modalEventSubscription.unsubscribe();
    this.moduleModalEventSubscription.unsubscribe();
  }

}
