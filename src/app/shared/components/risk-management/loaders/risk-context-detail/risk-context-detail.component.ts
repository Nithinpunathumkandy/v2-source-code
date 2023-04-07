import { Component, OnInit } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

@Component({
  selector: 'app-risk-context-detail',
  templateUrl: './risk-context-detail.component.html',
  styleUrls: ['./risk-context-detail.component.scss']
})
export class RiskContextDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  ngOnDestroy(){
    // SubMenuItemStore.makeEmpty();
  }

}
