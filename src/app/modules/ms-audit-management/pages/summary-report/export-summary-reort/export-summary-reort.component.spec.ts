import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSummaryReortComponent } from './export-summary-reort.component';

describe('ExportSummaryReortComponent', () => {
  let component: ExportSummaryReortComponent;
  let fixture: ComponentFixture<ExportSummaryReortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportSummaryReortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSummaryReortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
