import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlansComponent } from './audit-plans.component';

describe('AuditPlansComponent', () => {
  let component: AuditPlansComponent;
  let fixture: ComponentFixture<AuditPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
