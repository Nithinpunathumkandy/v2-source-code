import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemForFindingsComponent } from './auditable-item-for-findings.component';

describe('AuditableItemForFindingsComponent', () => {
  let component: AuditableItemForFindingsComponent;
  let fixture: ComponentFixture<AuditableItemForFindingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditableItemForFindingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemForFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
