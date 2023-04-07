import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { TemplateStore } from 'src/app/stores/knowledge-hub/templates/templates.store'
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

@Component({
  selector: 'app-template-child-data',
  templateUrl: './template-child-data.component.html',
  styleUrls: ['./template-child-data.component.scss']
})
export class TemplateChildDataComponent implements OnInit {

  @Input() childData
  @Input('enableButton') enableButton: boolean = true;

  modalType: string;
  AppStore = AppStore
  DocumentsStore = DocumentsStore;
  TemplateStore = TemplateStore

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
  }

  ngDoCheck() {
    if (this.childData.length > 0) {
      this.childData.forEach(data => {
        this.modalType = 'Template'
      });
    }
  }

  //Adding child data
  addChildData(type, data?) {
    this._eventEmitterService.addTemplateChild(this.modalType, type, data)
  }

  //Setting active class
  setClass(dataId) {
    this.scrollbyIndex(dataId)
    if (DocumentsStore.dataId == dataId) {
      DocumentsStore.dataId == null
    }
    else {
      DocumentsStore.dataId = dataId
    }
    this._utilityService.detectChanges(this._cdr)
  }

  scrollbyIndex(index) {
    console.log(index)
    document.getElementById(index).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  //
  delete(contentId, type) {
    let deleteData = {
      modalType: this.modalType,
      contentId: contentId,
      type: type
    }
    this._eventEmitterService.deleteTemplateChild(deleteData)
  }

  editchildData(id) {
    let editData = {
      modalType: this.modalType,
      id: id
    }
    this._eventEmitterService.editTemplateChild(editData);
  }

  addChildNotes(id) {
    let addData = {
      modalType: this.modalType,
      contentId: id
    }
    this._eventEmitterService.addChildNotes(addData);
  }

  editChildNotes(noteData, id) {
    let editData = {
      modalType: this.modalType,
      id,
      noteData
    }
    this._eventEmitterService.editChildNotes(editData)
  }

  deleteChildNote(noteId, type) {
    let deleteData = {
      modalType: this.modalType,
      type,
      noteId
    }
    this._eventEmitterService.deleteChildNotes(deleteData)
  }

  addChildCheckList(id, checklist) {
    let addData = {
      modalType: this.modalType,
      contentId: id,
      checklistData: checklist
    }
    this._eventEmitterService.addChildCheckLists(addData)
  }

  deleteChildCheckList(checkListId, type, contentId, checklist) {
    let deleteData = {
      modalType: this.modalType,
      type,
      checkListId,
      contentId,
      checklistData: checklist
    }
    this._eventEmitterService.deleteChildCheckLists(deleteData)
  }

  updatePCDA(status, type, contentId) {
    let updateData = {
      modalType: this.modalType,
      status,
      type,
      contentId
    }
    this._eventEmitterService.updatePCDA(updateData)
  }

  updateCheckList(contentId, checkListStatus) {
    let updateData = {
      modalType: this.modalType,
      contentId,
      checkListStatus
    }
    this._eventEmitterService.updateCheckList(updateData)
  }

  openKHCommentBox(contentId) {
    this._eventEmitterService.enableKHCommentBox(contentId)
  }

  ngOnDestroy() {
    this.modalType = ''
    this.childData = [];
  }

}
