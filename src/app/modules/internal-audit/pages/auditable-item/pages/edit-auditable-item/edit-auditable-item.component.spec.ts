import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuditableItemComponent } from './edit-auditable-item.component';

describe('EditAuditableItemComponent', () => {
  let component: EditAuditableItemComponent;
  let fixture: ComponentFixture<EditAuditableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAuditableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAuditableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
