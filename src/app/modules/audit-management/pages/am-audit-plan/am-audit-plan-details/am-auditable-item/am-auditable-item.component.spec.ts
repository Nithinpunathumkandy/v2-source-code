import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditableItemComponent } from './am-auditable-item.component';

describe('AmAuditableItemComponent', () => {
  let component: AmAuditableItemComponent;
  let fixture: ComponentFixture<AmAuditableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditableItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
