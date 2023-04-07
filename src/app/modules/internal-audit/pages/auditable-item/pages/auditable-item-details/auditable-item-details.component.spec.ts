import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemDetailsComponent } from './auditable-item-details.component';

describe('AuditableItemDetailsComponent', () => {
  let component: AuditableItemDetailsComponent;
  let fixture: ComponentFixture<AuditableItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
