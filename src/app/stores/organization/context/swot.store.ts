import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { AnalysisPaginationResponse, AnalysisList } from "src/app/core/models/organization/context/swot";
import { IssueCategory } from 'src/app/core/models/organization/context/issue-list';

class Store {

    @observable
    private _strengthsList: AnalysisList;

    @observable
    strength_loaded: boolean = false;

    @observable
    private _weaknesList: AnalysisList;

    @observable
    weakness_loaded: boolean = false;

    @observable
    private _opportunitiesList: AnalysisList;

    @observable
    opportunity_loaded: boolean = false;

    @observable
    private _threatsList: AnalysisList;

    @observable
    threat_loaded: boolean = false;

    @observable
    private _swotCategoryList: IssueCategory[] = [];

    @observable
    swotCategoryLoaded: boolean = false;

    @action // Set SWOT Categories
    setSwotCategories(categoryList: IssueCategory[]){
        this._swotCategoryList = categoryList;
        this.swotCategoryLoaded = true;
    }

    @action // Initialize all Data Variables
    setInitialData(){
        this._threatsList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };
        this._opportunitiesList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };;
        this._strengthsList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };;
        this._weaknesList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };;
    }

    @action // Set SWOT List according to type
    setSwotList(type,id,response: AnalysisPaginationResponse){
        try{
            switch(type.toLowerCase()){
                case 'threat': this._threatsList.id = id;
                                this._threatsList.title = type;
                                this._threatsList.data = response.data;
                                this._threatsList.current_page = response.current_page;
                                this._threatsList.total = response.total;
                                this._threatsList.per_page = response.per_page;
                                this.threat_loaded = true;
                                break;
                case 'weakness': this._weaknesList.id = id;
                                this._weaknesList.title = type;
                                this._weaknesList.data = response.data;
                                this._weaknesList.current_page = response.current_page;
                                this._weaknesList.total = response.total;
                                this._weaknesList.per_page = response.per_page;
                                this.weakness_loaded = true;
                                break;
                case 'strength': this._strengthsList.data = response.data;
                                this._strengthsList.id = id;
                                this._strengthsList.title = type;
                                this._strengthsList.current_page = response.current_page;
                                this._strengthsList.total = response.total;
                                this._strengthsList.per_page = response.per_page;
                                this.strength_loaded = true;

                                break;
                case 'opportunity': this._opportunitiesList.id = id;
                                this._opportunitiesList.title = type;
                                this._opportunitiesList.data = response.data;
                                this._opportunitiesList.current_page = response.current_page;
                                this._opportunitiesList.total = response.total;
                                this._opportunitiesList.per_page = response.per_page;
                                this.opportunity_loaded = true;
                                break;
            }
    
        }
        catch(e){

        }
    }

    @action // Unset all variables
    unsetSwotList(){
        this._threatsList = null;
        this.threat_loaded = false;
        this._strengthsList = null;
        this.strength_loaded = false;
        this.opportunity_loaded = false;
        this._opportunitiesList = null;
        this.weakness_loaded = false;
        this._weaknesList = null;
        this._swotCategoryList = [];
        this.swotCategoryLoaded = false;
    }

    // Returns Each List by Item
    getSwotListByItem(type: string):AnalysisList{
        switch(type.toLowerCase()){
            case 'threat': return this._threatsList;
                            break;
            case 'weakness': return this._weaknesList;
                            break;
            case 'strength': return this._strengthsList;
                            break;
            case 'opportunity': return this._opportunitiesList;
                            break;
        }
    }

    @action // Sets Current Page by Item
    setCurrentPageByItem(type,page){
        try{
            switch(type.toLowerCase()){
                case 'threat': this._threatsList.current_page = page;
                                break;
                case 'weakness': this._weaknesList.current_page = page;
                                break;
                case 'strength': this._strengthsList.current_page = page;
                                break;
                case 'opportunity': this._opportunitiesList.current_page = page;
                                break;
            }
        }
        catch(e){
        }
    }
    
}

export const SwotStore = new Store();