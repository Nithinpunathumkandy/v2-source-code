import { observable, action } from "mobx-angular";
import { DownloadFileDetails } from 'src/app/core/models/general/download-file.model';

/*class Store {
    
    @observable // store details of file being downloaded
    private _downloadFileDetails: DownloadFileDetails;

    @action // Set details of file
    setDownloadFileDetails(fileDetails){
        this._downloadFileDetails = fileDetails;
    }

    @action // Clear download file details
    clearDownloadFileDetails(){
        this._downloadFileDetails = null;
    }

    // Return download file details
    get downloadFileDetails():DownloadFileDetails{
        return this._downloadFileDetails;
    }

    @action // Update download progress
    setDownloadProgress(progress:number){
        this._downloadFileDetails.downloadProgress = progress+'%';
    }

    @action // Update download message
    setDownloadMessage(message:string){
        this._downloadFileDetails.message = message;
    }
}*/

class Store {
    
    @observable // store details of file being downloaded
    private _downloadFileDetails: DownloadFileDetails[] = [];

    @action // Set details of file
    setDownloadFileDetails(fileDetails){
        var pos = this._downloadFileDetails.findIndex(e=>e.position == fileDetails.position);
        if(pos == -1) this._downloadFileDetails.unshift(fileDetails);
        else this._downloadFileDetails[pos] = fileDetails;
    }

    @action // Clear download file details
    clearDownloadFileDetails(position?:number){
        this._downloadFileDetails.splice(position,1);
    }

    // Return download file details
    get downloadFileDetails():DownloadFileDetails[]{
        return this._downloadFileDetails;
    }

    @action // Update download progress
    setDownloadProgress(progress:number,position?: number){
        var pos = this._downloadFileDetails.findIndex(e=>e.position == position);
        this._downloadFileDetails[pos].downloadProgress = progress+'%';
    }

    @action // Update download message
    setDownloadMessage(message:string,position: number){
        var pos = this._downloadFileDetails.findIndex(e=>e.position == position);
        this._downloadFileDetails[pos].message = message;
    }
}

export const DownloadProgressStore = new Store();