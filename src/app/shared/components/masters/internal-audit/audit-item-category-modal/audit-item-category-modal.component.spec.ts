import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditItemCategoryModalComponent } from './audit-item-category-modal.component';

describe('AuditItemCategoryModalComponent', () => {
  let component: AuditItemCategoryModalComponent;
  let fixture: ComponentFixture<AuditItemCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditItemCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditItemCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
