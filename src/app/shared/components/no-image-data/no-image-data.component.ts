import { Component, Input, OnInit } from '@angular/core';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';

@Component({
  selector: 'app-no-image-data',
  templateUrl: './no-image-data.component.html',
  styleUrls: ['./no-image-data.component.scss']
})
export class NoImageDataComponent implements OnInit {


  @Input('source') noData:string;
  @Input('border') border: boolean = true;
  // @Input('imageAlign') imageAlign: string = "left";

  @Input('sourceData') sourceData:{noData: string, border: boolean};
  ThemeStructureSettingStore = ThemeStructureSettingStore;

  constructor() { }

  ngOnInit(): void {
  }

}
