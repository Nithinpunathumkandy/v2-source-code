import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmailNotificationSettingsService } from "src/app/core/services/settings/email-notification-settings/email-notification-settings.service";
import { EmailNotificationSettingsStore } from "src/app/stores/settings/email-notification-settings.store";
import { AuthStore } from "src/app/stores/auth.store";

@Component({
  selector: 'app-email-notification-settings',
  templateUrl: './email-notification-settings.component.html',
  styleUrls: ['./email-notification-settings.component.scss']
})
export class EmailNotificationSettingsComponent implements OnInit {

  EmailNotificationSettingsStore = EmailNotificationSettingsStore;
  AuthStore = AuthStore;
  activeIndex = null;
  constructor(private _emailNotificationService: EmailNotificationSettingsService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getEmailNotificationSettings();
  }

  getEmailNotificationSettings(){
    this._emailNotificationService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openAccordionList(i){
    if(this.activeIndex == i)
      this.activeIndex = null;
    else
      this.activeIndex = i;
  }

  turnOffEmailNotification(event){
    let subscription = null;
    if(event.target.checked)
      subscription = this._emailNotificationService.activateEmailNotification();
    else
      subscription = this._emailNotificationService.deactivateEmailNotification();
    subscription.subscribe(res=>{
      this.getEmailNotificationSettings();
      this._utilityService.detectChanges(this._cdr);
    },(error=>{
      EmailNotificationSettingsStore.emailNotificationSettings[0].is_enabled = !event.target.checked;
      this._utilityService.detectChanges(this._cdr);
    }))
  }

  notificationsChanged(event,notificationGroup){
    notificationGroup.is_enabled = event.target.checked;
    let notificationActivity = null;
    if(!event.target.checked)
      notificationActivity = this._emailNotificationService.deactivateNotification(notificationGroup.module_group_id);
    else
      notificationActivity = this._emailNotificationService.activateNotification(notificationGroup.module_group_id);
    notificationActivity.subscribe(res=>{
      this.getEmailNotificationSettings();
    },(error=>{
      notificationGroup.is_enabled = !event.target.checked;
    }));
  }

  subNotificationChange(event,notification,notificationGroup){
    // console.log(event);
    notification.is_enabled = event.target.checked;
    let moduleActivity = null;
    if(!event.target.checked)
      moduleActivity = this._emailNotificationService.deactivateSubNotification(notification.id);
    else
      moduleActivity = this._emailNotificationService.activateSubNotification(notification.id);
    moduleActivity.subscribe(res=>{
      this.getEmailNotificationSettings();
      this._utilityService.detectChanges(this._cdr);
    },(error=>{
      notification.is_enabled = !event.target.checked;
    }));
  }

}
