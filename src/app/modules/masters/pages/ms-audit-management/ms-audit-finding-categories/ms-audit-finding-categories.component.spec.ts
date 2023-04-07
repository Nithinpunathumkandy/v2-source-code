import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditFindingCategoriesComponent } from './ms-audit-finding-categories.component';

describe('MsAuditFindingCategoriesComponent', () => {
  let component: MsAuditFindingCategoriesComponent;
  let fixture: ComponentFixture<MsAuditFindingCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditFindingCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditFindingCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
