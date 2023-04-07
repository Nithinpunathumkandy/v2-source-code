import { Injectable, ChangeDetectorRef } from "@angular/core";
import { SnackbarService } from 'ngx-snackbar';
import { AppStore } from 'src/app/stores/app.store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { LabelMasterStore } from "src/app/stores/masters/general/label-store";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    errors: Array<any>;

    constructor(
        private _snackbarService: SnackbarService,
        private _toastr: ToastrService,
        private _translate: TranslateService
    ) { }

    toast(message: string, type: string = 'i', postion: 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br' = 'tr', timeout = 5000) {
        this._snackbarService.add({
            msg: this.translateToUserLanguage(message),
            timeout: timeout,
            color: '#fff',
            background: type == 'w' ? '#f37245' : '#0ad4e',
            action: {
                text: '',
            }
        });

        AppStore.snackbarPosition = postion;
    }

    showSuccessMessage(title: string, message: string) {
        this._toastr.success(this.translateToUserLanguage(title), this.translateToUserLanguage(message));
    }

    hideSuccessMessage() {
        this._toastr.clear();
    }

    showErrorMessage(title: string, message: string) {
        this._toastr.error(this.translateToUserLanguage(title), this.translateToUserLanguage(message));
    }

    showWarningMessage(title: string, message: string){
        this._toastr.warning(this.translateToUserLanguage(title), this.translateToUserLanguage(message));
    }

    detectChanges(cdr: ChangeDetectorRef) {
        if (!cdr['destroyed']) cdr.detectChanges();
    }

    downloadFile(response: any, fileName: string) {
        let userAgent = navigator.userAgent.toLowerCase();
        // console.log(userAgent);
        this.getFileNamePerLanguage(fileName).subscribe(res=>{
            if(userAgent.indexOf('trident') == -1){
                // console.log('other browsers');
                let dataType = response.type;
                let binaryData = [];
                binaryData.push(response);
                let downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
                downloadLink.setAttribute('download', res);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                this.setSubMenuStatus();
            }
            else{
                window.navigator.msSaveBlob(response, res);
                this.setSubMenuStatus();
            }
        });
    }

    setSubMenuStatus(){
        if(SubMenuItemStore.exportClicked) SubMenuItemStore.exportClicked = false;
        if(SubMenuItemStore.templateClicked) SubMenuItemStore.templateClicked = false;
    }

    getDownLoadLink(response: any, fileName: string) {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        //console.log(downloadLink);
        return downloadLink.href;
        //downloadLink.click();
    }

    //Scroll Window to Top
    scrollToTop(){
        window.scroll(0,0);
    }

    getFileNamePerLanguage(fileName){
        return this._translate.get(fileName).pipe(map(res=>{
            // console.log(res);
            return res;
        }))
    }

    translateToUserLanguage(text){
        var translatedText = text;
        if(LabelMasterStore.getLabelsToTranslate && LabelMasterStore.getLabelsToTranslate.hasOwnProperty(text))
          translatedText = LabelMasterStore.getLabelsToTranslate[text];
        return translatedText;
      }

}