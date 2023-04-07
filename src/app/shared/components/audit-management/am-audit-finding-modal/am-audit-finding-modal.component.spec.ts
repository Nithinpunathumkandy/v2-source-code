import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFindingModalComponent } from './am-audit-finding-modal.component';

describe('AmAuditFindingModalComponent', () => {
  let component: AmAuditFindingModalComponent;
  let fixture: ComponentFixture<AmAuditFindingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFindingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFindingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
