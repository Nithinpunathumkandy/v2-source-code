import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {UserEmailNotificationService} from 'src/app/core/services/human-capital/user/user-setting/user-email-notification/user-email-notification.service';
import {UserEmailNotificationStore} from 'src/app/stores/human-capital/users/user-setting/user-email-notification.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
@Component({
  selector: 'app-email-notification',
  templateUrl: './email-notification.component.html',
  styleUrls: ['./email-notification.component.scss']
})
export class EmailNotificationComponent implements OnInit {
  UserEmailNotificationStore = UserEmailNotificationStore;
  activeIndex = null;
  AuthStore = AuthStore;
  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _userEmailNotificationService:UserEmailNotificationService) { }

  ngOnInit() {
    NoDataItemStore.setNoDataItems({title: "email_nodata_title"});
    this._userEmailNotificationService.getEmailNotification().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      
    })
  }

  openAccordionList(i){
    if(this.activeIndex == i)
      this.activeIndex = null;
    else
      this.activeIndex = i;
  }

  AllEmailNotificationUpdate(event){
    if(event.target.checked)
      status='activate';
    else
      status='deactivate';
    this._userEmailNotificationService.updateAllEmailNotificationStatus(status).subscribe(res=>{
      
      this._utilityService.detectChanges(this._cdr);
    })
  }


  emailNotificationUpdate(id,event){
    if(event.target.checked)
      status='activate';
    else
      status='deactivate';
    this._userEmailNotificationService.moduleNotificationStatus(id,status).subscribe(res=>{

      this._utilityService.detectChanges(this._cdr);
    })
  }

  emailSubNotificationUpdate(id,event){
    if(event.target.checked)
      status='activate';
    else
      status='deactivate';
    this._userEmailNotificationService.emailNotificationStatus(id,status).subscribe(res=>{

      this._utilityService.detectChanges(this._cdr);
    })
  }

}
