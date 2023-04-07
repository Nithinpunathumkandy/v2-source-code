import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemModalComponent } from './auditable-item-modal.component';

describe('AuditableItemModalComponent', () => {
  let component: AuditableItemModalComponent;
  let fixture: ComponentFixture<AuditableItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
