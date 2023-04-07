import { Component, Input, OnInit } from '@angular/core';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';

@Component({
  selector: 'app-ms-clause-loop',
  templateUrl: './ms-clause-loop.component.html',
  styleUrls: ['./ms-clause-loop.component.scss']
})
export class MsClauseLoopComponent implements OnInit {
@Input('children')children :any;

  constructor() { }

  ngOnInit(): void {
  }

  changeCheckItemStatus(event, id){
    
    if(event.target.checked){
      KpisStore.pushId(id);
    }else{
      KpisStore.removeId(id);
    }
  } 
  
  checkedItem(id){
    return  KpisStore.checkId(id);
  }

  generateIdforString(id:number){
    return `id${id.toString()}`;
  }
  
}
