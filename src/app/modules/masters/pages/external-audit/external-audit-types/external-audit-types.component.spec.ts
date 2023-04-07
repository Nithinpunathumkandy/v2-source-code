import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditTypesComponent } from './external-audit-types.component';

describe('ExternalAuditTypesComponent', () => {
  let component: ExternalAuditTypesComponent;
  let fixture: ComponentFixture<ExternalAuditTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
