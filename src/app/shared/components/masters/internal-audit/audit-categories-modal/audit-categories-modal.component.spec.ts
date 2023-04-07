import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCategoriesModalComponent } from './audit-categories-modal.component';

describe('AuditCategoriesModalComponent', () => {
  let component: AuditCategoriesModalComponent;
  let fixture: ComponentFixture<AuditCategoriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditCategoriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
