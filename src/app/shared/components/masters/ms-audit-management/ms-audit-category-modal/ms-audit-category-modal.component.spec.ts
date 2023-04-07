import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditCategoryModalComponent } from './ms-audit-category-modal.component';

describe('MsAuditCategoryModalComponent', () => {
  let component: MsAuditCategoryModalComponent;
  let fixture: ComponentFixture<MsAuditCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
