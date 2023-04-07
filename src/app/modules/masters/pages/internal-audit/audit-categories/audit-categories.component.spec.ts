import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCategoriesComponent } from './audit-categories.component';

describe('AuditCategoriesComponent', () => {
  let component: AuditCategoriesComponent;
  let fixture: ComponentFixture<AuditCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
