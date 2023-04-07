import { Component, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss']
})
export class TrainingsComponent implements OnInit {
  
  TrainingsStore = TrainingsStore;
  AppStore = AppStore;

  constructor() { }

  ngOnInit(): void {
  }

}
