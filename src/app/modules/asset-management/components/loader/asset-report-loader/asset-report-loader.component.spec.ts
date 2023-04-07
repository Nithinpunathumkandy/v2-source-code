import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetReportLoaderComponent } from './asset-report-loader.component';

describe('AssetReportLoaderComponent', () => {
  let component: AssetReportLoaderComponent;
  let fixture: ComponentFixture<AssetReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
