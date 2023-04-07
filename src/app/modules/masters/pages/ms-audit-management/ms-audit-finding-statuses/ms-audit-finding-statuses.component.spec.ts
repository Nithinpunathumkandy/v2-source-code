import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditFindingStatusesComponent } from './ms-audit-finding-statuses.component';

describe('MsAuditFindingStatusesComponent', () => {
  let component: MsAuditFindingStatusesComponent;
  let fixture: ComponentFixture<MsAuditFindingStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditFindingStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditFindingStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
