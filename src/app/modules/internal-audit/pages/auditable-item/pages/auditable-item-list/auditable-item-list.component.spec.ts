import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemListComponent } from './auditable-item-list.component';

describe('AuditableItemListComponent', () => {
  let component: AuditableItemListComponent;
  let fixture: ComponentFixture<AuditableItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
