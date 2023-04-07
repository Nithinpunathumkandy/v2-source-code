import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { AclStore } from 'src/app/stores/acl/acl.store';
import { AclService } from 'src/app/core/services/acl/acl.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
declare var $: any;
@Component({
  selector: 'app-role-activities',
  templateUrl: './role-activities.component.html',
  styleUrls: ['./role-activities.component.scss']
})
export class RoleActivitiesComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  roleId = null;
  passiveUser = null
  AclStore = AclStore;
  AuthStore = AuthStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  groupIndex = 0;
  moduleIndex = null;
  activity = [];
  moreActivity = [];
  AppStore = AppStore;
  groupData = [];
  selectedRole = null;
  moduleEnabled = false;
  constructor(private _aclService: AclService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    AppStore.disableLoading();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if (AclStore.selectedRoleId != null) {
      this.roleId = AclStore.selectedRoleId;
      this.getRoleActivities();
     
    }
   
    // const index: number = this.DesignationMasterStore.designations.findIndex(e => e.id == UsersStore.designation_id);
    // AuthStore.user.designation.is_super_admin
    this.passiveUser = AclStore.aclRoles.find(i => i.type == 'passive-user')
  }

  getRoleActivities() {
    if(this.roleId){
      AclStore.role_loaded = false;
      this._aclService.getRoleActivities(this.roleId).subscribe(res => {
        this.checkModuleEnabled(res)
        this._utilityService.detectChanges(this._cdr);
       
      })
    }
  }

  isPasiveUserLogin(){
    let isPassiveUser:boolean = false;
    const index: number = AuthStore.user.roles.findIndex(e => e.type=='passive-user');
      isPassiveUser = index != -1 ?  true : false;
    return isPassiveUser;
  }

  checkActivityEnabled(activity, title) {


    for (let k of activity) {
      if (k.activity_type_title == title && k.is_enabled == true) {

        return true;
      }

    }

  }

  checkMoreActivityEnabled(activity, id) {

    for (let k of activity) {
      if (k.activity_id == id && k.is_enabled == true) {

        return true;
      }
    }

  }

  checkActivityPresent(activity, title) {

    for (let k of activity) {
      if (k.activity_type_title == title) {

        return true;
      }

    }

  }


  changePermission(moduleIndex, activity_index, type) {

    for (let i of AclStore.roleActivities[this.groupIndex].modules[moduleIndex]?.activity_type_groups[activity_index]?.activities) {
      if (i.activity_type_title == type) {
        if (i.is_enabled) {
          i.is_enabled = false;
          AclStore.roleActivities[this.groupIndex].is_enabled = false;
          AclStore.roleActivities[this.groupIndex].modules[moduleIndex].is_enabled = false;
          this.moduleEnabled = false;
        }

        else {
          i.is_enabled = true;
          this.checkAllActivityEnabled(this.groupIndex, moduleIndex);

        }
      }


    }

  }

  checkAllActivityEnabled(groupIndex, moduleIndex){
    let aclEnabledCount = 0
    for(let i of AclStore.roleActivities[this.groupIndex]?.modules[moduleIndex].activity_type_groups){
        for(let k of i.activities){
          if(!k.is_enabled){
            aclEnabledCount++;
            break;
          }

        }
      
    }
    if(aclEnabledCount==0){
      AclStore.roleActivities[this.groupIndex].modules[moduleIndex].is_enabled = true;
      
    }
    else{
      AclStore.roleActivities[this.groupIndex].modules[moduleIndex].is_enabled = false;
    }
    this.checkModuleEnabled();
  }



  enable(type, event, moduleIndex?: number) {
    // if (type == 'module_group') {
    //   if (!event.target.checked) {
    //     AclStore.roleActivities[this.groupIndex].is_enabled = false;

    //   }
    //   else {
    //     AclStore.roleActivities[this.groupIndex].is_enabled = true;
    //     this.enableAll(event);
    //   }

    // }
    if (type == 'module_group') {
     
        this.checkModuleEnabled();
      
    }
    if (type == 'module') {

      if (!event.target.checked){
        AclStore.roleActivities[this.groupIndex].modules[moduleIndex].is_enabled = false;
        for (let i of AclStore.roleActivities[this.groupIndex].modules[moduleIndex].activity_type_groups) {
          for (let j of i.activities)
            j.is_enabled = false;
        }
      }
        
      else {
        AclStore.roleActivities[this.groupIndex].modules[moduleIndex].is_enabled = true;
        for (let i of AclStore.roleActivities[this.groupIndex].modules[moduleIndex].activity_type_groups) {
          for (let j of i.activities)
            j.is_enabled = true;
        }

      }
    }
    this.checkModuleEnabled();

  }

  checkModuleEnabled(data?) {
    let enabledCount= 0;
    if(AclStore.role_loaded){
      for (let module of AclStore.roleActivities[this.groupIndex].modules) {
        if (!module.is_enabled) {
          enabledCount++;
          break;
        }
      }
    }
    else{
      for (let module of data[this.groupIndex].modules) {
        if (!module.is_enabled) {
          enabledCount++;
          break;
        }
      }
    }
      if(enabledCount==0){
        this.moduleEnabled = true
      }
      else
      this.moduleEnabled = false;
  
   
   
  }

  enableAll(event) {
    if (event.target.checked) {
      // for (let i of AclStore.roleActivities) {
        // i.is_enabled = true;
        for (let j of AclStore.roleActivities[this.groupIndex].modules) {
          j.is_enabled = true;
          for (let k of j.activity_type_groups) {
            for (let l of k.activities)
              l.is_enabled = true;
          }
        }
      // }
    }
    else{
      for (let j of AclStore.roleActivities[this.groupIndex].modules) {
        j.is_enabled = false;
        for (let k of j.activity_type_groups) {
          for (let l of k.activities)
            l.is_enabled = false;
        }
      }
    }
  }

  openFormModal(moduleIndex, activity) {
    // const index: number = this.AclStore.aclRoles.findIndex(e => e.id == this.roleId);
    // this.selectedRole = this.AclStore.aclRoles[index].title;
    // this.groupIndex = index;
    // this.groupIndex = groupIndex;
    this.moduleIndex = moduleIndex;
    this.activity = activity;
    for(let i of AclStore.roleActivities[this.groupIndex].modules[this.moduleIndex].activity_type_groups){
      this.moreActivity.push(i);
    }
    AppStore.disableLoading();
    
    $(this.formModal.nativeElement).modal('show');
  }

  closeFormModal() {
    // this.groupIndex = null;
    this.moduleIndex = null;
    this.activity = [];
    this.moreActivity = [];
    $(this.formModal.nativeElement).modal('hide');
  }

  checkGroupEnabled(index) {
    for (let i of AclStore.roleActivities[this.groupIndex].modules[this.moduleIndex].activity_type_groups[index].activities) {
      if (i.is_enabled == false)
        return false
    }
    return true;
  }


  enableGroupActivity(index, event) {
    if (event.target.checked) {
      for (let i of this.moreActivity[index].activities) {
        i.is_enabled = true;
        // if (!i.is_enabled) {
          // this.moreActivity.push({ activity_title: i.activity_type, is_enabled: i.is_enabled });
        // }

      }
    }
    else{
      for (let i of this.moreActivity[index].activities) {
        i.is_enabled = false;
       
      }

    }
  }

  morePermissionChange(id,group,row, event) {
    // let enable = false;
    // console.log(this.moreActivity);
   
    if (event.target.checked) {
      this.moreActivity[group].activities[row].is_enabled=true;
    }
    else
    this.moreActivity[group].activities[row].is_enabled = false;
    // this.moreActivity.push({ activity_title: title, is_enabled: enable })
  }

  // setMoreActivity(){
  //   this.moreActivity['crud']=[];
  //   this.moreActivity['integration']=[];
  //   this.moreActivity['more'] = [];
  // }

  save(close: boolean = false) {
    AppStore.enableLoading();
    for (let i of AclStore.roleActivities[this.groupIndex].modules[this.moduleIndex].activity_type_groups) {
      for (let k of i.activities) {
        for (let j of this.moreActivity) {
          if (j.activity_id == k.activity_id) {
            if (j.is_enabled == true)
              k.is_enabled = true;
            else
              k.is_enabled = false;
          }
        }
      }
    }
    this.checkAllActivityEnabled(this.groupIndex,this.moduleIndex);
    AppStore.disableLoading();
    if (close)
      this.closeFormModal();
    this._utilityService.showSuccessMessage('success', 'Saved Successfully');
  }

  submitData() {
    AppStore.enableLoading();
    let data = {
      activity_ids: []
    };
    for (let i of AclStore.roleActivities) {
      for (let j of i.modules) {
        for (let k of j.activity_type_groups) {
          for (let l of k.activities) {
            if (l.is_enabled)
              data['activity_ids'].push(l.activity_id);
          }

        }

      }
    }

    setTimeout(() => {
      this._aclService.saveActivity(this.roleId, data).subscribe(res => {
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      },(error)=>{
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      })
    }, 300);
  }

  setModuleGroup(i) {

    // const index: number = this.AclStore.roleActivities.findIndex(e => e.module_group_id == group.module_group_id);
    this.groupIndex = i;
    this.enable('module-group','')
    // console.log(this.groupIndex);

  }

  getRoles() {
    this._aclService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchRole(e) {
    this._aclService.searchItem('?q=' + e).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }


}
