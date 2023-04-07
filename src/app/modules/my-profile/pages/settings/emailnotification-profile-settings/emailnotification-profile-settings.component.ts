import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmailNotificationSettingsService } from 'src/app/core/services/my-profile/settings/email-notification-settings/email-notification-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { EmailNotificationProfileStore } from 'src/app/stores/my-profile/settings/emailnotification-profile.store';

@Component({
  selector: 'app-emailnotification-profile-settings',
  templateUrl: './emailnotification-profile-settings.component.html',
  styleUrls: ['./emailnotification-profile-settings.component.scss']
})
export class EmailnotificationProfileSettingsComponent implements OnInit {

  activeIndex = null;
  EmailNotificationProfileStore = EmailNotificationProfileStore;
  AuthStore = AuthStore;
  constructor(private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _emailNotificationService:EmailNotificationSettingsService) { }

  ngOnInit(): void {
    this.getEmailNotification();
  }

  getEmailNotification(){
    this._emailNotificationService.getEmailNotification().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  emailNotificationUpdate(id,event){
    if(event.target.checked)
      status='activate';
    else
      status='deactivate';
    this._emailNotificationService.moduleNotificationStatus(id,status).subscribe(res=>{
      this.getEmailNotification();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  AllEmailNotificationUpdate(event){
    if(event.target.checked)
      status='activate';
    else
      status='deactivate';
    this._emailNotificationService.updateAllEmailNotificationStatus(status).subscribe(res=>{
      this.getEmailNotification();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openAccordionList(i){
    if(this.activeIndex == i)
      this.activeIndex = null;
    else
      this.activeIndex = i;
  }

  emailSubNotificationUpdate(id,event){
    if(event.target.checked)
      status='activate';
    else
      status='deactivate';
    this._emailNotificationService.emailNotificationStatus(id,status).subscribe(res=>{

      this._utilityService.detectChanges(this._cdr);
    })
  }
}
