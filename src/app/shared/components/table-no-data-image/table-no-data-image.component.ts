import { Component, Input, OnInit } from '@angular/core';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';

@Component({
  selector: 'app-table-no-data-image',
  templateUrl: './table-no-data-image.component.html',
  styleUrls: ['./table-no-data-image.component.scss']
})
export class TableNoDataImageComponent implements OnInit {

  @Input('source') noData:string;
  @Input('border') border: boolean = true;
  // @Input('imageAlign') imageAlign: string = "left";

  @Input('sourceData') sourceData:{noData: string, border: boolean};
  ThemeStructureSettingStore = ThemeStructureSettingStore;

  ngOnInit(): void {
  }

}
