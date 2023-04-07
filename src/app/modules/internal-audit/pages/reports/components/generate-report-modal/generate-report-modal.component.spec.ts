import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReportModalComponent } from './generate-report-modal.component';

describe('GenerateReportModalComponent', () => {
  let component: GenerateReportModalComponent;
  let fixture: ComponentFixture<GenerateReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateReportModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
