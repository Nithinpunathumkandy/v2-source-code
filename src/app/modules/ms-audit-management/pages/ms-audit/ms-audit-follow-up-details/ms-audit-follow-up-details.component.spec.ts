import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditFollowUpDetailsComponent } from './ms-audit-follow-up-details.component';

describe('MsAuditFollowUpDetailsComponent', () => {
  let component: MsAuditFollowUpDetailsComponent;
  let fixture: ComponentFixture<MsAuditFollowUpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditFollowUpDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditFollowUpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
