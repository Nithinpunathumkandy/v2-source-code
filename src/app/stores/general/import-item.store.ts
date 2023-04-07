import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";

class Store {

    @observable
    private _importFlag: boolean = false;

    @observable
    private importTitle: string;

    @observable
    importClicked: boolean = false;

    @observable
    importLoading: boolean = false;

    @observable
    item_preview_available = false;

    @observable
    preview_url: string;

    @observable
    importFormErrors: string[] = [];

    @observable
    private _imageDetails: Image = null;

    @observable
    private _fileDetails: any = null;

    @action
    setFileDetails(details: Image,url: string){
        this._fileDetails = details;
        this.preview_url = url;
    }

    @action
    unsetFileDetails(token?:string){
        if (this._fileDetails?.hasOwnProperty('is_new')) {
            this._fileDetails = null;
            this.preview_url = null;
        }
        else {
            this._fileDetails['is_deleted'] = true;             
        }  
        this.importLoading = false;
    }

    @action
    unsetAllErrors(){
        this.importFormErrors = [];
    }

    get getFileDetails(): any{
        return this._fileDetails;
    }

    processFormErrors(errors){
        // console.log(errors);
        this.importFormErrors = errors;
        this.importLoading = false;
    }

    @action
    setImportFlag(status: boolean){
        this._importFlag = status;
        this.importFormErrors = [];
    }

    get importFlag(): boolean{
        return this._importFlag;
    }
    
    get title():string{
        return this.importTitle;
    }

    @action
    setTitle(title:string){
        this.importTitle = title;
    }

    //Returns File Details by Type
    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
    }
}

export const ImportItemStore = new Store();