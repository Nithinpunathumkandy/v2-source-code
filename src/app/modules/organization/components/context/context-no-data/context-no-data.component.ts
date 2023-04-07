import { Component, OnInit, Input } from '@angular/core';
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";

@Component({
  selector: 'app-context-no-data',
  templateUrl: './context-no-data.component.html',
  styleUrls: ['./context-no-data.component.scss']
})
export class ContextNoDataComponent implements OnInit {

  @Input('source') noData:string;
  @Input('border') border: boolean = true;
  @Input('imageAlign') imageAlign: string = "left";

  @Input('sourceData') sourceData:{noData: string, border: boolean, imageAlign: string};
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  constructor() { }

  ngOnInit(): void {
  }

}
