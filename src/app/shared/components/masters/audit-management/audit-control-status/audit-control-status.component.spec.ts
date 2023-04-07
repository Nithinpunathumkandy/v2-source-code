import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditControlStatusComponent } from './audit-control-status.component';

describe('AuditControlStatusComponent', () => {
  let component: AuditControlStatusComponent;
  let fixture: ComponentFixture<AuditControlStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditControlStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditControlStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
