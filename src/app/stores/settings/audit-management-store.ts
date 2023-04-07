import { observable, action, computed } from "mobx-angular";
import { AuditManagementSettings } from "src/app/core/models/settings/audit-management-settings";

class Store {
    @observable
    private _auditManagementSettingsItems: AuditManagementSettings;

    @observable
    loaded: boolean = false;

    @action
    setAuditManagemntSettings(settings: AuditManagementSettings) {
        this._auditManagementSettingsItems = settings;
        this.loaded = true;
    }

    @action
    unsetAuditManagemntSettings() {
        this._auditManagementSettingsItems = null;
        this.loaded = false;
    }

    get auditMangementSettingsItems(): AuditManagementSettings { 
        return this._auditManagementSettingsItems; 
    }
    
}
export const AuditManagementSettingStore = new Store();