import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditScheduleFindingComponent } from './ms-audit-schedule-finding.component';

describe('MsAuditScheduleFindingComponent', () => {
  let component: MsAuditScheduleFindingComponent;
  let fixture: ComponentFixture<MsAuditScheduleFindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditScheduleFindingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditScheduleFindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
