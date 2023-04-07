import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditableItemComponent } from './add-auditable-item.component';

describe('AddAuditableItemComponent', () => {
  let component: AddAuditableItemComponent;
  let fixture: ComponentFixture<AddAuditableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAuditableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuditableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
