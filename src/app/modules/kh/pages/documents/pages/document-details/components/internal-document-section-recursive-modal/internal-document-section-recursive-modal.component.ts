import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';

@Component({
  selector: 'app-internal-document-section-recursive-modal',
  templateUrl: './internal-document-section-recursive-modal.component.html',
  styleUrls: ['./internal-document-section-recursive-modal.component.scss']
})
export class InternalDocumentSectionRecursiveModalComponent implements OnInit {


  AppStore=AppStore
  DocumentsStore=DocumentsStore;
  @Input() childData
  modalType: string;
  @Input('enableButton') enableButton: boolean = true;
  controlModalParam={content_id:null,controls:[]};
  controlsModalTitle={
    component:'kh_documents'
  }
  controlModalEventSubscription:any;

  constructor(private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
      
  }


  addChildSection(type, data?) {
    this._eventEmitterService.passChildSectionData(type,data)
  }

  setClass(dataId){
    this.scrollbyIndex(dataId)
    if(DocumentsStore.dataId==dataId){
      DocumentsStore.dataId==null
    }
    else
    DocumentsStore.dataId=dataId
    this._utilityService.detectChanges(this._cdr)
  }

  scrollbyIndex(index) {
    document.getElementById(index).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
}

  delete(contentId, type) {
    
    let deleteData = {
      contentId: contentId,
      type:type
    }
    this._eventEmitterService.deleteTemplateChild(deleteData)
    this._eventEmitterService.passChildSectionDeleteData(deleteData)
  }

  editchildData(id) {
    let editData = {
      id:id
    }
    this._eventEmitterService.editTemplateChild(editData);
    this._eventEmitterService.passChildSectionEditData(editData)
  }

  addChildNotes(id) { 
    
    let addData = {
      contentId:id
    }

    this._eventEmitterService.addChildNotes(addData); 
  }
  editChildNotes(noteData, id) {
    let editData = {
      id,
      noteData
    }
    this._eventEmitterService.editChildNotes(editData)
  }

  deleteChildNote(noteId, type) {
    let deleteData = {
      type,
      noteId
    }
    this._eventEmitterService.deleteChildNotes(deleteData)
  }
  addChildCheckList(id,checklist) {
    let addData = {
      contentId: id,
      checklistData:checklist
    }
    this._eventEmitterService.addChildCheckLists(addData)
  }
  deleteChildCheckList(checkListId, type,contentId,checklist) {
    let deleteData = {
      type,
      checkListId,
      contentId,
      checklistData:checklist
    }
    this._eventEmitterService.deleteChildCheckLists(deleteData)
  }

  addControls(id,controls) {
    let addData = {
      contentId: id,
      checklistData:controls
    }
    this._eventEmitterService.addChildControls(addData)
  }

  deleteChildControl(controlId, type,contentId,controls) {
    let deleteData = {
      type,
      controlId,
      contentId,
      controlData:controls
    }
    this._eventEmitterService.deleteChildControlLists(deleteData)
  }

  updatePCDA(status, type, contentId) {
    let updateData = {
      status,
      type,
      contentId
    }
    this._eventEmitterService.updatePCDA(updateData)
  }

  updateCheckList(contentId, checkListStatus) {
    let updateData = {
      contentId,
      checkListStatus
    }
    this._eventEmitterService.updateCheckList(updateData)
  }

  openKHCommentBox(contentId){
      this._eventEmitterService.enableKHCommentBox(contentId)
  }

  ngOnDestroy()
  {
    this.modalType = ''
    this.childData = [];
  }

}
