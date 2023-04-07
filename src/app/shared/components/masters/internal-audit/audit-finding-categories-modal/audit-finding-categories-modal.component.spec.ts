import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingCategoriesModalComponent } from './audit-finding-categories-modal.component';

describe('AuditFindingCategoriesModalComponent', () => {
  let component: AuditFindingCategoriesModalComponent;
  let fixture: ComponentFixture<AuditFindingCategoriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditFindingCategoriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
