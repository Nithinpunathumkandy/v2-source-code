import { observable, action, computed } from "mobx-angular";
// import {DocumentContentDetails,Notes, Checklist} from 'src/app/core/models/knowledge-hub/Documents/DocumentContent'
    import {DocumentContentDetails,Notes,Checklist} from 'src/app/core/models/knowledge-hub/documents/documentContent'
class Store{


    @observable
    private _documentContentList: DocumentContentDetails[] = [];
    @observable
    _documentContentLoaded: boolean = false;
    
    @observable
    documentContentIndivualLoaded:boolean = false;

    @observable
    private _documentContentIndividualList: DocumentContentDetails[] = [];

    @observable
    private _documentNotes: Notes[] = [];
    
    @observable
    _documentNotesLoaded: boolean = false;

    @observable
    private _documentCheckLists: Checklist[] = [];
    @observable
    _documentCheckListsLoaded: boolean = false;

    @observable
    ParentId:number=null;

    
     
    // Set DocumentList
    @action
    setDocumentContentList(data: DocumentContentDetails[]) {
        this._documentContentList = data
        this._documentContentLoaded = true;
    }


    @computed
    get DocumentContentList(): DocumentContentDetails[] {
        return this._documentContentList
    }

    @action 
    clearDocumentContentList() {
        this._documentContentList = [];
        this._documentContentLoaded = false;
    }
    // Set DocumentIndividual List
    @action
    setDocumentContentIndividualList(data: DocumentContentDetails[]) {
        this._documentContentIndividualList = data
        this.documentContentIndivualLoaded = true;
    }

    @action
    clearDocumentIndividualList() {
        this._documentContentIndividualList = [];
        this.documentContentIndivualLoaded = false;  
    }

    @computed
    get DocumentContentIndividualList(): DocumentContentDetails[] {
        return this._documentContentIndividualList
    }

    // Set  & Unset Document Notes

    @action
    setDocumentNotes(data: Notes[]) {
        this._documentNotes = data;
        this._documentNotesLoaded = true;
    }

    @computed
    get DocumentNotes(): Notes[]{
        return this._documentNotes
    }    
    

    @action
    clearDocumentNotes() {
        this._documentNotes = [];
        this._documentNotesLoaded = false;
    }

    // Set and Unset Document CheckLists

    @action
    setDocumentCheckLists(data: Checklist[]) {
        this._documentCheckLists = data;
        this._documentCheckListsLoaded = true;
    }

    @computed
    get DocumentCheckList(): Checklist[]{
        return this._documentCheckLists
    }    

    @action
    clearDocumentCheckList() {
        this._documentCheckLists = [];
        this._documentCheckListsLoaded = false;
    }    
        



    setDocumentContentAccordion(index){
        if(this._documentContentList[index].is_accordion_active == true)
        this._documentContentList[index].is_accordion_active = false;
        else
        this._documentContentList[index].is_accordion_active = true;
        this.unsetDocumentAccordion(index);
      
    }

    unsetDocumentAccordion(index){
        for(let i=0;i<this._documentContentList.length;i++){
            if(i != index){
                this._documentContentList[i].is_accordion_active = false;
            }
        }
    }

}

export const DocumentContentStore = new Store()