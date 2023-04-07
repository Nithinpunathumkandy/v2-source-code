import { Component, OnInit } from '@angular/core';
import { SOAStore } from 'src/app/stores/isms/isms-risks/soa.store';

@Component({
  selector: 'app-soa',
  templateUrl: './soa.component.html',
  styleUrls: ['./soa.component.scss']
})
export class SoaComponent implements OnInit {
  SoaStore = SOAStore;

  constructor() { }

  ngOnInit(): void {
  }

}
