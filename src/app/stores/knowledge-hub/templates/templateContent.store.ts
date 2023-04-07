import { observable, action, computed } from "mobx-angular";
import { TemplateContentDetails, Notes, Checklist } from 'src/app/core/models/knowledge-hub/templates/templateContent'
import { AuditCheckList } from 'src/app/core/models/masters/internal-audit/audit-check-list';

class Store{


    @observable
    private _contentList: TemplateContentDetails[] = [];
    @observable
    _contentLoaded: boolean = false;
    
    @observable
    _contentIndivualLoaded:boolean = false;

    @observable
    private _contentIndividualList: TemplateContentDetails[] = [];

    @observable
    private _contentNotes: Notes[] = [];
    
    @observable
    _contentNotesLoaded: boolean = false;

    @observable
    private _contentCheckList: Checklist[] = [];
    @observable
    _contentCheckListLoaded: boolean = false;

    @observable
    ParentId: number = null;
    @observable
    clause_number: any = null;

    editCheck: boolean = false;

    @observable
    selectedChecklist: AuditCheckList[]=[];

    @observable

    checklistToDisplay: any = [];

    
     
    // Set TemplateList
    @action
    setContentList(data: TemplateContentDetails[]) {
        this._contentList = data
        this._contentLoaded = true;
    }


    @computed
    get ContentList(): TemplateContentDetails[] {
        return this._contentList
    }

    @action 
    clearContentList() {
        this._contentList = [];
        this._contentLoaded = false;
    }
    // Set TemplateIndividual List
    @action
    setContentIndividualList(data: TemplateContentDetails[]) {
        this._contentIndividualList = data
        this._contentIndivualLoaded = true;
    }

    @action
    clearIndividualList() {
        this._contentIndividualList = [];
        this._contentIndivualLoaded = false;  
    }

    @computed
    get ContentIndividualList(): TemplateContentDetails[] {
        return this._contentIndividualList
    }

    // Set  & Unset Template Notes

    @action
    setNotes(data: Notes[]) {
        this._contentNotes = data;
        this._contentNotesLoaded = true;
    }

    @computed
    get Notes(): Notes[]{
        return this._contentNotes
    }    
    

    @action
    clearNotes() {
        this._contentNotes = [];
        this._contentNotesLoaded = false;
    }

    // Set and Unset Template CheckLists

    @action
    setCheckLists(data: Checklist[]) {
        this._contentCheckList = data;
        this._contentCheckListLoaded = true;
    }

    @computed
    get CheckList(): Checklist[]{
        return this._contentCheckList
    }    

    @action
    clearCheckList() {
        this._contentCheckList = [];
        this._contentCheckListLoaded = false;
    }    
        



    setContentAccordion(index){
        if(this._contentList[index].is_accordion_active == true)
        this._contentList[index].is_accordion_active = false;
        else
        this._contentList[index].is_accordion_active = true;
        this.unsetAccordion(index);
      
    }

    unsetAccordion(index){
        for(let i=0;i<this._contentList.length;i++){
            if(i != index){
                this._contentList[i].is_accordion_active = false;
            }
        }
    }

    @action
    addSelectedChecklist(checklist, checklistToDisplay) {
        this.selectedChecklist = checklist;
        this.checklistToDisplay = checklistToDisplay;
    }

    @action
    unSelectChecklist(){
        this.selectedChecklist = [];
        this.checklistToDisplay = [];
    }

}

export const ContentStore = new Store()