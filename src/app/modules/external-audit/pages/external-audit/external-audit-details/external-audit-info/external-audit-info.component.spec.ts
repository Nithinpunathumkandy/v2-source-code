import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditInfoComponent } from './external-audit-info.component';

describe('ExternalAuditInfoComponent', () => {
  let component: ExternalAuditInfoComponent;
  let fixture: ComponentFixture<ExternalAuditInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
