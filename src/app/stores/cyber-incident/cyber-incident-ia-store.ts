
import { observable, action, computed } from "mobx-angular";

import { cyberIncidentIA } from 'src/app/core/models/cyber-incident/cyber-incident-ia-model';



class Store {
    @observable
    imapctAnalysis: cyberIncidentIA;

    @observable
    loaded:boolean=false;

    @action
    setIA(response: cyberIncidentIA) {
    
        this.imapctAnalysis = response;
        this.loaded = true;
    }
    @action
    unsetIA() {   
        this.imapctAnalysis = null;
        this.loaded = false;   
    }
}

export const CyberIncidentIAStore = new Store();

