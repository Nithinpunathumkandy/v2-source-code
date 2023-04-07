import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditCommencementLetterComponent } from './am-audit-commencement-letter.component';

describe('AmAuditCommencementLetterComponent', () => {
  let component: AmAuditCommencementLetterComponent;
  let fixture: ComponentFixture<AmAuditCommencementLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditCommencementLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditCommencementLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
