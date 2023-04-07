import { Component, OnInit, ChangeDetectorRef , Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {KnTemplatesService} from 'src/app/core/services/knowledge-hub/templates/kn-templates.service'
import { IReactionDisposer, autorun } from "mobx";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import {TemplateStore} from 'src/app/stores/knowledge-hub/templates/templates.store'
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

declare var $: any;

@Component({
  selector: 'app-template-list-popup',
  templateUrl: './template-list-popup.component.html',
  styleUrls: ['./template-list-popup.component.scss']
})
export class TemplateListPopupComponent implements OnInit {

  @ViewChild ('templateFormModal',{static:true}) templateFormModal: ElementRef;
  @ViewChild('docTypeModal') docTypeModal: ElementRef;
  @Input() source
  
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  TemplateStore = TemplateStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  activeFile = null;

  templateObject = {
    values: null,
    type:null
  }

  docTypeObject = {
    values: null,
    type:null
  }

  modalEventSubscription: any;

  constructor(
    private _khTempateService: KnTemplatesService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _khFileService: KhFileServiceService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {

    AppStore.showDiscussion = false;

    this.reactionDisposer = autorun(() => {

      NoDataItemStore.setNoDataItems({title: "Looks like we don't have Template's added here!"});

      // if (NoDataItemStore.clikedNoDataItem) {
      //   this.templateObject.type = 'Add'
      //   this.templateObject.values=null
      //   this.openFormModal();        
      // }
    });

    // NoDataItemStore.setNoDataItems({ title: "Looks like we don't have Template's added here!", subtitle: 'Add Template if there is any. To add, simply tap the button below. ', buttonText: 'Add New Template' })
    this.pageChange(1);

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal()
      this.pageChange(1);
    })
    
  }

  
  pageChange(newPage: number = null) {    
    if (newPage) TemplateStore.setCurrentPage(newPage);
    this._khTempateService
      .getAllItems(false,`&document_type_ids=${this.source}`,false)
      .subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token, type) {
    return this._khFileService.getThumbnailPreview(type,token);
  }

  checkActiveTemplate(template) {
    console.log(JSON.parse(JSON.stringify(template)))
    
    if(this.activeFile!=null && this.activeFile.id==template.id){
      this.activeFile = null
    }
    else{
      this.activeFile = template;
      
    }
  }

  cancel() {
    this.dismissModal();    
  }
  
  dismissModal() {
    this._eventEmitterService.dismissKHTemplateModal();
    this.activeFile = null;
  }


  saveActiveTemplate() {

    TemplateStore.setActiveTemplate(this.activeFile)
    this._eventEmitterService.dismissKHTemplateModal();
    
  }

  openFormModal() {
    setTimeout(() => {
      $(this.templateFormModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.templateFormModal.nativeElement).modal('hide');
    this.templateObject.type = null;
  }

  openDocTypePopupModal() {
    setTimeout(() => {
      $(this.docTypeModal.nativeElement).modal('show');
    }, 100);
  }

  closeDocTypePopupModal() {
    $(this.docTypeModal.nativeElement).modal('hide');
    this.docTypeObject.type = null;
    this.docTypeObject.values=null
  }

  openDoctype(event,docTypeArray){
    event.stopPropagation();
    this.docTypeObject.type = 'Add'              
    this.docTypeObject.values=docTypeArray
    this.openDocTypePopupModal()
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy() {
    this.activeFile = null;
    this.modalEventSubscription.unsubscribe()
  }


}
