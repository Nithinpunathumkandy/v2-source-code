import { observable, action, computed } from "mobx-angular";
import { AuditSettings } from "src/app/core/models/settings/audit-settings.model";

class Store {
    @observable
    private _auditSettingsItems: AuditSettings;

    @observable
    loaded: boolean = false;

    @action
    setAuditSettings(settings: AuditSettings) {
        this._auditSettingsItems = settings;
        this.loaded = true;
    }

    get auditSettingsItems(): AuditSettings { 
        return this._auditSettingsItems; 
    }
    
}
export const AuditSettingStore = new Store();