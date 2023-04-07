import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCountTypeComponent } from './audit-count-type.component';

describe('AuditCountTypeComponent', () => {
  let component: AuditCountTypeComponent;
  let fixture: ComponentFixture<AuditCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
