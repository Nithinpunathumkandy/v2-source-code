import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingCategoriesComponent } from './audit-finding-categories.component';

describe('AuditFindingCategoriesComponent', () => {
  let component: AuditFindingCategoriesComponent;
  let fixture: ComponentFixture<AuditFindingCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditFindingCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
