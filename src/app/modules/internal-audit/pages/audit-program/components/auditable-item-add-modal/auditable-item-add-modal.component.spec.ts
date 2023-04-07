import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemAddModalComponent } from './auditable-item-add-modal.component';

describe('AuditableItemAddModalComponent', () => {
  let component: AuditableItemAddModalComponent;
  let fixture: ComponentFixture<AuditableItemAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
