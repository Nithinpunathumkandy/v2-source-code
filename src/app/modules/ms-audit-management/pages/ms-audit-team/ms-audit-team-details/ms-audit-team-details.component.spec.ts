import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditTeamDetailsComponent } from './ms-audit-team-details.component';

describe('MsAuditTeamDetailsComponent', () => {
  let component: MsAuditTeamDetailsComponent;
  let fixture: ComponentFixture<MsAuditTeamDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditTeamDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditTeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
