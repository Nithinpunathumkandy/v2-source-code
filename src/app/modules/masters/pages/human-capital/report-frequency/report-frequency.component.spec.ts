import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFrequencyComponent } from './report-frequency.component';

describe('ReportFrequencyComponent', () => {
  let component: ReportFrequencyComponent;
  let fixture: ComponentFixture<ReportFrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFrequencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
