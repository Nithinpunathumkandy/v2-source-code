import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditComponent } from './am-audit.component';

describe('AmAuditComponent', () => {
  let component: AmAuditComponent;
  let fixture: ComponentFixture<AmAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
