import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditTeamListComponent } from './ms-audit-team-list.component';

describe('MsAuditTeamListComponent', () => {
  let component: MsAuditTeamListComponent;
  let fixture: ComponentFixture<MsAuditTeamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditTeamListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditTeamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
