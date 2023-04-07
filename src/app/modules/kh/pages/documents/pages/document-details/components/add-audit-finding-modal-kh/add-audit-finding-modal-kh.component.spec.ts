import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditFindingModalKhComponent } from './add-audit-finding-modal-kh.component';

describe('AddAuditFindingModalKhComponent', () => {
  let component: AddAuditFindingModalKhComponent;
  let fixture: ComponentFixture<AddAuditFindingModalKhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAuditFindingModalKhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuditFindingModalKhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
