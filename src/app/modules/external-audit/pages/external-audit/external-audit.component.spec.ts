import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditComponent } from './external-audit.component';

describe('ExternalAuditComponent', () => {
  let component: ExternalAuditComponent;
  let fixture: ComponentFixture<ExternalAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
