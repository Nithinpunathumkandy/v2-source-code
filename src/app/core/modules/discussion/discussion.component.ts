import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { DiscussionBotService } from "src/app/core/services/general/discussion-bot/discussion-bot.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { DiscussionBotStore } from "src/app/stores/general/discussion-bot.store";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HelperServiceService } from '../../services/general/helper-service/helper-service.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {
  @ViewChild('scroll') scroll: any;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  AppStore = AppStore;
  DiscussionBotStore = DiscussionBotStore;
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  discussionMessage: string = '';
  discussionApi: string = '';
  fileUploadsArray: any = [];
  buttonLabel   =  "send";
  isScrollUp = false;
  msg: any;
  previewObject = {
    preview_url: null,
    file_details: null,
    // uploaded_user: null,
    // created_at: "",
    // component: "",
    // componentId: null,
  };
  scrollEventEmitterSubscription: any = null;
  showLoader: boolean = false;
  pageNo: number = 1;;
  constructor(private _discussionBotService: DiscussionBotService, private _imageService: ImageServiceService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,private _helperService: HelperServiceService,
    private _el: ElementRef, private _sanitizer: DomSanitizer,
    ) { }

  ngOnInit(): void {
    this.getButtonText('send')
  }

  ngAfterViewInit() {
    this.scrollEventEmitterSubscription = this._discussionBotService.scrollDiscussion.subscribe(res=>{
      // this.mscrollToBottom();
    })
    // setTimeout(() => {
    //   $(this.scroll.nativeElement).mCustomScrollbar();
    // }, 250);

    this.scrollToBottom();
  }
 

  messageClicked(event){
    AppStore.openDiscussionBox();
  }

  messageClosed(event){
    AppStore.closeDiscussionBox();
    DiscussionBotStore.clearDocumentDetails();
    this.fileUploadsArray = [];
    this.discussionMessage = '';
    this.buttonLabel = "send";
  }

  discussionLargeClicked(event){
    if (AppStore.discussionBoxLarge) AppStore.makeDiscussionBoxSmall();
    else AppStore.makeDiscussionBoxLarge();
  }

  sendMessage(){
    if(this.discussionMessage || DiscussionBotStore.docDetails.length > 0){
       this.buttonLabel = "sending"
      this.showLoader = true
      this._discussionBotService.sendDiscussionMessage(this.processMessage()).subscribe(res=>{
        DiscussionBotStore.clearDocumentDetails();
        // $('#document').scrollTop($('#document').scrollHeight - $('#document').offsetHeight); 
        this.showLoader = false
        this.getButtonText('send')
        this.buttonLabel = "send";
        this.discussionMessage = '';
        this.fileUploadsArray = [];
        this.mscrollToBottom();
        $("#file").val('');
      });
    }
   
  }

  viewAuditDocument(commentId,fileId,imageData){
    let endPoit = commentId+"/files/"+fileId+"/preview";
    this._discussionBotService.showThumbnailImage(endPoit).subscribe(res=>{
      var resp: any = this._utilityService.getDownLoadLink(
        res,
        imageData.name
      );
      this.openPreviewModal(resp, imageData);
    }),
    (error) => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage(
          "Error",
          "Permission Denied"
        );
      } else {
        this._utilityService.showErrorMessage(
          "Error",
          "Unable to generate Preview"
        );
      }
    };
    
  }
  openPreviewModal(filePreview,document) {
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = document;
      
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }

  }

  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.file_details = null;
  }

  // onScroll(event){
  //   if(DiscussionBotStore.discussionMessage['data']){
  //     if(DiscussionBotStore.discussionMessage['total']> DiscussionBotStore.discussionMessage['data'].length ){
  //       if(DiscussionBotStore.currentPage > 1){
  //         DiscussionBotStore.setCurrentPage(DiscussionBotStore.currentPage - 1)
  //         this._discussionBotService.getDiscussionMessage().subscribe()
  //       }
  //     }
  //   }

  // }
  // onScrollUp(event){
  //   DiscussionBotStore.setisScrollUp(true);
  //   if(DiscussionBotStore.discussionMessage['total']> DiscussionBotStore.discussionMessage['data'].length ){
     
  //     if(DiscussionBotStore.discussionMessage['last_page'] != DiscussionBotStore.currentPage){
  //       DiscussionBotStore.setCurrentPage(DiscussionBotStore.currentPage + 1)
  //     }
  //     this._discussionBotService.getDiscussionMessage().subscribe(res=>{
  //       this.isScrollUp = false;
  //     })
  //   }
  
  // }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  refreshChat(){
    DiscussionBotStore.unsetDiscussionMessages();
    DiscussionBotStore.setCurrentPage(1);
    this._discussionBotService.getDiscussionMessage().subscribe() 
  }

  getMsg() {
    console.log('in msg');
  }
  

  processMessage(){
    var saveData ={
      message: this.discussionMessage,
      documents:DiscussionBotStore.docDetails


    }
    return saveData;
  }

  createThumbanilPreview(token){
    return this._discussionBotService.getThumbnailPreview(token)
  }

  downloadThumbanil(commentId,fileId,fileData){
    let endPoint =  commentId+"/files/"+fileId+"/download";
    return this._discussionBotService.downloadThumbnailImage(endPoint,fileData)

  }
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  createImageLargePrevirew(commentId,fileId){
    let endPoint =  commentId+"/files/"+fileId+"/preview";
    return this._discussionBotService.showThumbnailImage(endPoint)

  }
  

  mscrollToBottom() {
    setTimeout(() => {
        $(this.scroll.nativeElement).mCustomScrollbar("scrollTo", "bottom", {
            scrollEasing: "linear"
        });
    }, 50);
}



public scrollToBottom() {
  const el: HTMLDivElement = this._el.nativeElement;
  el.scrollTop = Math.max(10, el.scrollHeight - el.offsetHeight);
}

 /**
   * File selection and upload
   * @param event Selected Files - multiple files
   * @param type type of file - logo or brochure
   */

onFileChange(event,type:string){
  var selectedFiles:any[] =  event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles,type); // Assign Files to Multiple File Uploads Array
      // this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles,elem=>{
        const file = elem;
        if(this._imageService.validateFile(file,type)){
          const formData = new FormData();
          formData.append('file',file);
          var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
          this._imageService.uploadImageWithProgress(formData,typeParams) // Upload file to temporary storage
          .subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if(uploadEvent.loaded){
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress,file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null,file,true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{ //Generate preview url using thumbnail url returns blob
                  this.createImageFromBlob(prew,temp,type); // Convert blob to base64 string
                },(error)=>{
                  this.assignFileUploadProgress(null,file,true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          },(error)=>{
            let errorMessage = "";
            if(error.error?.errors?.hasOwnProperty('file'))
              errorMessage = error.error.errors.file;
            else errorMessage = 'file_upload_failed';
            this._utilityService.showErrorMessage('failed', errorMessage);
            this.assignFileUploadProgress(null,file,true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          this.assignFileUploadProgress(null,file,true);
        }
      });
    }




}
createImageFromBlob(image: Blob,fileDetails,type) {
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    var logo_url = reader.result;
    fileDetails['preview'] = logo_url;
    if(fileDetails != null){
      DiscussionBotStore.setDocumentDetails(fileDetails,type);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }, false);

  if (image) {
     reader.readAsDataURL(image);
  }
}

addItemsToFileUploadProgressArray(files,type){
  var result = this._helperService.addItemsToFileUploadProgressArray(files,type,this.fileUploadsArray);
  this.fileUploadsArray = result.fileUploadsArray;
  return result.files;
}

assignFileUploadProgress(progress,file,success = false){
  let temporaryFileUploadsArray = this.fileUploadsArray;
  this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress,file,success,temporaryFileUploadsArray);
}

removeDocument(token) {
  DiscussionBotStore.unsetDocumentDetails(token);
  // this.checkForFileUploadsScrollbar();
  this._utilityService.detectChanges(this._cdr);
}

// onScroll(event) {
 
//     console.log('scrolled up!!',event);


// }

}
