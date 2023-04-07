import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFindingCaComponent } from './am-audit-finding-ca.component';

describe('AmAuditFindingCaComponent', () => {
  let component: AmAuditFindingCaComponent;
  let fixture: ComponentFixture<AmAuditFindingCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFindingCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFindingCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
