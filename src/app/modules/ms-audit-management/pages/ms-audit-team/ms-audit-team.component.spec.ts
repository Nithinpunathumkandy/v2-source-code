import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditTeamComponent } from './ms-audit-team.component';

describe('MsAuditTeamComponent', () => {
  let component: MsAuditTeamComponent;
  let fixture: ComponentFixture<MsAuditTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
