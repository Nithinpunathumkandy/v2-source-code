import { Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

@Component({
  selector: 'app-initiative-more-modal',
  templateUrl: './initiative-more-modal.component.html',
  styleUrls: ['./initiative-more-modal.component.scss']
})
export class InitiativeMoreModalComponent implements OnInit {
@Input('source') InitiativeDataSource : any;
  constructor(private _eventEmitterService: EventEmitterService,
    ) { }

  ngOnInit(): void {
  }

  cancel(){
    this._eventEmitterService.dismissInitiativeMoreModal()
  }

}
