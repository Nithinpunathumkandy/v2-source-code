import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

@Component({
  selector: 'app-profile-slider',
  templateUrl: './profile-slider.component.html',
  styleUrls: ['./profile-slider.component.scss']
})
export class ProfileSliderComponent implements OnInit {

  constructor(private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
  }

  closeFormModal(){
    window.localStorage.showPopUp = 'false';
    this._eventEmitterService.dismissProductCategory();
  }

}
