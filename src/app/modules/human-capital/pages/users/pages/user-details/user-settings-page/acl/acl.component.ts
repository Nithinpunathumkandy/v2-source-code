import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserAclService } from 'src/app/core/services/human-capital/user/user-setting/user-acl/user-acl.service';
import { UserAclStore } from 'src/app/stores/human-capital/users/user-setting/user-acl.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

declare var $: any;
@Component({
  selector: 'app-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.scss']
})
export class AclComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UserAclStore = UserAclStore;
  UsersStore = UsersStore;
  groupIndex = null;
  moduleIndex = null;
  activityIndex = null;
  activity = [];
  moreActivity = [];
  AuthStore = AuthStore;
  moduleEnabled = false;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _userAclService: UserAclService,
    private _renderer2: Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _helperService:HelperServiceService) { }

  ngOnInit() {
    this._userAclService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  checkModuleEnabled(index) {
    let enabledCount= 0;
    for (let module of UserAclStore.aclDetails[index].modules) {
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

  checkActivityEnabled(activity, title) {
    for (let k of activity) {
      if (k.activity_type == title && k.is_enabled == true) {
        return true;
      }
    }
  }

  checkMoreActivityEnabled(activity, id) {
    let pos = activity.findIndex(e=>e.activity_id == id);
    if(pos!=-1){
      if(activity[pos].is_enabled == true)
      return true;
    }
    // for (let k of activity) {
    //   if (k.activity_id == id && k.is_enabled == true) {
    //     return true;
    //   }
    // }
  }
  checkActivityPresent(activity, title) {
    for (let k of activity) {
      if (k.activity_type == title) {
        return true;
      }
    }
  }
  changePermission(groupIndex, moduleIndex, activity_index, type) {
    if (UserAclStore.aclDetails[groupIndex]?.modules.length > 0) {
      for (let i of UserAclStore.aclDetails[groupIndex]?.modules[moduleIndex]?.activity_type_groups[activity_index]?.activities) {
        if (i.activity_type == type) {
          if (i.is_enabled) {
            i.is_enabled = false;
            UserAclStore.aclDetails[groupIndex].is_enabled = false;
            UserAclStore.aclDetails[groupIndex].modules[moduleIndex].is_enabled = false;
            this.moduleEnabled = false;

          }
          else {
            i.is_enabled = true;
            this.checkAllActivityEnabled(groupIndex, moduleIndex);
            
          }
        }
      }
    }
  }

  checkAllActivityEnabled(groupIndex, moduleIndex){
    let aclEnabledCount = 0
    for(let i of UserAclStore.aclDetails[groupIndex]?.modules[moduleIndex].activity_type_groups){
        for(let k of i.activities){
          if(!k.is_enabled){
            aclEnabledCount++;
            break;
          }

        }
      
    }
    if(aclEnabledCount==0){
      UserAclStore.aclDetails[groupIndex].modules[moduleIndex].is_enabled = true;
      
    }
    else{
      UserAclStore.aclDetails[groupIndex].modules[moduleIndex].is_enabled = false;
    }
    this.checkModuleEnabled(groupIndex);
  }

  enable(type, event?, index?, moduleIndex?: number) {
    if (type == 'module_group') {
      if (UserAclStore.aclDetails[index].hasOwnProperty('is_accordion_active') && UserAclStore.aclDetails[index]['is_accordion_active'] == true) {
        UserAclStore.aclDetails[index]['is_accordion_active'] = false;
      }
      else {

        UserAclStore.aclDetails[index]['is_accordion_active'] = true;
        this.checkModuleEnabled(index);
        this.disableOtherModules(index);
      }
    }
    else if (type == 'module') {
      if (!event.target.checked){
        UserAclStore.aclDetails[index].modules[moduleIndex].is_enabled = false;
        // this.moduleIndex = false;
        for (let i of UserAclStore.aclDetails[index].modules[moduleIndex].activity_type_groups) {
          for (let j of i.activities)
            j.is_enabled = false;
        }
      }
        
      else {
        UserAclStore.aclDetails[index].modules[moduleIndex].is_enabled = true;
        for (let i of UserAclStore.aclDetails[index].modules[moduleIndex].activity_type_groups) {
          for (let j of i.activities)
            j.is_enabled = true;
        }
      }
    }
    this.checkModuleEnabled(index);

  }

  enableAll(event,index) {
    if (event.target.checked) {
      // for (let i of UserAclStore.aclDetails[index]) {
        // i.is_enabled = true;
        for (let j of UserAclStore.aclDetails[index].modules) {
          j.is_enabled = true;
          for (let k of j.activity_type_groups) {
            for (let l of k.activities)
              l.is_enabled = true;
          }
        }
      // }
    }
    else{
      // for (let i of UserAclStore.aclDetails) {
        // i.is_enabled = false;
        for (let j of UserAclStore.aclDetails[index].modules) {
          j.is_enabled = false;
          for (let k of j.activity_type_groups) {
            for (let l of k.activities)
              l.is_enabled = false;
          }
        }
      // }

    }
  }

  disableOtherModules(index) {
    for (let i = 0; i < UserAclStore.aclDetails.length; i++) {
      if (i != index) {
        UserAclStore.aclDetails[i]['is_accordion_active'] = false;
      }
    }
  }

  openFormModal(groupIndex, moduleIndex, activity) {
    this.groupIndex = groupIndex;
    this.moduleIndex = moduleIndex;
    this.activity = activity;
    for(let i of UserAclStore.aclDetails[this.groupIndex].modules[this.moduleIndex].activity_type_groups){
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

  morePermissionChange(id,group,row, event) {
    // let enable = false;
    // let mCount = 0;
    // if (event.target.checked) {
    //   enable = true;
    // }
    // else
    //   enable = false;
    // for(let i of this.moreActivity){
    //   if(i.title==title){
    //     i.is_enabled = enable;
    //     mCount++;
    //   }
    // }
    // if(mCount==0)
    //   this.moreActivity.push({ activity_title: title, is_enabled: enable })
    if (event.target.checked) {
      this.moreActivity[group].activities[row].is_enabled=true;
    }
    else
    this.moreActivity[group].activities[row].is_enabled = false;
    // this.moreActivity.push({ activity_title: title, is_enabled: enable })
  
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    for (let i of UserAclStore.aclDetails[this.groupIndex].modules[this.moduleIndex].activity_type_groups) {
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
    this._utilityService.showSuccessMessage('success','save_successfully');
  }

  checkGroupEnabled(index) {
    for (let i of UserAclStore.aclDetails[this.groupIndex].modules[this.moduleIndex].activity_type_groups[index].activities) {
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

  submitData() {
    AppStore.enableLoading();
    let data = {
      activity_ids: []
    };
    for (let i of UserAclStore.aclDetails) {
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
      this._userAclService.saveItem(data).subscribe(res => {
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      })
    }, 300);
  }

  
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy(){
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
