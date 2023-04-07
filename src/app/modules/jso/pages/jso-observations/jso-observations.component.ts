import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { JsoObservationStore } from 'src/app/stores/jso/jso-observations/jso-observations-store';

@Component({
  selector: 'app-jso-observations',
  templateUrl: './jso-observations.component.html',
  styleUrls: ['./jso-observations.component.scss']
})
export class JsoObservationsComponent implements OnInit {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;

  AppStore = AppStore;
  JsoObservationStore = JsoObservationStore;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnDeStroy(){
    JsoObservationStore.unsetJsoObservations();
    JsoObservationStore.unsetIndividualJsoObservations();
  }

}
