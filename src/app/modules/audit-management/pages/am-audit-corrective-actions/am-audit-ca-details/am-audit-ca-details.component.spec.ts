import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditCaDetailsComponent } from './am-audit-ca-details.component';

describe('AmAuditCaDetailsComponent', () => {
  let component: AmAuditCaDetailsComponent;
  let fixture: ComponentFixture<AmAuditCaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditCaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditCaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
