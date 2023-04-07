import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingsListComponent } from './audit-findings-list.component';

describe('AuditFindingsListComponent', () => {
  let component: AuditFindingsListComponent;
  let fixture: ComponentFixture<AuditFindingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditFindingsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
