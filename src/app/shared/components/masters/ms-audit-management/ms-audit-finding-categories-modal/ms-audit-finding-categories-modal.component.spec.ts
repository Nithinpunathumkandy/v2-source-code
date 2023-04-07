import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditFindingCategoriesModalComponent } from './ms-audit-finding-categories-modal.component';

describe('MsAuditFindingCategoriesModalComponent', () => {
  let component: MsAuditFindingCategoriesModalComponent;
  let fixture: ComponentFixture<MsAuditFindingCategoriesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditFindingCategoriesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditFindingCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
