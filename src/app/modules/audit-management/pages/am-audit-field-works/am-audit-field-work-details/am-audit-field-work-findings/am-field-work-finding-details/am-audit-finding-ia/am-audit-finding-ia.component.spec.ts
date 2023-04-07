import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFindingIaComponent } from './am-audit-finding-ia.component';

describe('AmAuditFindingIaComponent', () => {
  let component: AmAuditFindingIaComponent;
  let fixture: ComponentFixture<AmAuditFindingIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFindingIaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFindingIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
