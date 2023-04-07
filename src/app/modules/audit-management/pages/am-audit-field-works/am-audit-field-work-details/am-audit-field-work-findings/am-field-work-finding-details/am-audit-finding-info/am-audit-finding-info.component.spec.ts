import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFindingInfoComponent } from './am-audit-finding-info.component';

describe('AmAuditFindingInfoComponent', () => {
  let component: AmAuditFindingInfoComponent;
  let fixture: ComponentFixture<AmAuditFindingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFindingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFindingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
