import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { AnalysisPaginationResponse, AnalysisList } from "src/app/core/models/organization/context/swot";
import { IssueCategory } from 'src/app/core/models/masters/organization/issue-category';

class Store {

    @observable
    private _politicalList: AnalysisList;

    @observable
    politicallist_loaded: boolean = false;

    @observable
    private _economicallList: AnalysisList;

    @observable
    economicalist_loaded: boolean = false;

    @observable
    private _socialList: AnalysisList;

    @observable
    sociallist_loaded: boolean = false;

    @observable
    private _technologicalList: AnalysisList;

    @observable
    technologicallist_loaded: boolean = false;

    @observable
    private _environmentalList: AnalysisList;

    @observable
    environmentallist_loaded: boolean = false;

    @observable
    private _legalList: AnalysisList;

    @observable
    legallist_loaded: boolean = false;

    @observable
    private _pestelIssue: AnalysisList;

    @observable
    pestelIssueLoaded = false;

    @observable
    private _pestelIssueList: AnalysisList[] = [];

    @observable
    pestelIssueListLoaded = false;

    @observable
    private _pestelCategoryList: IssueCategory[] = [];

    @observable
    pestelCategoryLoaded: boolean = false;

    @action // Initialize all variables
    setInitialData(){
        this._politicalList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };
        this._economicallList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };
        this._socialList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };
        this._technologicalList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };
        this._legalList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };
        this._environmentalList = {
            id: null,
            title: '',
            data: [],
            current_page: 1,
            total: null,
            per_page: null
        };
    }

    

    /**
     * Set Pestel by Items
     * @param id Id
     * @param title Title 
     * @param response Response
     */
    @action
    setPestleList(id,title,response: AnalysisPaginationResponse){
        try{
            switch(title.toLowerCase()){
                case 'political': this._politicalList.id = id;
                                this._politicalList.title = title;
                                this._politicalList.data = response.data;
                                this._politicalList.current_page = response.current_page;
                                this._politicalList.total = response.total;
                                this._politicalList.per_page = response.per_page;
                                this.politicallist_loaded = true;
                                break;
                case 'economical': this._economicallList.id = id;
                                this._economicallList.title = title;
                                this._economicallList.data = response.data;
                                this._economicallList.current_page = response.current_page;
                                this._economicallList.total = response.total;
                                this._economicallList.per_page = response.per_page;
                                this.economicalist_loaded = true;
                                break;
                case 'social': this._socialList.id = id;
                                this._socialList.title = title;
                                this._socialList.data = response.data;
                                this._socialList.current_page = response.current_page;
                                this._socialList.total = response.total;
                                this._socialList.per_page = response.per_page;
                                this.sociallist_loaded = true;
                                break;
                case 'technological': this._technologicalList.id = id;
                                this._technologicalList.title = title;
                                this._technologicalList.data = response.data;
                                this._technologicalList.current_page = response.current_page;
                                this._technologicalList.total = response.total;
                                this._technologicalList.per_page = response.per_page;
                                this.technologicallist_loaded = true;
                                break;
                case 'environmental': this._environmentalList.id = id;
                                this._environmentalList.title = title;
                                this._environmentalList.data = response.data;
                                this._environmentalList.current_page = response.current_page;
                                this._environmentalList.total = response.total;
                                this._environmentalList.per_page = response.per_page;
                                this.environmentallist_loaded = true;
                                break;
                case 'legal': this._legalList.id = id;
                                this._legalList.title = title;
                                this._legalList.data = response.data;
                                this._legalList.current_page = response.current_page;
                                this._legalList.total = response.total;
                                this._legalList.per_page = response.per_page;
                                this.legallist_loaded = true;
                                break;
            }
        }
        catch(e){}
    }

    @action // Clear Data
    unsetPestleList(){
        this._politicalList = null;
        this.politicallist_loaded = false;
        this._economicallList = null;
        this.economicalist_loaded = false;
        this.sociallist_loaded = false;
        this._socialList = null;
        this.technologicallist_loaded = false;
        this._technologicalList = null;
        this.legallist_loaded = false;
        this._legalList = null;
        this.environmentallist_loaded = false;
        this._environmentalList = null;
    }

    /**
     * Returns PESTEL List By Item
     * @param type Type
     */
    getPestleListByItem(type: string):AnalysisList{
        switch(type.toLowerCase()){
            case 'political': return this._politicalList;
                            break;
            case 'economical': return this._economicallList;
                            break;
            case 'social': return this._socialList;
                            break;
            case 'technological': return this._technologicalList;
                            break;
            case 'environmental': return this._environmentalList;
                            break;
            case 'legal': return this._legalList;
                            break;
        }
    }

    /**
     * Sets Current Page by Item
     * @param type Type
     * @param page Page Number
     */
    setCurrentPageByItem(type,page){
        try{
            switch(type.toLowerCase()){
                case 'political': this._politicalList.current_page = page;
                                break;
                case 'economical': this._economicallList.current_page = page;
                                break;
                case 'social': this._socialList.current_page = page;
                                break;
                case 'technological': this._technologicalList.current_page = page;
                                break;
                case 'environmental': this._environmentalList.current_page = page;
                                break;
                case 'legal': this._legalList.current_page = page;
                                break;
            }
        }
        catch(e){}
    }

    // Set PESTEL Category
    setPestelCategories(categoryList: IssueCategory[]){
        this._pestelCategoryList = categoryList;
        this.pestelCategoryLoaded = true;
    }

    // setPestelIssueList(title,id,response: AnalysisPaginationResponse){
    //     var pos = this._pestelIssueList.findIndex(e=>e.id == id);
    //     if(pos == -1){
    //         var resp = {
    //             id: id,
    //             title: title,
    //             data: response.data,
    //             current_page: response.current_page,
    //             total: response.total,
    //             per_page: response.per_page
    //         };
    //         this._pestelIssueList.push(resp);
    //     }
    // }

    // setPestelissue(title,id,response){
    //     this._pestelIssue.id = id;
    //     this._pestelIssue.title = title;
    //     this._pestelIssue.data = response.data;
    //     this._pestelIssue.current_page = response.current_page;
    //     this._pestelIssue.total = response.total;
    //     this._pestelIssue.per_page = response.per_page;
    // }

    // get pestelIssueList(){
    //     return this._pestelIssueList;
    // }
    
}

export const PestleStore = new Store();