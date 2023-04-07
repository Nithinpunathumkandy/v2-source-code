import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { JwtService } from 'src/app/core/auth/services/jwt.service';
import { AuthStore } from "src/app/stores/auth.store";
import { IdleTimeoutStore } from "src/app/stores/idle-timeout.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { AppStore } from 'src/app/stores/app.store';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  
  networkCallCount: number = 0;
  constructor(private idle: Idle, private keepalive: Keepalive,private _authService: AuthService,
    private _jwtService: JwtService, private _router: Router, private _eventEmitterService: EventEmitterService) { }
  
  reset() {
    this.idle.watch();
  }

  startMonitoring(){
    this.idle.watch();
  }

  stopMonitoring(){
    this.idle.stop();
  }

  initializeMonitoring(){
    // this.idle.setIdle(300);
    // console.log(AppStore.idleTimeOut);
    this.idle.setIdle(AppStore.idleTimeOut);
    // this.idle.setIdle(120);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => { 
      this._eventEmitterService.showHideIdleModal(false);
      this.reset();
    });
    
    this.idle.onIdleStart.subscribe(() => {
        // this.idleState = 'You\'ve gone idle!'
      if(AuthStore.user){
        let userDetails = JSON.stringify(AuthStore.user);
        IdleTimeoutStore.setUser(JSON.parse(userDetails));
      }
      AuthStore.setRedirectUrl(this._router.url);
      this._authService.purgeAuth();
      this._eventEmitterService.showHideIdleModal(true);      
    });

    this._jwtService.isLoggedIn().subscribe(res=>{
      if(res){
        this.startMonitoring();
      }
      else{
        this.stopMonitoring();
      }
    })
  }
}
