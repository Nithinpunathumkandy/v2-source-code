import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditFindingCaStatusesComponent } from './ms-audit-finding-ca-statuses.component';

describe('MsAuditFindingCaStatusesComponent', () => {
  let component: MsAuditFindingCaStatusesComponent;
  let fixture: ComponentFixture<MsAuditFindingCaStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditFindingCaStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditFindingCaStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
