import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditCountListComponent } from './am-audit-count-list.component';

describe('AmAuditCountListComponent', () => {
  let component: AmAuditCountListComponent;
  let fixture: ComponentFixture<AmAuditCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
