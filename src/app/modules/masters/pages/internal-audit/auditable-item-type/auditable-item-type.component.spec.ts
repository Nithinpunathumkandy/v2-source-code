import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemTypeComponent } from './auditable-item-type.component';

describe('AuditableItemTypeComponent', () => {
  let component: AuditableItemTypeComponent;
  let fixture: ComponentFixture<AuditableItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
