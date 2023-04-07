import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { IncidentTemplateService } from 'src/app/core/services/incident-management/incident-template/incident-template.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentTemplateStore } from 'src/app/stores/incident-management/template/incident-template-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;

@Component({
  selector: 'app-incident-template-details',
  templateUrl: './incident-template-details.component.html',
  styleUrls: ['./incident-template-details.component.scss']
})
export class IncidentTemplateDetailsComponent implements OnInit {
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  IncidentTemplateStore = IncidentTemplateStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  fields=[];
  fileUploadsArray = [];
  selectedIndex: any = 0;
  labelId: any;
  order: any;
  isEnable: any;
  saveData: any = null;
  pageId: any;
  intro: any;
  conclusion: any;
  label: any;
  conclusionLabelId: any;
  isConclusionEnable: any;
  introductionLabelId: number;
  isIntroductionEnable: number;
  conclusionImage: any;
  coverImage : any;
  isEnableIntro: any;
  isEnableCover: number;
  coverPageId: any;
  labelName: any;
  conclusionLabel: any;
  constructor( private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _templateService : IncidentTemplateService,
    private _incidentFileService : IncidentFileService,
    private route: ActivatedRoute, private _renderer2: Renderer2) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }

    ]);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.selectedIndex = 0;
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      IncidentTemplateStore.reportTemeplateId = id;
      this.getTemplateDetails(id);
    });
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  gotoTab(ind,pages){

  
    this.selectedIndex = ind
    this.pageId = pages.id
    this.labelId = pages.label_id
    this.order = pages.order
    this.isEnable = pages.is_enable
    this.label = pages.label.label
    this._utilityService.detectChanges(this._cdr);

  }

  /* @param progress File Upload Progress
  * @param file Selected File
  * @param success Boolean value whether file upload success 
  */
    assignFileUploadProgress(progress, file, success = false) {
      let temporaryFileUploadsArray = this.fileUploadsArray;
      this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
  return result.files;
}

checkForFileUploadsScrollbar() {
  
  if (IncidentTemplateStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
    $(this.uploadArea.nativeElement).mCustomScrollbar();
  }
  else {
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  }
}

createImageFromBlob(image: Blob, imageDetails, type,documentType) {
  IncidentTemplateStore.unsetDocumentDetails();
 IncidentTemplateStore.unsetConclusionDocumentDetails();
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    var logo_url = reader.result;

    imageDetails['preview'] = logo_url;
    if (imageDetails != null && documentType=='coverImage' ){
      
      this._templateService.setDocumentDetails(imageDetails, type);

    }else if(imageDetails != null && documentType=='conclusion'){
      this._templateService.setConclusionDocumentDetails(imageDetails, type);

    }
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }, false);

  if (image) {
    reader.readAsDataURL(image);
  }
}

onFileChange(event, type: string,documentType: string) {// doc-add  file change function
 
  var selectedFiles: any[] = event.target.files;
  if (selectedFiles.length > 0) {
    var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); 
    this.checkForFileUploadsScrollbar();
    Array.prototype.forEach.call(temporaryFiles, elem => {
      const file = elem;
      if (this._imageService.validateFile(file, type)) {
        const formData = new FormData();
        formData.append('file', file);
        var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
        this._imageService.uploadImageWithProgress(formData, typeParams) 
          .subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if (uploadEvent.loaded) {
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress, file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { 
                  this.createImageFromBlob(prew, temp, type,documentType); 
                }, (error) => {
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
      }
      else {
        this.assignFileUploadProgress(null, file, true);
      }
    });
  }
}

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }
  checkLogoIsUploading(){// doc-add  Check if logo is being uploaded
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  removeDocument(token) {
    IncidentTemplateStore.romveDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }
  removeConclusionDocument(token) {
    IncidentTemplateStore.romvConclusioneDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)

  }

  getTemplateDetails(id){
    IncidentTemplateStore.unsetDocumentDetails();
    IncidentTemplateStore.unsetConclusionDocumentDetails();
  
    this._templateService.getItem(id).subscribe(res=>{
      if(res.incident_report_template_pages.length>0)
      this.pageId = IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages[0].id 
      this.labelId = IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages[0].label_id
      this.label= IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages[0].label.label
      
      this.order =IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages[0].order
    this.isEnable = IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages[0].is_enable
      // this.setDocuments(IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages[0]?.report_template_page_fields[0]?.documents);
      IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages.map(data=>{
        if(data.label.label == 'conclusion'){
          data.report_template_page_fields.map(item=>{
            if(item.label.label == 'image'){
              if(item.documents.length > 0) this.setConclusionDocuments(item.documents)
            }
          })
          // this.setConclusionDocuments(data.report_template_page_fields[0]?.documents)
        }else if(data.label.label == 'incident_cover_page'){
          data.report_template_page_fields.map(item=>{
            if(item.label.label == 'incident_background'){
              if(item.documents.length > 0) this.setDocuments(item.documents)
            }
          })

        }
      })
      this._utilityService.detectChanges(this._cdr);
    })
  }
  setDocuments(documents){ //doc-prv
    for (let i of documents) {
      let docurl = this._incidentFileService.getThumbnailPreview('report-template-document', i.token);
      let docDetails = {
        created_at: i.created_at,
        created_by: i.created_by,
        updated_at: i.updated_at,
        updated_by: i.updated_by,
        name: i.title,
        ext: i.ext,
        size: i.size,
        url: i.url,
        thumbnail_url: i.url,
        token: i.token,
        preview: docurl,
        id: i.id
      };

      this._templateService.setDocumentDetails(docDetails, docurl);
      setTimeout(() => {
        this.checkForFileUploadsScrollbar();
      }, 200);
    } 
  }

  // Returns default image url
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  setConclusionDocuments(documents){ //doc-prv
    for (let i of documents) {
      let docurl = this._incidentFileService.getThumbnailPreview('report-template-document', i.token);
      let docDetails = {
        created_at: i.created_at,
        created_by: i.created_by,
        updated_at: i.updated_at,
        updated_by: i.updated_by,
        name: i.title,
        ext: i.ext,
        size: i.size,
        url: i.url,
        thumbnail_url: i.url,
        token: i.token,
        preview: docurl,
        id: i.id
      };

      this._templateService.setConclusionDocumentDetails(docDetails, docurl);
      setTimeout(() => {
        this.checkForFileUploadsScrollbar();
      }, 200);
    } 
  }

  toggleVisibility(event,labelID){
    if(event.target.checked){
     
      this.fields = this.fields.filter((item) => item.label_id !== labelID.label_id);
     if(this.label == 'incident_cover_page'){
      this.coverImage = IncidentTemplateStore.docDetails[0]
      this.isEnableCover = 1
      this.coverPageId = labelID.label_id
      this.labelName = labelID.label.label
      // this.fields.push({
      //   label_id:labelID.label_id,
      //   is_enable:1
      //   // introduction: this.intro ? this.intro : '' ,
      //   // conclusion : this.conclusion ? this.conclusion : '', 

      // });
     }else if(this.label == 'incident_introduction'){
       this.introductionLabelId = labelID.label_id
       this.isIntroductionEnable = 1
      // this.fields.push({
      //   label_id:labelID.label_id,
      //   is_enable:1,
      //   introduction: this.intro ? this.intro : '' ,
      //   conclusion :  '', 
      //   // documents:IncidentTemplateStore.docDetails[0]

      // });
     }else if(this.label == 'conclusion'){
      this.conclusionLabelId = labelID.label_id;
      this.isConclusionEnable = 1
      this.conclusionLabel = labelID.label.label
      this.conclusionImage = IncidentTemplateStore.docConclusionDetails[0] 
      // this.fields.push({
      //   label_id:labelID.label_id,
      //   is_enable:1,
      //   introduction: '' ,
      //   conclusion : this.conclusion ? this.conclusion : '', 
      //   // documents:IncidentTemplateStore.docDetails[0]

      // });
     }
     
     else{
       this.fields = []
      
      this.fields.push({
        label_id:labelID.label_id,
        is_enable:1,
        // introduction: this.intro ? this.intro : '' ,
        // conclusion : this.conclusion ? this.conclusion : '', 
      });
     }
    
      
    }else{
     
      this.fields = this.fields.filter((item) => item.label_id !== labelID.label_id);
      
      if(this.label == 'incident_cover_page'){
        this.coverImage =  []
        this.isEnableCover = 0
        this.coverPageId = labelID.label_id

       }else if(this.label == 'incident_introduction'){
        this.introductionLabelId = labelID.label_id
        this.isIntroductionEnable = 0
        // this.fields.push({
        //   label_id:labelID.label_id,
        //   is_enable:0,
        //   introduction: this.intro ? this.intro : '' ,
        //   conclusion :  '', 
        //   // documents:IncidentTemplateStore.docDetails[0]
  
        // });
       }else if(this.label == 'conclusion'){
        this.conclusionLabelId = labelID.label_id;
        this.isConclusionEnable = 0
        // this.fields.push({
        //   label_id:labelID.label_id,
        //   is_enable:0,
        //   introduction: '' ,
        //   conclusion : this.conclusion ? this.conclusion : '', 
        //   // documents:IncidentTemplateStore.docDetails[0]
  
        // });
       }
       else{
       
        // this.fields = []
         
        this.fields.push({
          label_id:labelID.label_id,
          is_enable:0,
          // introduction: this.intro ? this.intro : '' ,
          // conclusion : this.conclusion ? this.conclusion : '', 
        });
       }
      
    }
    return true;
  }

  saveIncidentReportTemplates() {
    
    if(this.fields.length == 0){
      
      IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages.map(data=>{
        if(data.label.label == this.label){
          if(this.label == "incident_introduction"){
            this.fields.push({
              label_id:data.report_template_page_fields[0].label_id,
              is_enable:data.report_template_page_fields[0].is_enable,
              order:data.report_template_page_fields[0].order,
              introduction: this.intro ? this.intro : '' ,
              conclusion : data.report_template_page_fields[0].conclusion ? data.report_template_page_fields[0].conclusion : '', 


            })
          }else if(this.label == "conclusion"){
            data.report_template_page_fields.map(item=>{
              this.fields.push({
                label_id:item.label_id,
                is_enable:item.is_enable,
                order:item.order,
                documents:IncidentTemplateStore.docConclusionDetails[0],
                introduction: item.introduction ? item.introduction : '',
                conclusion : this.conclusion ? this.conclusion : '', 
    
              })
            })
            
          }else if(this.label == "incident_cover_page"){
            data.report_template_page_fields.map(item=>{
              if(item.label.label == 'incident_background'){
                this.fields.push({
                  label_id:item.label_id,
                  is_enable:item.is_enable,
                  order:item.order,
                  documents:IncidentTemplateStore.docDetails[0],
                })
               
              }
            })

        
          }else{
            this.fields.push({
              label_id:data.report_template_page_fields[0].label_id,
              is_enable:data.report_template_page_fields[0].is_enable,
              order:data.report_template_page_fields[0].order,
              // documents:IncidentTemplateStore.docDetails[0],
            })
          }
         
        }
        // else{
        //   this.fields.push({
        //     label_id:IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages[0].report_template_page_fields[0].label_id,
        //     is_enable:IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages[0].report_template_page_fields[0].is_enable,
        //     order:IncidentTemplateStore.IncidentTemplateDetails?.incident_report_template_pages[0].report_template_page_fields[0].order,
        //     documents:IncidentTemplateStore.docDetails[0],
  
        //   });
        // }
      })

    
    }else if(this.label == 'conclusion'){
    
      this.fields.push({
        label_id:this.conclusionLabelId,
        is_enable:this.isConclusionEnable,
        introduction: '' ,
        conclusion : this.conclusion ? this.conclusion : '', 
         documents:this.conclusionLabel =='image' && this.isConclusionEnable == 1 ?  IncidentTemplateStore.docConclusionDetails[0] : []

      });
     }else if(this.label == 'incident_introduction'){
        this.fields.push({
        label_id :  this.introductionLabelId,
        is_enable:  this.isIntroductionEnable,
        introduction: this.intro ? this.intro : '' ,
        conclusion :  '', 
        // documents:IncidentTemplateStore.docDetails[0]

      });

     }else if(this.label == 'incident_cover_page'){
      this.fields.push({
        label_id :  this.coverPageId,
        is_enable:  this.isEnableCover,
        documents: this.labelName =='incident_background' && this.isEnableCover == 1 ? IncidentTemplateStore.docDetails[0] : []

      });
     }
  
    this.saveData={
      label_id:this.labelId,
      is_enable:this.isEnable,
      order:this.order,
      incident_report_template_page_fields:this.fields?this.fields:[],
    };
    AppStore.enableLoading();
    let save=this._templateService.saveIncidentReportTemplates( IncidentTemplateStore.reportTemeplateId,this.pageId, this.saveData);
    save.subscribe(res=>{
      AppStore.disableLoading();
      this.documentRemove();
      this.fields=[]
      this._utilityService.detectChanges(this._cdr);
    },(error:HttpErrorResponse)=>{
      AppStore.disableLoading();
      this._utilityService.showErrorMessage('error','something_went_wrong_try_again');
      this._utilityService.detectChanges(this._cdr);
    });
  }

  documentRemove(){
    if( IncidentTemplateStore.docDetails[0]?.is_deleted){
      IncidentTemplateStore.unsetDocumentDetails();
    }
  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
    IncidentTemplateStore.unsetTemplateDetails()
  }

}
