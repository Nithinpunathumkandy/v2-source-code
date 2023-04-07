import { Component, OnInit } from '@angular/core';
import {UsersStore} from 'src/app/stores/human-capital/users/users.store';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IReactionDisposer,autorun } from 'mobx';
@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.scss']
})
export class UserSettingsPageComponent implements OnInit {
  UsersStore = UsersStore;
  AuthStore = AuthStore;
  reactionDisposer  :IReactionDisposer

  constructor(public _router: Router,
    private _helperService:HelperServiceService,
    ) { }

  ngOnInit() {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]

      this._helperService.checkSubMenuItemPermissions(200, subMenuItems);
    });
    // console.log(this._router.url)
  }


}
