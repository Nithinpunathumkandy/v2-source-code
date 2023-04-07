import { observable, action } from 'mobx-angular';

class Store {
    @observable
    labbels: any[] = [];

    @observable
    label: string;

    @action
    setLabels() {
        this.labbels = [{
            'audit_title': 'Audit Title',
            'audit_program': 'Audit Prgram',
            'cancel': "Cancelll"
        }];
    }

    @action
    setLabel() {
        this.label = "shihab";
    }
}

export const LabelStore = new Store();