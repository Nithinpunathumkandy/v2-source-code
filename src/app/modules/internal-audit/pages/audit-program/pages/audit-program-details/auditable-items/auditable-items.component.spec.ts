import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemsComponent } from './auditable-items.component';

describe('AuditableItemsComponent', () => {
  let component: AuditableItemsComponent;
  let fixture: ComponentFixture<AuditableItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
