import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditStatusesComponent } from './ms-audit-statuses.component';

describe('MsAuditStatusesComponent', () => {
  let component: MsAuditStatusesComponent;
  let fixture: ComponentFixture<MsAuditStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
