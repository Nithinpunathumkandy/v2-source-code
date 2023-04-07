
import { observable, action, computed } from "mobx-angular";

import { AssetCriticality } from 'src/app/core/models/asset-management/asset-register/asset-criticality';


class Store {
    @observable
    private _assetCriticality: AssetCriticality = null;

    @observable 
    loaded:boolean=false;



    @observable
    editFlag: boolean = false;


    @action
    setAssetCriticality(response: AssetCriticality) {
        

        this._assetCriticality = response;
        this.loaded = true;
       
    }

  
    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }
    
    @computed
    get assetCriticality(): AssetCriticality {
        
        return this._assetCriticality;
    }

    unsetAssetCriticalityDetails() {
        

        this._assetCriticality = null;
      
        this.loaded = false;
       
    }


  
}

export const AssetCriticalityStore = new Store();

