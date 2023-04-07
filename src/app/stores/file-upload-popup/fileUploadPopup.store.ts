import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/knowledge-hub/documents/documents";


class Store {


    @observable
    preview_url: string;

    @observable
    _systemFile: Image[] = [];

    @observable
    private _displayFiles = [];
    @observable
    _updateArray: Image[] = [];
    @observable
    listStyle: string = 'grid';

    @observable
    openPopup: boolean = false;

    @observable
    verificationId: number

    @observable
    selectedKHDocuments = [];
    // *** File Upload Functions Starts Here ***

    @observable
    singleFileUpload: boolean = false

    @action //Sets Support Files
    setSystemFile(details: Image, url: string) {

        if (!this.singleFileUpload) {
            this._systemFile.unshift(details);
            this.preview_url = url;
        } else {
            this.clearKHFiles()
            this._systemFile = [details];
            this.preview_url = url;
        }




    }
    @action
    setKHFile(details) {
        this.selectedKHDocuments = details;
    }
    @action
    setFilestoDisplay(files) {
        this._displayFiles = files;
    }


    @action //Sets Support Files
    addSystemFile(details: Image, url: string) {

        if (!this.singleFileUpload) {
            this._systemFile.unshift(details);
            this.preview_url = url;
        } else {
            this.clearKHFiles()
            this._systemFile = [details];
            this.preview_url = url;
        }




    }
    //


    @action
    setUpdateFileArray(files: Image) {
        // Setting a array to compare when processing the data when sending to backend.
        this._updateArray.unshift(files)
    }


    @action
    unsetFileDetails(type, token?: string) {
        if (type == 'document-file') {
            // Delete Support File
            var b_pos = this._systemFile.findIndex(e => e.token == token);
            var b_tos = this._systemFile.findIndex(e => e.token == token);
            // To remove from the display files array
            var d_pos = this._displayFiles.findIndex(e => e.token == token);
            if (b_pos != -1) {
                if (this._systemFile[b_pos].hasOwnProperty('is_new')) {
                    this._systemFile.splice(b_pos, 1);
                    this._displayFiles.splice(d_pos, 1)
                }
                else {
                    this._systemFile[b_pos]['is_deleted'] = true;
                    this._displayFiles.splice(d_pos, 1)
                }
            }
            else if (b_tos != -1) {
                if (this.selectedKHDocuments[b_tos].hasOwnProperty('is_new')) {
                    this.selectedKHDocuments.splice(b_tos, 1);
                }
                else {
                    this.selectedKHDocuments[b_tos]['is_deleted'] = true;
                    this._displayFiles.splice(d_pos, 1)
                }
            }
            if (b_pos == -1 && b_tos == -1 && d_pos != -1) {
                this._displayFiles.splice(d_pos, 1)
            }
        } else {
            let s_pos = this.selectedKHDocuments.findIndex(e => e.token == token);
            var d_pos = this._displayFiles.findIndex(e => e.token == token);
            if (s_pos != -1) this.selectedKHDocuments.splice(s_pos, 1);
            if (d_pos != -1) this._displayFiles.splice(s_pos, 1);
            // Delete Version File
            // if(this._versionFile.hasOwnProperty('is_new')){
            //     this._versionFile = null;
            //     this.preview_url = null;
            // }
            // else{
            //     this._versionFile['is_deleted'] = true;
            //     this.preview_url = null;
            // }

        }

    }

    @action
    clearSystemFiles() {
        this._systemFile = [];
    }
    @action
    clearKHFiles() {
        this.selectedKHDocuments = [];
    }
    @action
    clearUpdateFiles() {
        this._updateArray = [];
    }
    @action
    clearFilesToDisplay() {
        this._displayFiles = [];
    }


    get getSystemFile(): Image[] {
        return this._systemFile;
    }
    get getKHFiles(): Image[] {
        return this.selectedKHDocuments;
    }
    get getUpdateArray() {
        return this._updateArray;
    }
    get displayFiles() {
        return this._displayFiles;
    }


    // *** File Upload Functions Ends Here ***

}


export const fileUploadPopupStore = new Store()