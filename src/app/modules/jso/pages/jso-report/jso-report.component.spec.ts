import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoReportComponent } from './jso-report.component';

describe('JsoReportComponent', () => {
  let component: JsoReportComponent;
  let fixture: ComponentFixture<JsoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
