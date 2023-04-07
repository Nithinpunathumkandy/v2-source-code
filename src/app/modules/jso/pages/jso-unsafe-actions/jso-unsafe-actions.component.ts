import { Component, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { JsoUnsafeActionStore } from 'src/app/stores/jso/unsafe-actions/jso-unsafe-actions-store';

@Component({
  selector: 'app-jso-unsafe-actions',
  templateUrl: './jso-unsafe-actions.component.html',
  styleUrls: ['./jso-unsafe-actions.component.scss']
})
export class JsoUnsafeActionsComponent implements OnInit {
  AppStore = AppStore;
  JsoUnsafeActionStore = JsoUnsafeActionStore;
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    JsoUnsafeActionStore.unsetJsoUnsafeActions();
    JsoUnsafeActionStore.unsetIndividualJsoUnsafeAction();
  }

}
