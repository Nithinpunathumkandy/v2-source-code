import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store'

declare var $: any;

@Component({
  selector: 'app-document-search',
  templateUrl: './document-search.component.html',
  styleUrls: ['./document-search.component.scss']
})
export class DocumentSearchComponent implements OnInit {

  @ViewChild('searchItems',{static:false}) searchItems: ElementRef;
  
  DocumentsStore = DocumentsStore;
  searchText = ' ';
  public searchEmptyList;

  constructor(
    private documentService: DocumentsService,
    private _documentFileService: DocumentFileService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService

  ) { }

  ngOnInit(): void {
    this.resetSearch()
    this.getDocuments()
  }

  getDocuments(){
      this.documentService.searchDocument('').subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });            
  }
  
  searchData() {
    if(this.searchText){
      this.documentService.searchDocument(this.searchText).subscribe(res=>{
        if(res.data.length == 0){
          this.searchEmptyList = 'no_kh_document';
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.getDocuments()
    }
  }

    // * To Get the Image URL 

    createImageUrl(type,token ,h? ,w? ) {
      return this._documentFileService.getThumbnailPreview(type,token,h,w);
    }

    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
  
    checkForServiceItemsScrollbar(){
      setTimeout(() => {
        if($(this.searchItems?.nativeElement).height() >= 100){
          $(this.searchItems.nativeElement).mCustomScrollbar();
        }
        else{
          $(this.searchItems?.nativeElement).mCustomScrollbar("destroy");
        }
      }, 250);
    }

  gotoFile(isFolder, documentId,documentTitle) {

    let searchData = {
      folderStatus: isFolder,
      docId: documentId,
      docTitle:documentTitle
    }
    DocumentsStore.breadCrumbItemCheck = DocumentsStore.breadCrumbData.some( element => element.id ==documentId);
    this._eventEmitterService.passSearchData(searchData)
  }

  resetSearch() {
    this.searchText = null;
    DocumentsStore.unsetSearchList();
  }



}
