import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-mail-send-popup',
  templateUrl: './mail-send-popup.component.html',
  styleUrls: ['./mail-send-popup.component.scss']
})
export class MailSendPopupComponent implements OnInit {

  @Input('source') mailMessage: string;
  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  gotLoginPage(){
    if(!AuthStore.user?.id){
      this._router.navigateByUrl('/login');
    }
  }

}
