import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BiaSettingsService } from 'src/app/core/services/settings/organization_settings/bia-settings/bia-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';
import { BiaScaleStore } from 'src/app/stores/bcm/configuration/bia-scale/bia-scale-store';
import { ImpactAreaStore } from 'src/app/stores/bcm/configuration/impact-area/impact-area-store';
import { ImpactScenarioStore } from 'src/app/stores/bcm/configuration/impact-scenario/impact-scenario-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BiaSettingStore } from 'src/app/stores/settings/bia-settings.store';

@Component({
  selector: 'app-bia-matrix-config',
  templateUrl: './bia-matrix-config.component.html',
  styleUrls: ['./bia-matrix-config.component.scss']
})
export class BiaMatrixConfigComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;

  BiaSettingStore = BiaSettingStore
  AppStore = AppStore;
  reactionDisposer:IReactionDisposer;

  constructor(
    private _renderer2: Renderer2,
    private _biaSettingService: BiaSettingsService
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      setTimeout(() => {
        // this.form.pristine;
      }, 250);
    });
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }

    ]);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this._biaSettingService.getItems().subscribe()
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: AppStore.previousUrl }]);
    window.addEventListener("scroll", this.scrollEvent, true);
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        // this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        // this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
    BiaRatingStore.unsetBiaRatingStoreDetails();
    BiaCategoryStore.unsetBiaCategoryDetails();
    ImpactScenarioStore.unsetImpactScenarioDetails();
    ImpactAreaStore.unsetImpactAreaDetails();
    BiaScaleStore.unsetBiaScaleDetails();
    BiaMatrixStore.unsettierConfig();
  }
}
