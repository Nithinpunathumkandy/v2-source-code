import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from "src/app/stores/auth.store";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { NotificationStore } from 'src/app/stores/notification/notification-store';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { IReactionDisposer, autorun } from 'mobx';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

	AuthStore = AuthStore;
	NotificationStore = NotificationStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	reactionDisposer: IReactionDisposer;
	currentSelectedTab = 'all';
	constructor(
		private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
		private _router: Router,
        private _helperService: HelperServiceService,
		private _imageService: ImageServiceService,
		private _humanCapitalService: HumanCapitalService,
		private _notificationService: NotificationService
	) { }

	ngOnInit(): void {
		this._notificationService.unreadNotifications().subscribe(() => this._utilityService.detectChanges(this._cdr));
		this.fetchNotifications();
	}
	fetchNotifications(): void {
    if(AuthStore.user?.id){
      this._notificationService.getAllItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
      this._notificationService.getCount().subscribe(() => this._utilityService.detectChanges(this._cdr));
      // setTimeout(() => {
      //   this.fetchNotifications();
      // }, 100000);
    }
	}

	statusUpdate(row): void {
        if (row.read_at === null) {
            this._notificationService.updateStatus(row.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
        }
        if (row.data.redirect_url) {
            this._router.navigateByUrl(`${row.data.redirect_url}`);
        }
        this.fetchNotifications();
    }

	createImageUrl(token) {
        return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

    getDefaultImage(){
        return this._imageService.getDefaultImageUrl('user-logo');
    }

	// setting pagination
	pageChange(newPage: number = null) {
		if (newPage) NotificationStore.setCurrentPageAll(newPage);
		this._notificationService.getAllItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
		this._notificationService.getCount().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

	unreadPageChange(newPage: number = null) {
		if (newPage) NotificationStore.unreadSetCurrentPage(newPage);
		this._notificationService.unreadNotifications().subscribe(() => this._utilityService.detectChanges(this._cdr));
	}

  translateText(key){
    return this._helperService.translateToUserLanguage(key);
}

	getTab(tab): void {
		this.currentSelectedTab = tab;
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

        // else return (row.data && row.data.icon) ? row.data.icon.toLowerCase() : '';;
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
}
