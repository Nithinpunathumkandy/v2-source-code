import { observable, action, computed } from "mobx-angular";
import { Observable, Subject } from "rxjs";
import { Image } from "src/app/core/models/image.model";

class Store {

    @observable
    private _discussionObservableApi = new Subject<string>();

    @observable
    discussionApi:string = '';
    @observable
    discussionThumbnailApi:string = '';
    @observable
    thumbanilImageDwonloadApi : string = '';
    @observable
    preview_url: string;
    @observable
    document_preview_available: boolean = false;
    @observable
    private _documentDetails: Image[] = [];
    @observable
    private showThumbnailApi : string = '';
    @observable
    private isScrollUp : boolean = true;
    @observable
    private basePath : string;
    @observable
    messagesLoaded:boolean=false;

    setbasePath(api:string){
        this.basePath = api;
    }

    setisScrollUp(value : boolean){
        this.isScrollUp = value
    }

    setShowThumbnailAPI(api: string){
        this.showThumbnailApi = api
    }

    setDiscussionAPI(api: string){
        this.discussionApi = api;
    }

    setDiscussionThumbnailAPI(api: string){
        this.discussionThumbnailApi = api;
    }

    setThumbnailDownloadAPI(api: string){
        this.thumbanilImageDwonloadApi = api;
    }

    get basePathComments():string{
        return this.basePath;
    }

    get isScrolledUp():boolean{
        return this.isScrollUp;
    }

    get showThumbnailAPI():string{
        return this.showThumbnailApi;
    }

    get discussionAPI(): string{
        return this.discussionApi;
    }

    get discussionThumbnailAPI(): string {
        return this.discussionThumbnailApi
    }

    get thumbnailDwonloadAPI():string {
        return this.thumbanilImageDwonloadApi
    }

    @observable
    private _totalCount

    @action
    setTotalCount(count : any){
      this._totalCount = count;
    }

    get totalCount():any{
        return this._totalCount;
    }

    @observable
    private _lastPage

    @action
    setLastPage(page :any){
        this._lastPage = page;
    }

    get lastPageCount():any{
        return this._lastPage;
    }

    @observable
    private _currentPage : any = 1;

    @action
    setCurrentPage(pageNumber:any){
        this._currentPage = pageNumber
    }

    get currentPage():any{
        return this._currentPage;
    }

    @observable
    private _discussionMessages: any[] = [];

    @action
    setDiscussionMessage(message: any){
        this._discussionMessages = message;
        this.messagesLoaded=true;
    }

    get discussionMessage():any[]{
        return this._discussionMessages;
    }

    @action
    unsetDiscussionMessages(){
        this._discussionMessages = [];
        this.messagesLoaded=false
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }
    @action
    setDocumentDetails(details: Image,url: string) {
            this._documentDetails.push(details);
            this.preview_url = url;
    }
    @action
    unsetDocumentDetails(token?:string){
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails;
    }

     

}

export const DiscussionBotStore = new Store();