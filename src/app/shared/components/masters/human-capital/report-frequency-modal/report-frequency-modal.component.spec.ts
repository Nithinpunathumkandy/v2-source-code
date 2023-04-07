import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFrequencyModalComponent } from './report-frequency-modal.component';

describe('ReportFrequencyModalComponent', () => {
  let component: ReportFrequencyModalComponent;
  let fixture: ComponentFixture<ReportFrequencyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFrequencyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFrequencyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
