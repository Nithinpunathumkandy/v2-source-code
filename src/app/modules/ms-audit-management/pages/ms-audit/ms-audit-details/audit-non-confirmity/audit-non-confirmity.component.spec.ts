import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditNonConfirmityComponent } from './audit-non-confirmity.component';

describe('AuditNonConfirmityComponent', () => {
  let component: AuditNonConfirmityComponent;
  let fixture: ComponentFixture<AuditNonConfirmityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditNonConfirmityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditNonConfirmityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
