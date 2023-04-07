import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReportComponent } from './external-report.component';

describe('ExternalReportComponent', () => {
  let component: ExternalReportComponent;
  let fixture: ComponentFixture<ExternalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
