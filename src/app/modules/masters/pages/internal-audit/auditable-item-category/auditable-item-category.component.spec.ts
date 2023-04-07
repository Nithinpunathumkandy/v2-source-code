import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemCategoryComponent } from './auditable-item-category.component';

describe('AuditableItemCategoryComponent', () => {
  let component: AuditableItemCategoryComponent;
  let fixture: ComponentFixture<AuditableItemCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
