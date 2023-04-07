import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { LanguageService } from "src/app/core/services/settings/languages/language.service";
import { LanguageSettingsStore } from "src/app/stores/settings/language-settings.store";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  LanguageSettingsStore = LanguageSettingsStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;

  constructor(private _languageService: LanguageService, private _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // This will run whenever the store observable or computed which are used in this function changes.
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'GENERATE_LANGUAGE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_LANGUAGE', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'masters'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "template":
           this._languageService.generateTemplate();
            break;
          case "export_to_excel":
            this._languageService.exportToExcel();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.getLanguage();
  }

  getLanguage(){
    if(!LanguageSettingsStore.languages){
      this._languageService.getAllItems(true).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
  }

}
