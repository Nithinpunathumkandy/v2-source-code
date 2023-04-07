import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditStatusesComponent } from './audit-statuses.component';

describe('AuditStatusesComponent', () => {
  let component: AuditStatusesComponent;
  let fixture: ComponentFixture<AuditStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
