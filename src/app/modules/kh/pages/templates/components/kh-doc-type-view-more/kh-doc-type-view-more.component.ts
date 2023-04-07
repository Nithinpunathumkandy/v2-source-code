import { Component, OnInit,Input } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

@Component({
  selector: 'app-kh-doc-type-view-more',
  templateUrl: './kh-doc-type-view-more.component.html',
  styleUrls: ['./kh-doc-type-view-more.component.scss']
})
export class KhDocTypeViewMoreComponent implements OnInit {

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
