import { observable, action, computed } from "mobx-angular";

class Store {

    @observable
    noDataItems: {title: string, subtitle?: string, buttonText?: string};

    @observable
    clikedNoDataItem: boolean = false;

    @action
    setNoDataItems(items: {title: string, subtitle?: string, buttonText?: string}) {
        this.noDataItems = items;
    }

    @action
    setClickedNoDataItem(item: boolean) {
        this.clikedNoDataItem = item;
    }

    @action
    unSetClickedNoDataItem() {
        this.clikedNoDataItem = null;
    }

    unsetNoDataItems(){
        this.noDataItems = null;
    }

    deleteObject(obj: string){
        if(this.noDataItems && this.noDataItems.hasOwnProperty(obj))
            delete this.noDataItems[obj];
    }


}

export const NoDataItemStore = new Store();