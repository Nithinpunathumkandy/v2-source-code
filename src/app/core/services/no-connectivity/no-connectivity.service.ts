import { Injectable } from '@angular/core';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

@Injectable({
  providedIn: 'root'
})
export class NoConnectivityService {

  constructor(private _eventEmitterService: EventEmitterService) { }

  checkConnectivity() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  setConnectionPresent(status: boolean){
    this._eventEmitterService.showHideNoConnectionModal(status);
  }

}
