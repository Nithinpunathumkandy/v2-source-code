import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditTypesModalComponent } from './external-audit-types-modal.component';

describe('ExternalAuditTypesModalComponent', () => {
  let component: ExternalAuditTypesModalComponent;
  let fixture: ComponentFixture<ExternalAuditTypesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditTypesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditTypesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
