import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFieldWorksComponent } from './am-audit-field-works.component';

describe('AmAuditFieldWorksComponent', () => {
  let component: AmAuditFieldWorksComponent;
  let fixture: ComponentFixture<AmAuditFieldWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFieldWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFieldWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
