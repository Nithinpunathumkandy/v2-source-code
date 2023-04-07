import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditUniverseDepartmentListComponent } from './am-audit-universe-department-list.component';

describe('AmAuditUniverseDepartmentListComponent', () => {
  let component: AmAuditUniverseDepartmentListComponent;
  let fixture: ComponentFixture<AmAuditUniverseDepartmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditUniverseDepartmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditUniverseDepartmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
