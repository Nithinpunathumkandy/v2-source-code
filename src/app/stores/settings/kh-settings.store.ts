import { action, observable } from "mobx";
import { KHSettings, REFSettings } from "src/app/core/models/settings/kh-settings.model";

class Store {
    @observable
    private _khSettingsItems: KHSettings;

    @observable
    private _refSettingsItems: REFSettings[]=[];


    preFix: string = ' '
    codeDivider: string = '/'
    companyCode: string = ' '

    referenceCodeArray = [
        {
          "type": "prefix",
          "title": "2022",
          "order": null,
          "is_enable": 0,
          "disabled": true,
        },
        {
          "type": "department",
          "title": "DEMO",
           "order": null,
          "is_enable": 0,
        },
        {
          "type": "document-type",
          "title": "PDF",
           "order": null,
          "is_enable": 0
        },
        {
          "type": "company-code",
          "title": "CHEM",
          "order": null,
          "is_enable": 0,
        },
        {
          "type": "document-category",
          "title": "STAR",
          "order": null,
          "is_enable": 0
        },
        {
          "type": "level",
          "title": "01",
          "order": null,
          "is_enable": 0
        },
        {
          "type": "year",
          "title": 2022,
          "order": null,
          "is_enable": 0
        },
        {
          "type": "code-divider",
          "title": "/",
          "is_enable": 1,
          "disabled": true,
        }
      ]

    @observable
    loaded: boolean = false;

    @action
    setKHSettings(settings: KHSettings) {
        this._khSettingsItems = settings;
        this.loaded = true;
    }

    @action
    setREFSettings(refsettings: any) {
        this._refSettingsItems = refsettings;
        this.loaded = true;
    }

    get khSettingsItems(): KHSettings { 
        return this._khSettingsItems; 
    }

    get refSettingsItems(): REFSettings[] { 
        return this._refSettingsItems; 
    }
    @action
    clearRefSetting(){
        this._refSettingsItems=[]
        this.companyCode=null;
        this.preFix=null;
        this.companyCode=null;
    }
}
export const KHSettingStore = new Store();