import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditFindingCaTypesComponent } from './ms-audit-finding-ca-types.component';

describe('MsAuditFindingCaTypesComponent', () => {
  let component: MsAuditFindingCaTypesComponent;
  let fixture: ComponentFixture<MsAuditFindingCaTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditFindingCaTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditFindingCaTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
