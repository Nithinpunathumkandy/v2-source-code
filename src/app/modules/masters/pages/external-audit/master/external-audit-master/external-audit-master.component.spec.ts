import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditMasterComponent } from './external-audit-master.component';

describe('ExternalAuditMasterComponent', () => {
  let component: ExternalAuditMasterComponent;
  let fixture: ComponentFixture<ExternalAuditMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
