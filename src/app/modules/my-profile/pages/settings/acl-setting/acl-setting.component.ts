import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AclService } from 'src/app/core/services/acl/acl.service';
import { AclProfilesettingService } from 'src/app/core/services/my-profile/settings/acl-settings/acl-profilesetting.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AclSettingStore } from 'src/app/stores/my-profile/settings/acl-setting.store';
declare var $: any;

@Component({
  selector: 'app-acl-setting',
  templateUrl: './acl-setting.component.html',
  styleUrls: ['./acl-setting.component.scss']
})
export class AclSettingComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  AclSettingStore = AclSettingStore;
  moduleEnabled = false;
  groupIndex = null;
  moduleIndex = null;
  activity = [];
  moreActivity = [];
  constructor(private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _renderer2: Renderer2,
              private _aclService:AclProfilesettingService) { }

  ngOnInit(): void {
    this._aclService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  enable(type, event?, index?, moduleIndex?: number) {
    if (type == 'module_group') {
      if (AclSettingStore.aclDetails[index].hasOwnProperty('is_accordion_active') && AclSettingStore.aclDetails[index]['is_accordion_active'] == true) {
        AclSettingStore.aclDetails[index]['is_accordion_active'] = false;
      }
      else {

        AclSettingStore.aclDetails[index]['is_accordion_active'] = true;
        this.checkModuleEnabled(index);
        this.disableOtherModules(index);
      }
    }
    else if (type == 'module') {
      if (!event.target.checked){
        AclSettingStore.aclDetails[index].modules[moduleIndex].is_enabled = false;
        for (let i of AclSettingStore.aclDetails[index].modules[moduleIndex].activity_type_groups) {
          for (let j of i.activities)
            j.is_enabled = false;
        }
      }
        
      else {
        AclSettingStore.aclDetails[index].modules[moduleIndex].is_enabled = true;
        for (let i of AclSettingStore.aclDetails[index].modules[moduleIndex].activity_type_groups) {
          for (let j of i.activities)
            j.is_enabled = true;
        }
      }
    }
    this.checkModuleEnabled(index);

  }

  checkModuleEnabled(index) {
    let enabledCount= 0;
    for (let module of AclSettingStore.aclDetails[index].modules) {
      if (!module.is_enabled) {
        enabledCount++;
        break;
      }
    }
    if(enabledCount==0){
      this.moduleEnabled = true
    }
    else
    this.moduleEnabled = false;
  }

  disableOtherModules(index) {
    for (let i = 0; i < AclSettingStore.aclDetails.length; i++) {
      if (i != index) {
        AclSettingStore.aclDetails[i]['is_accordion_active'] = false;
      }
    }
  }

  checkActivityEnabled(activity, title) {
    for (let k of activity) {
      if (k.activity_type == title && k.is_enabled == true) {
        return true;
      }
    }
  }

  checkActivityPresent(activity, title) {
    for (let k of activity) {
      if (k.activity_type == title) {
        return true;
      }
    }
  }

  openFormModal(groupIndex, moduleIndex, activity) {
    this.groupIndex = groupIndex;
    this.moduleIndex = moduleIndex;
    this.activity = activity;
    for(let i of AclSettingStore.aclDetails[this.groupIndex].modules[this.moduleIndex].activity_type_groups){
      this.moreActivity.push(i);
    }
    $(this.formModal.nativeElement).modal('show');
  }

  closeFormModal() {
    this.groupIndex = null;
    this.moduleIndex = null;
    this.activity = [];
    this.moreActivity = [];
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
  }

  morePermissionChange(title,group,row, event) {
    if (event.target.checked)
      this.moreActivity[group].activities[row].is_enabled=true;
    else
    this.moreActivity[group].activities[row].is_enabled = false;
  }

  checkMoreActivityEnabled(activity, title) {
    for (let k of activity) {
      if (k.activity_type == title && k.is_enabled == true) {
        return true;
      }
    }
  }

  checkGroupEnabled(index) {
    for (let i of AclSettingStore.aclDetails[this.groupIndex].modules[this.moduleIndex].activity_type_groups[index].activities) {
      if (i.is_enabled == false)
        return false
    }
    return true;
  }
}
