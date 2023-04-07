import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditActivityLogComponent } from './ms-audit-activity-log.component';

describe('MsAuditActivityLogComponent', () => {
  let component: MsAuditActivityLogComponent;
  let fixture: ComponentFixture<MsAuditActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditActivityLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
