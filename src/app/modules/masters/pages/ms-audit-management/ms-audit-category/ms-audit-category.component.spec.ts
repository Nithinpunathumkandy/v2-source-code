import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditCategoryComponent } from './ms-audit-category.component';

describe('MsAuditCategoryComponent', () => {
  let component: MsAuditCategoryComponent;
  let fixture: ComponentFixture<MsAuditCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
