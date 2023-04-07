import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsReportComponent } from './isms-report.component';

describe('IsmsReportComponent', () => {
  let component: IsmsReportComponent;
  let fixture: ComponentFixture<IsmsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
