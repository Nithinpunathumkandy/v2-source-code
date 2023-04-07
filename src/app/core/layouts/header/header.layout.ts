import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppStore } from '../../../stores/app.store';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { AuthStore } from "src/app/stores/auth.store";
import { RightSidebarLayoutStore } from "src/app/stores/general/right-sidebar-layout.store";
import { IReactionDisposer, autorun } from 'mobx';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { UtilityService } from "src/app/shared/services/utility.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";
import { NotificationStore } from 'src/app/stores/notification/notification-store';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { RightSidebarFilterService } from '../../services/general/right-sidebar-filter/right-sidebar-filter.service';

declare var $: any;
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-header-layout',
    templateUrl: './header.layout.html',
    styleUrls: ['./header.layout.scss']
})
export class HeaderLayout {

    @ViewChild('scroll') scroll: any;
    AppStore = AppStore;
    AuthStore = AuthStore;
    UsersStore = UsersStore;
    reactionDisposer: IReactionDisposer;
    NotificationStore = NotificationStore;
    LanguageSettingsStore = LanguageSettingsStore;
    RightSidebarLayoutStore = RightSidebarLayoutStore;
    OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
    ThemeStructureSettingStore = ThemeStructureSettingStore;
    enableSideMenu:boolean = false;
    
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _humanCapitalService: HumanCapitalService,
        private _imageService: ImageServiceService,
        private _languageService: LanguageService,
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
        private _helperService: HelperServiceService,
        private _notificationService: NotificationService,
        private _eventEmitterService: EventEmitterService,
        private _rightSidebarFilterService: RightSidebarFilterService
    ) { 
        this._languageService.getAllItems().subscribe(res=>{
            let primaryLanguage: any = AuthStore.user?.language; 
            const htmlTag = document.getElementsByTagName("html")[0] as HTMLHtmlElement; 
            if(primaryLanguage.is_rtl) 
                htmlTag.dir = "rtl"; 
            else{ 
                htmlTag.dir = "ltr"; 
            } 
            this._utilityService.detectChanges(this._cdr);
        });
        setTimeout(() => {
            $(this.scroll.nativeElement).mCustomScrollbar();
        }, 250);
     }

     ngOnInit(): void {
        this.reactionDisposer = autorun(() => {
            this.fetchNotifications();
        });
         
     }

     fetchNotifications(isTimeout: boolean = false): void {
         if (AuthStore.user?.id) {
            this._notificationService.getItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
            this._notificationService.getCount().subscribe(() => this._utilityService.detectChanges(this._cdr));
            if(!isTimeout){
                setTimeout(() => {
                    this.fetchNotifications();
                }, 100000);
            }
         }

     }

    readAll(){  
        this._notificationService.markAsRead().subscribe(res=>{
            this.fetchNotifications();
            this._utilityService.showSuccessMessage('success','all_notifications_read');
        })
    }

    statusUpdate(row): void {
        if (row.read_at === null) {
            this._notificationService.updateStatus(row.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
        }
        if (row.data.redirect_url) {
            this._router.navigateByUrl(`${row.data.redirect_url}`);
        }
        this._notificationService.getItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
        this._notificationService.getCount().subscribe(() => this._utilityService.detectChanges(this._cdr));
        // this.fetchNotifications(true);
    }

    rightSidebarButtonClicked(event) {
        AppStore.openRightSidebar();
        this._rightSidebarFilterService.sendFilterEnableMessage(true);
    }

    headerClicked(event) {
        AppStore.closeRightSidebar();
    }

    translateText(key){
        return this._helperService.translateToUserLanguage(key);
    }

    logout() {
        // if (confirm('Are you sure, you want to logout?')) {
            this._authService.purgeAuth();
            RightSidebarLayoutStore.resetFilter();
            this._router.navigateByUrl('/login');
        // }
    }

    createImageUrl(token) {
        return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

    getDefaultImage(){
        return this._imageService.getDefaultImageUrl('user-logo');
    }

    createUserImageUrl(type) {
        return this._imageService.getDefaultImageUrl(type);
    }

    // setting pagination
	pageChange(newPage: number = null) {
		if (newPage) NotificationStore.setCurrentPage(newPage);
		this.fetchNotifications(true);
	}

    listNotification(): void {
        this._router.navigateByUrl(`my-account/profile/notification`);
    }

    getLanguageDetails(type: string){
        if(type == 'primary'){
            for(let i of LanguageSettingsStore.languages){
                if(i.id == AuthStore.user?.language?.id){
                    return i;
                }
            }
        }
        else{
            var languages = [];
            for(let i of LanguageSettingsStore.languages){
                if(i.id != AuthStore.user?.language?.id && i.status_id == AppStore.activeStatusId){
                    languages.push(i);
                }
            }
            return languages;
        }
    }

    checkCreatedUser(notification,type){
        if(type == 'name'){
            if(notification.hasOwnProperty('created_by') && typeof(notification.created_by) === 'object'){
                return `${notification.created_by.first_name} ${notification.created_by.last_name}`; 
            }
            else if(notification.hasOwnProperty('action_done_by') && typeof(notification.action_done_by) === 'object'){
                return `${notification.action_done_by.first_name} ${notification.action_done_by.last_name}`; 
            }
            else{
                return '';
            }
        }
        else if(type == 'token'){
            if(notification.hasOwnProperty('created_by') && typeof(notification.created_by) === 'object'){
                return notification.created_by.image_token; 
            }
            else if(notification.hasOwnProperty('action_done_by') && typeof(notification.action_done_by) === 'object'){
                return notification.action_done_by.image_token; 
            }
            else{
                return null;
            }
        }
        else{
            return ''
        }
    }

    getNonPrimaryLanguageCount():number{
        let count = 0;
        for(let i of LanguageSettingsStore.languages){
            if(i.id != AuthStore.user?.language?.id && i.status_id == AppStore.activeStatusId){
                count++;
            }
        }
        return count;
    }

    changeUserPrimaryLanguage(langId){
        this._languageService.setUserPrimaryLanguage(langId).subscribe(res=>{
            window.location.reload();
        })
    }

    getCharactersTrimmed(stringArray,characterLength,seperator){
        return this._helperService.getFormattedName(stringArray,characterLength,seperator);
      }

    roboHeadClicked(event) {
        AppStore.openChatBox();
    }

    sideMenuLayout(){
        this.enableSideMenu = this.enableSideMenu ? false:true;
    }

    getIcon(row) {
        let icon: any;
        if(row.hasOwnProperty('action_activity')){
            switch (row.action_activity.icon) {
                case "submit":
                  icon = 'submitted';
                  break;
                case "resubmit":
                  icon = 'resubmitted';
                  break;
                case "reject":
                  icon = 'reject';
                  break;
                case "update":
                  icon = 'update';
                  break;
                case "delete":
                  icon = 'delete';
                  break;
                case "Submited":
                icon = 'submitted';
                break;
                case "Resubmited":
                icon = 'resubmitted';
                break;
                case "Reverted":
                icon = 'revert';
                break;
                case "approve":
                icon = 'approve';
                break;
                case "Approved":
                icon = 'approve';
                break;
                case "requested":
                    icon = 'information-request';
                    break;
                case "Requested":
                    icon = 'information-request';
                    break;
                case "Responded":
                    icon = 'respond';
                    break;
                case "Division Reverted":
                    icon = 'division-reverted';
                    break;
                case 'closed':
                    icon = 'reject';
                case 'Closed':
                    icon = 'reject';
                case 'Audit Manager Reviewed':
                    icon = 'approve'
                default:
                break;
              }
            return icon;
        }
        else 
        {

          switch (row.data.icon) {
            case "submit":
                  icon = 'submitted';
                  break;
                case "resubmit":
                  icon = 'resubmitted';
                  break;
                case "reject":
                  icon = 'reject';
                  break;
                case "approve":
                  icon = 'approve';
                  break;
                case "create":
                  icon = 'create';
                  break;
                case "update":
                  icon = 'update';
                  break;
                case "delete":
                  icon = 'delete';
                  break;
                case "Submited":
                  icon = 'submitted';
                  break;
                case "Resubmited":
                  icon = 'resubmitted';
                  break;
                case "Reverted":
                  icon = 'revert';
                  break;
                case "approve":
                  icon = 'approve';
                  break;
                case "Approved":
                  icon = 'approve';
                  break;
                case "requested":
                  icon = 'information-request';
                  break;
                case "Requested":
                  icon = 'information-request';
                  break;
                case "Responded":
                  icon = 'respond';
                  break;
                case "Division Reverted":
                  icon = 'division-reverted';
                  break;
                case 'closed':
                  icon = 'reject';
                  break;
                case 'Closed':
                  icon = 'reject';
                  break;
                case 'Audit Manager Reviewed':
                  icon = 'approve';
                  break;
                case 'Submit':
                  icon='submitted'
                  break;
                case 'Publish':
                    icon='approve'
                    break;
                default:
                  icon=(row.data && row.data.icon) ? row.data.icon.toLowerCase() : ''
                  break;
          }
          return icon;

        }
        // return (row.data && row.data.icon) ? row.data.icon.toLowerCase() : '';
    }

    introButtonClicked(){
        this._eventEmitterService.introButtonClicked();
    }
}