import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditCommencementLetterLoaderComponent } from './am-audit-commencement-letter-loader.component';

describe('AmAuditCommencementLetterLoaderComponent', () => {
  let component: AmAuditCommencementLetterLoaderComponent;
  let fixture: ComponentFixture<AmAuditCommencementLetterLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditCommencementLetterLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditCommencementLetterLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
