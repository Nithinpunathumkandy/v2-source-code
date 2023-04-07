import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditUniverseRiskListComponent } from './am-audit-universe-risk-list.component';

describe('AmAuditUniverseRiskListComponent', () => {
  let component: AmAuditUniverseRiskListComponent;
  let fixture: ComponentFixture<AmAuditUniverseRiskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditUniverseRiskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditUniverseRiskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
