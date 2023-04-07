import { observable, action } from "mobx-angular";
import { IntegrationPaginationResponse, Integration} from 'src/app/core/models/settings/integration-model';

class Store {
    @observable
    integration: Integration[] = [];

    @observable 
    loaded:boolean=false; 

    @action
    setIntegration(response: IntegrationPaginationResponse) {
        this.integration = response.data;  
        this.loaded = true;
    }
}

export const IntegrationStore = new Store();