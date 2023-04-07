import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCountListComponent } from './audit-count-list.component';

describe('AuditCountListComponent', () => {
  let component: AuditCountListComponent;
  let fixture: ComponentFixture<AuditCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
