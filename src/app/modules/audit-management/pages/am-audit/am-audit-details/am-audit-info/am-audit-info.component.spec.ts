import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditInfoComponent } from './am-audit-info.component';

describe('AmAuditInfoComponent', () => {
  let component: AmAuditInfoComponent;
  let fixture: ComponentFixture<AmAuditInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
