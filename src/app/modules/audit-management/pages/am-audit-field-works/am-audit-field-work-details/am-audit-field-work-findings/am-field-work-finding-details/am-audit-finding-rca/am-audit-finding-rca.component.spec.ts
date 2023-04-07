import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFindingRcaComponent } from './am-audit-finding-rca.component';

describe('AmAuditFindingRcaComponent', () => {
  let component: AmAuditFindingRcaComponent;
  let fixture: ComponentFixture<AmAuditFindingRcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFindingRcaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFindingRcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
