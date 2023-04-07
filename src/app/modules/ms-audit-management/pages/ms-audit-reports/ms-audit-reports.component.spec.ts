import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditReportsComponent } from './ms-audit-reports.component';

describe('MsAuditReportsComponent', () => {
  let component: MsAuditReportsComponent;
  let fixture: ComponentFixture<MsAuditReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
