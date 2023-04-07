import { Component, Input, OnInit } from '@angular/core';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';

@Component({
  selector: 'app-internal-document-left-menu',
  templateUrl: './internal-document-left-menu.component.html',
  styleUrls: ['./internal-document-left-menu.component.scss']
})
export class InternalDocumentLeftMenuComponent implements OnInit {

  DocumentsStore=DocumentsStore;

  @Input() recursiveData: any

  constructor() { }

  ngOnInit(): void {
  }

  setClass(dataId){

    if(DocumentsStore.dataId==dataId)
    DocumentsStore.dataId==null
    else
    DocumentsStore.dataId=dataId

  }

}
