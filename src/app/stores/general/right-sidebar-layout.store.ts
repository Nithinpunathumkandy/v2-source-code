import { observable, action, computed } from "mobx-angular";
import { UsersStore } from "../human-capital/users/users.store";

declare var $: any;

class Store {

    @observable
    private _filtersForCurrentPage: string[] = [];

    @observable
    showFilter: boolean = false;

    @observable
    filterPageTag: string = null;

    @observable
    filterSidebarEnabled:boolean=false

    @action
    setFiltersForCurrentPage(filters: string[]) {
        this._filtersForCurrentPage = filters;
    }

    @action
    resetFiltersForCurrentPage() {
        this._filtersForCurrentPage = [];
    }

    @action
    hasFilterForCurrentPage(filter: string) {
        const index = this._filtersForCurrentPage.findIndex(e => e == filter);

        if (index >= 0) return true;

        return false;
    }

    @computed
    get filtersForCurrentPage(): string[] {
        return this._filtersForCurrentPage.slice();
    }


    @observable
    private _filterItems: { [key: string]: any[] } = {};

    @observable
    private _filterValues: { [key: string]: any[] } = {};

    @action
    getSelectedFiltersFor(item: string): number[] {
        if (this._filterItems.hasOwnProperty(item)) return this._filterItems[item];
        return [];
    }

    @action
    getSelectedFilterValuesFor(item: string): number[] {
        if (this._filterValues.hasOwnProperty(item)) return this._filterValues[item];
        return [];
    }


    @action
    setFilterItem(item: string, value: any) {
        if (this._filterItems.hasOwnProperty(item)) {
            // if(item=='status'){
            //     if(value){
            //         this._filterValues[item]=[value];
                 
            //     }
                
            // }
           if(typeof(value) != 'string'){
                const index = this._filterItems[item].findIndex(e => e == value);
                if (index == -1) this._filterItems[item].push(value);
            }
            else this._filterItems[item] = [value];
        } else this._filterItems[item] = [value];
    }

    @action
    unsetFilterItem(item: string, value: any) {
        if (this._filterItems.hasOwnProperty(item)) {
            // if(item=='status'){
            //     this._filterValues[item].splice(0,this._filterValues[item].length)
            // }
            const index = this._filterItems[item].findIndex(e => e == value);
            if (index > -1) this._filterItems[item].splice(index, 1);
        }
    }

    @action
    setFilterValue(item: string, value: any){
        if (this._filterValues.hasOwnProperty(item)) {
            // if(item=='status'){
            //     if(value){
            //         this._filterValues[item]=[value];

            //     }
                
            // }
            if(typeof(value) != 'string'){
                const index = this._filterValues[item].findIndex(e => e.id == value.id);
                if (index == -1) this._filterValues[item].push(value);
            }
            else this._filterValues[item] = [value];
        } else this._filterValues[item] = [value];
    }

    @action
    unsetFilterValue(item: string, value: any){
        if (this._filterValues.hasOwnProperty(item)) {
            var index = null;
            // if(item=='status'){
            //     this._filterValues[item].splice(0,this._filterValues[item].length)
              
            // }
            if(typeof(this._filterValues[item][0]) != 'number'){
                index = this._filterValues[item].findIndex(e => e.id == value);
            }
            else{
                index = this._filterValues[item].findIndex(e => e == value);
            }
            if (index > -1) this._filterValues[item].splice(index, 1);
        }
    }

    unsetFilterItemValues(item){
        this._filterItems[item] = [];
        this._filterValues[item] = [];
    }

    @action
    resetFilter() {
        this._filterItems = {};
        this._filterValues = {};
    }

    get filterItemsValues(){
        var displayValues = {};
        if(this._filterValues && this.showFilter){
            for(let i of this._filtersForCurrentPage){
                if(this._filterValues.hasOwnProperty(i) && this._filterValues[i].length > 0){
                    for(let k of this._filterValues[i]){
                        if(k.hasOwnProperty('first_name')){
                            k['title'] = `${k['first_name']} ${k['last_name']}`;
                        }
                        else if(!k.hasOwnProperty('title')){
                            for (const property in k) {
                                if(property.indexOf('title') != -1){
                                    k['title']  = k[property];
                                    break;
                                }
                                else if(property.indexOf('status_language') != -1){
                                    k['title'] = k[property];
                                    break;
                                }
                            }
                        }
                    }
                    displayValues[i] = this._filterValues[i];
                }
            }
        }
        return displayValues;
    }

    @action
    isFilterSelected(item: string, value: any) {
        if (this._filterItems.hasOwnProperty(item)) {
            // if(item=='status'){
            //     if(this._filterItems['status']==value && UsersStore.selectedStatus==value){
            //         return true;
            //     }
            // }
            // else{
                const index = this._filterItems[item].findIndex(e => e == value);
                if (index > -1) return true;
            // }
           
             
            
          
        }
        return false;
    }

    @computed
    get filtersAsQueryString(): string {
        if(Object.keys(this._filterItems).length === 0){
            return '';
        }
        else{
            return this._filtersForCurrentPage.reduce((p, e) => {
                if (this._filterItems[e] && this._filterItems[e].length) {
                    p = p + (this._filterItems[e].length > 0 ? (((p == '') ? '' : '&') + ((e != 'month' && e != 'quarter') ? e : '') +((e != 'month' && e != 'quarter') ? '=' : '')+ ((e != 'month' && e != 'quarter') ? this._filterItems[e].toString() : '')) : '') + (p == '' ? '&'+this.processQuarterAndMonth() : (p.lastIndexOf('month') == -1 && this.processQuarterAndMonth() != '') ? '&'+this.processQuarterAndMonth() : '');
                    return p.endsWith('&') ? p.slice(0, -1) : p;
                } else{
                    return p.endsWith('&') ? p.slice(0, -1) : p;
                }
            }, '');
        }
    }

    processQuarterAndMonth(){
        let queryString = '';
        let quarterMonthString = '';
        if(this._filterValues.hasOwnProperty('quarter') && this._filterValues['quarter'].length > 0){
            queryString = 'month='
            for(let i of this._filterValues['quarter']){
                queryString += i.months.toString();
                quarterMonthString += i.months.toString();
            }
        }
        if(this._filterValues.hasOwnProperty('month') && this._filterValues['month'].length > 0){
            if(queryString == ''){
                queryString = 'month='
                for(let i of this._filterValues['month']){
                    queryString += (queryString == 'month=' ? i.id : ','+i.id);
                }
            }
            else{
                let quarterMonths = quarterMonthString.split(',');
                for(let i of this._filterItems['month']){
                    let pos = quarterMonths.findIndex(e => e == i);
                    if(pos == -1) queryString += (queryString == '' ? i : ','+i);
                }
            }
        }
        return queryString;
    }

    // @action
    // enableSidebarFilter()
    // {
    //     this.filterSidebarEnabled=true;
    // }

    // @action
    // disableSidebarFilter()
    // {
    //     this.filterSidebarEnabled=false;
    // }

    // @computed
    // get filtersAsQueryString(): string {
    //     console.log(this._filtersForCurrentPage);
    //     console.log(this._filterItems);
    //     return this._filtersForCurrentPage.reduce((p, e) => {
    //         if (this._filterItems[e] && this._filterItems[e].length) {
    //             return p + (this._filterItems[e].reduce((r, x) => {
    //                 return r + (((p == '') && (r == '')) ? '' : '&') + (e + '%5B%5D=' + x);
    //             }, ''));
    //         } else return p;
    //     }, '');
    // }

    // get filtersAsQueryString(): string {
    //     return this._filtersForCurrentPage.reduce((p, e) => {
    //         // p = this.processQuarterAndMonth();
    //         // e != 'month' && e != 'quarter' && 
    //         if (this._filterItems[e] && this._filterItems[e].length) {
    //             // p = this.processQuarterAndMonth();
    //             return p + (this._filterItems[e].length > 0 ? (((p == '') ? '' : '&') + ((e != 'month' && e != 'quarter') ? e : '') +((e != 'month' && e != 'quarter') ? '=' : '')+ ((e != 'month' && e != 'quarter') ? this._filterItems[e].toString() : '')) : '') + (p == '' ? '&'+this.processQuarterAndMonth() : (p.lastIndexOf('month') == -1 && this.processQuarterAndMonth() != '') ? '&'+this.processQuarterAndMonth() : '');
    //             // return p + (this._filterItems[e].length > 0 ? ((p == '') ? '' : '&') + e +'='+ this._filterItems[e].toString() : '');
    //             // ((e != 'month' && e != 'quarter') ? e : '')
    //             // (this._filterItems[e].reduce((r, x) => {
    //             //     console.log(r);
    //             //     console.log(x);
    //             //     return r + (((p == '') && (r == '')) ? '' : '&') + (e + '=' + x);
    //             // }, ''));
    //         } else{
    //             // p = this.processQuarterAndMonth();
    //             return p;
    //         }
    //     }, '');
    // }

}

export const RightSidebarLayoutStore = new Store();