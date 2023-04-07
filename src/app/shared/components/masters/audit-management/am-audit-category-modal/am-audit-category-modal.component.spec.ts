import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditCategoryModalComponent } from './am-audit-category-modal.component';

describe('AmAuditCategoryModalComponent', () => {
  let component: AmAuditCategoryModalComponent;
  let fixture: ComponentFixture<AmAuditCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
