import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MdlService } from 'src/app/core/services/knowledge-hub/mdl/mdl.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MasterListDocumentStore } from 'src/app/stores/knowledge-hub/master-list-document/masterListDocument.store';

declare var $: any;

@Component({
  selector: 'app-master-document-search',
  templateUrl: './master-document-search.component.html',
  styleUrls: ['./master-document-search.component.scss']
})
export class MasterDocumentSearchComponent implements OnInit {

 
  @ViewChild('searchItems',{static:false}) searchItems: ElementRef;
  
  MasterListDocumentStore = MasterListDocumentStore;
  searchText = '';
  public searchEmptyList;

  constructor(
    private _documentFileService: DocumentFileService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _masterDocumentListStore:MdlService

  ) { }

  ngOnInit(): void {
    this.getDocuments()
  }

  getDocuments(){
      this._masterDocumentListStore.searchDocument('').subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });            
  }
  searchData() {
    if(this.searchText){
      this._masterDocumentListStore.searchDocument(this.searchText).subscribe(res=>{
        if(res.data.length == 0){
          this.searchEmptyList = 'no_document';
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

  gotoFile(documentId) {

    let searchData = {
      docId: documentId
    }
    this._eventEmitterService.passSearchData(searchData)
  }

  closeModal(){
    this.resetSearch();
    this._eventEmitterService.dismissDocumentSearchModal()
  }

  resetSearch() {
    this.searchText = '';
    MasterListDocumentStore.unsetSearchList();
  }

}
