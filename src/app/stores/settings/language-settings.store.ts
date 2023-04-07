import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { LanguageSettings } from 'src/app/core/models/settings/language-settings';
import { AppStore } from "../app.store";

class Store {
    @observable
    private _languageSettings: LanguageSettings[] = [];

    @observable
    loaded: boolean = false;

    @action
    setLanguageSettings(languages: LanguageSettings[]) {
        this._languageSettings = languages;
        this.loaded = true;
    }

    @computed
    get primaryLanguage(): LanguageSettings {
        let primary: LanguageSettings = this.languages.find(e => e.is_primary);
        if (!primary && this.languages.length) primary = this.languages[0];
        return primary;
    }

    @computed
    get languages(): LanguageSettings[] {
        return this._languageSettings.slice();
    }

    get activeLanguages(): LanguageSettings[]{
        let activeItems:LanguageSettings[] = [];
        this.languages.forEach(e=>{
            if(e.status_id == AppStore.activeStatusId)
                activeItems.push(e);
        })
        return activeItems;
    }


}

export const LanguageSettingsStore = new Store();