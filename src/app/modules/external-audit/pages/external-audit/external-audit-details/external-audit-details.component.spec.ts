import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditDetailsComponent } from './external-audit-details.component';

describe('ExternalAuditDetailsComponent', () => {
  let component: ExternalAuditDetailsComponent;
  let fixture: ComponentFixture<ExternalAuditDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
