import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemComponent } from './auditable-item.component';

describe('AuditableItemComponent', () => {
  let component: AuditableItemComponent;
  let fixture: ComponentFixture<AuditableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
