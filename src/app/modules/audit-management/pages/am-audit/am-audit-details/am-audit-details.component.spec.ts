import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditDetailsComponent } from './am-audit-details.component';

describe('AmAuditDetailsComponent', () => {
  let component: AmAuditDetailsComponent;
  let fixture: ComponentFixture<AmAuditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
