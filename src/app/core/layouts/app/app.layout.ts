import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Inject, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/settings/languages/language.service';
import { IReactionDisposer, autorun } from 'mobx';
import { LanguageSettings } from '../../models/settings/language-settings';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { DOCUMENT } from '@angular/common';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";
import { LabelMasterStore } from "src/app/stores/masters/general/label-store";

declare var $:any;
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-app-layout',
    templateUrl: './app.layout.html',
    styleUrls: ['./app.layout.scss']
})
export class AppLayout implements OnInit, OnDestroy {
    @ViewChild('noConnectionModal', { static: true }) noConnectionModal: ElementRef;
    @ViewChild('idleTimeoutModal', { static: true }) idleTimeoutModal: ElementRef;
    AppStore = AppStore;
    ShareItemStore = ShareItemStore;
    ImportItemStore = ImportItemStore;
    LabelStore = LabelMasterStore;
    OrganizationModulesStore = OrganizationModulesStore;
    OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
    OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
    reactionDisposer: IReactionDisposer;
    networkConnectionSubscription: any;
    idleTimeoutSubscription: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private _translateService: TranslateService,
        private _languageService: LanguageService,
        private _eventEmitterService: EventEmitterService
    ) { }

    ngOnInit() {
        this.reactionDisposer = autorun(() => {
            const defaultLanguage: LanguageSettings = LanguageSettingsStore.primaryLanguage;
            
            if (defaultLanguage && (defaultLanguage.code != this._translateService.currentLang)) {
                this._translateService.use(defaultLanguage.code.toLowerCase());

                // const html = this.document.getElementsByTagName('html')[0];
                // html.setAttribute('lang', defaultLanguage.code.toLowerCase());
                // if (defaultLanguage.is_rtl) html.setAttribute('dir', 'rtl');
                // else html.setAttribute('dir', 'ltr');
            }
        })
        //this._languageService.getAllItems().subscribe();
        this.networkConnectionSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
            if(!status)
                $(this.noConnectionModal.nativeElement).modal('show');
            else
                $(this.noConnectionModal.nativeElement).modal('hide');
        })
        this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
            if(!status)
                $(this.idleTimeoutModal.nativeElement).modal('hide');
            else
                $(this.idleTimeoutModal.nativeElement).modal('show');
        })
    }

    mainTagClicked(event) {
        AppStore.closeRightSidebar();
    }

    ngOnDestroy() {
        if (this.reactionDisposer) this.reactionDisposer();
    }

}