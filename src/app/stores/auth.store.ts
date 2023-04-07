import { observable, action, computed } from 'mobx-angular';
import { User } from '../core/models/user.model';
import { Acl, Module, Activity } from 'src/app/core/models/human-capital/users/user-setting';
import { TwoWayAuthentication, SsoAuth } from '../core/models/jwt-token.model';
import { ThemeLogin, ThemeLoginImages } from '../core/models/settings/settings-theme-login';
import { ThemeLoginSettingStore } from './settings/theme/theme-login.store';
import { toJS } from 'mobx';
class Store {
    @observable
    user: User;

    @observable
    redirectUrl: string = null;

    @observable
    userPermissions:any[] = [];

    @observable
    twoFactorAuthenticationDetails: TwoWayAuthentication | SsoAuth;

    @observable
    authenticationProgress: number = 0;

    @observable
    userId: number;

    @observable
    userPermissionsLoaded: boolean = false;
    
    @computed
    get isAuthenticated() {
        return !!this.user;
    }

    @action
    setUser(user: User) {
        this.user = user;
    }

    @action
    setRedirectUrl(url: string) {
        this.redirectUrl = url;
    }

    @action
    setTwoFactorAuthenticationDetails(details: TwoWayAuthentication | SsoAuth){
        this.twoFactorAuthenticationDetails = details;
    }

    get twoFactorAuthDetails(): TwoWayAuthentication|SsoAuth{
        return this.twoFactorAuthenticationDetails
    }

    @action
    setUserPermissions(permissions: any[]){
        this.userPermissions = permissions;
        this.userPermissionsLoaded = true;
    }

    @action
    setUserId(id: number){
        this.userId = id;
    }

    @action
    getUserId(){
        return  this.userId;
    }

    // getPermissableModules(moduleGroupId: number): Module[]{
    //     var modules: Acl = this.userPermissions.find(e => e.module_group_id == moduleGroupId);
    //     if(modules && modules.hasOwnProperty('modules')){
    //         var items = modules.modules.reduce((p,c)=>{
    //             if(c.is_enabled)
    //                 p.push(c);
    //             return p;
    //         },[]);
    //         return items;
    //     }
    //     else
    //         return [];
    // }

    // getModuleActivities(moduleGroupId: number, moduleId: number): Activity[]{
    //     var modules: Acl = this.userPermissions.find(e => e.module_group_id == moduleGroupId);
    //     if(modules && modules.hasOwnProperty('modules')){
    //         var activities = modules.modules.reduce((p,c)=>{
    //             if(c.module_id == moduleId)
    //                 p = c.activities;
    //             return p;
    //         },[]);
    //         return activities;
    //     }
    //     else return [];
    // }

    // getActivityPermission(moduleGroupId: number, moduleId: number, activityId: number):boolean{
    //     var activities = this.getModuleActivities(moduleGroupId,moduleId);
    //     var returnValue: boolean = false;
    //     if(activities){
    //         var activityItem = activities.find(e=>e.activity_id == activityId);
    //         returnValue = activityItem ? activityItem.is_enabled : false;
    //     }
    //     return returnValue;
    // }

    getActivityPermission(moduleGroupId: number, activityName: string):boolean{
        var returnValue: boolean;
        // if(this.userPermissions.length > 0 && this.userPermissions[0].hasOwnProperty(moduleGroupId)){
            // var pos = this.userPermissions[0][moduleGroupId].indexOf(activityName);
            var pos = this.userPermissions.indexOf(activityName);
            if(pos != -1)
                returnValue = true;
            else
                returnValue = false;
        // }
        // else{
        //     returnValue = false;
        // }
        return returnValue;
    }


    isRoleChecking(role:string){
        if(toJS(AuthStore?.user?.roles)){
            return toJS(AuthStore?.user?.roles)?.find(element=>element?.type==role)
        }
    }

    
}

export const AuthStore = new Store();