import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFollowUpComponent } from './audit-follow-up.component';

describe('AuditFollowUpComponent', () => {
  let component: AuditFollowUpComponent;
  let fixture: ComponentFixture<AuditFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditFollowUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
