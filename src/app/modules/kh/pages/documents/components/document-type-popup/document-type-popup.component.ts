import { Component, OnInit,Input } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

@Component({
  selector: 'app-document-type-popup',
  templateUrl: './document-type-popup.component.html',
  styleUrls: ['./document-type-popup.component.scss']
})
export class DocumentTypePopupComponent implements OnInit {

  @Input() source;

  constructor(
    private _eventEmitterService: EventEmitterService    
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {        
    this._eventEmitterService.dismissDocTypePopup()
  }

}
