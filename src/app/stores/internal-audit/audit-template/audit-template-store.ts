
import { observable, action, computed } from "mobx-angular";
import { AuditTemplateAudit, AuditTemplateAuditProgram, AuditTemplateConclusion, AuditTemplateCoverPage, AuditTemplateExecutiveSummary, AuditTemplateFindings, AuditTemplateIntroduction, AuditTemplates, AuditTemplateSchedule, AuditTemplatesPaginationResponse } from "src/app/core/models/internal-audit/audit-template/audit-template";
import { Image } from "src/app/core/models/image.model";

class Store {

    @observable
    selectedRiskRatingTypes:any[] = [];

    @observable
    selectedFindingCategory:any[] = [];

    @observable
    preview_url: string;

    @observable
    logo_preview_url: string;

    @observable
    low_risk_rate: boolean = false;
    
    @observable
    medium_risk_rate: boolean = false;

    @observable
    high_risk_rate: boolean = false;

    @observable
    very_high_risk_rate: boolean = false;

    @observable
    conclusion_preview_url: string;

    @observable
    private _imageDetails: Image = null;

    @observable
    private _imageLogoDetails: Image = null;

    @observable
    private _imageConclusionDetails: Image = null;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    private _logoDocumentDetails: Image[] = [];

    @observable
    private _conclusionImage: Image[] = [];

    @observable
    private _auditTemplateConclusion: AuditTemplateConclusion;

    @observable
    private _auditTemplateAudit: AuditTemplateAudit;

    @observable
    private _auditTemplateFindings: AuditTemplateFindings;

    @observable
    private _auditTemplateExecutiveSummary: AuditTemplateExecutiveSummary;

    @observable
    private _auditTemplateSchedule: AuditTemplateSchedule;

    @observable
    private _auditTemplateAuditProgram: AuditTemplateAuditProgram;

    @observable
    private templatesCoverPage: AuditTemplateCoverPage;

    @observable
    private _auditTemplateIntroduction: AuditTemplateIntroduction;

    @observable
    private _auditTemplates: AuditTemplates[] = [];

    @observable
    private singleAuditTemplate: AuditTemplates;

    @observable 
    loaded:boolean=false;

    @observable 
    individualLoaded:boolean=false;

    @observable 
    coverPageLoaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = '';

    @observable
    totalItems: number = null;

    @observable
    templateId: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedId: number = null;

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setAuditTemplate(response: AuditTemplatesPaginationResponse) {
        

        this._auditTemplates = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    clearAuditTemplates(){
        this._auditTemplates=[];
        this.loaded=false;
    }
    @action
    setAllAuditTemplate(res: AuditTemplates[]) {
       
        this._auditTemplates = res;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): AuditTemplates[] {
        
        return this._auditTemplates.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditTemplateById(id: number): AuditTemplates {
        return this._auditTemplates.slice().find(e => e.id == id);
    }

    @action
    setIndividualAuditTemplate(res){
        this.singleAuditTemplate = res;
        this.individualLoaded = true;
    }

    @computed
    get auditTemplateDetails(): AuditTemplates {
        
        return this.singleAuditTemplate
    }

    @action
    setAuditTemplateCoverPage(res: AuditTemplateCoverPage) {
       
        this.templatesCoverPage = res;
        this.coverPageLoaded = true;
        
    }
    @computed
    get auditTemplateCoverPage():AuditTemplateCoverPage{
        return this.templatesCoverPage;
    }

    @action
    setAuditTemplateSchedule(res: AuditTemplateSchedule) {
        this._auditTemplateSchedule = res;
    }
    @computed
    get auditTemplateSchedule():AuditTemplateSchedule{
        return this._auditTemplateSchedule;
    }
  
    @action
    setAuditTemplateIntroduction(res: AuditTemplateIntroduction) {
        this._auditTemplateIntroduction = res;
        this.coverPageLoaded = true;
    }
    @computed
    get auditTemplateIntroduction():AuditTemplateIntroduction{
        return this._auditTemplateIntroduction;
    }

    @action
    setAuditTemplateAuditProgram(res: AuditTemplateAuditProgram) {
        this._auditTemplateAuditProgram = res;
        this.coverPageLoaded = true;
    }
    @computed
    get auditTemplateAuditProgram():AuditTemplateAuditProgram{
        return this._auditTemplateAuditProgram;
    }

    @action
    setAuditTemplateAudit(res: AuditTemplateAudit) {
        this._auditTemplateAudit = res;
        this.coverPageLoaded = true;
    }
    @computed
    get auditTemplateAudit():AuditTemplateAudit{
        return this._auditTemplateAudit;
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @computed
    get documentDetails(): Image {
        return this._imageDetails;
    }

    @computed
    get logoDocDetails(): Image[] {
        return this._logoDocumentDetails.slice();
    }

    @computed
    get logoDocumentDetails(): Image {
        return this._imageLogoDetails;
    }

    @computed
    get conclusionImage(): Image[] {
        return this._conclusionImage.slice();
    }

    @computed
    get conclusionDocumentDetails(): Image {
        return this._imageConclusionDetails;
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action
    clearLogoDocumentDetails() {
        this._logoDocumentDetails = [];
        this.logo_preview_url = null;
    }

    @action
    clearConclusionDocumentDetails() {
        this._conclusionImage = [];
        this.conclusion_preview_url = null;
    }

    @action
    setDocumentDetails(details: Image,url: string,type: string) {
        if(type == 'logo'){
            this._imageDetails = details;
            this.preview_url = url;
        }
        else{
            this._documentDetails.push(details);
            this.preview_url = url;
        } 
    }

    @action
    setLogoDocumentDetails(details: Image,url: string,type: string) {

        if(type == 'logo'){
            this._imageLogoDetails = details;
            this.preview_url = url;
        }
        else{
        
        this._logoDocumentDetails.push(details);
        this.logo_preview_url = url;
        }
    }

    @action
    setConclusionDocumentDetails(details: Image,url: string,type: string) {
        if(type == 'logo'){
            this._imageConclusionDetails = details;
            this.preview_url = url;
        }
        else{
            this._conclusionImage.push(details);
            this.conclusion_preview_url = url;
        }
    }

    @action
    unsetDocumentDetails(type: string,token?:string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                this.preview_url = null;
            }
        }
        else{
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
        }
    }

    @action
    unsetLogoDocumentDetails(type: string,token?:string){
        if(type == 'logo'){
            if(this._imageLogoDetails.hasOwnProperty('is_new')){
                this._imageLogoDetails = null;
                this.logo_preview_url = null;
            }
            else{
                this._imageLogoDetails['is_deleted'] = true;
                this.logo_preview_url = null;
            }
        }
        else{
            var b_pos = this._logoDocumentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._logoDocumentDetails[b_pos].hasOwnProperty('is_new')){
                    this._logoDocumentDetails.splice(b_pos,1);
                }
                else{
                    this._logoDocumentDetails[b_pos]['is_deleted'] = true;
                }
            }
        }
    }

    @action
    unsetConclusionDocumentDetails(type: string,token?:string){
        if(type == 'logo'){
            if(this._imageConclusionDetails.hasOwnProperty('is_new')){
                this._imageConclusionDetails = null;
                this.conclusion_preview_url = null;
            }
            else{
                this._imageConclusionDetails['is_deleted'] = true;
                this.conclusion_preview_url = null;
            }
        }
        else{
            var b_pos = this._conclusionImage.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._conclusionImage[b_pos].hasOwnProperty('is_new')){
                    this._conclusionImage.splice(b_pos,1);
                }
                else{
                    this._conclusionImage[b_pos]['is_deleted'] = true;
                }
            }
        }
    }

    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
    }

    getLogoFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageLogoDetails;
    }

    getConclucionFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageConclusionDetails;
    }

    @action
    setAuditTemplateFindings(res: AuditTemplateFindings) {
        this._auditTemplateFindings = res;
    }
    @computed
    get auditTemplateFindings():AuditTemplateFindings{
        return this._auditTemplateFindings;
    }

    @action
    setAuditTemplateExecutiveSummary(res: AuditTemplateExecutiveSummary) {
        this._auditTemplateExecutiveSummary = res;
    }
    @computed
    get auditTemplateExecutiveSummary():AuditTemplateExecutiveSummary{
        return this._auditTemplateExecutiveSummary;
    }

    @action
    setAuditTemplateConclusion(res: AuditTemplateConclusion) {
        this._auditTemplateConclusion = res;
    }
    @computed
    get auditTemplateConclusion():AuditTemplateConclusion{
        return this._auditTemplateConclusion;
    }

    @action
    selecRiskType(risk){
        var pos = this.selectedRiskRatingTypes.findIndex( e=> e.id == risk.id);
        if(pos != -1){
          this.selectedRiskRatingTypes.splice(pos,1);
        }
        else{
          this.selectedRiskRatingTypes.push(risk);
        }
    }

    findSelectedRiskTypes(id: number){
        return this.selectedRiskRatingTypes.findIndex( e=> e.id == id);
    }

    @action
    selectCategory(category){
        var pos = this.selectedFindingCategory.findIndex( e=> e.id == category.id);
        if(pos != -1){
          this.selectedFindingCategory.splice(pos,1);
        }
        else{
          this.selectedFindingCategory.push(category);
        }
    }

    findSelectedCategory(id: number){
        return this.selectedFindingCategory.findIndex( e=> e.id == id);
    }
}

export const AuditTemplateStore = new Store();

