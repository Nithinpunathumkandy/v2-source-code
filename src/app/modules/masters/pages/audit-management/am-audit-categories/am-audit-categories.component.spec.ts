import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditCategoriesComponent } from './am-audit-categories.component';

describe('AmAuditCategoriesComponent', () => {
  let component: AmAuditCategoriesComponent;
  let fixture: ComponentFixture<AmAuditCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
