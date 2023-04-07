import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFieldWorkInfoComponent } from './am-audit-field-work-info.component';

describe('AmAuditFieldWorkInfoComponent', () => {
  let component: AmAuditFieldWorkInfoComponent;
  let fixture: ComponentFixture<AmAuditFieldWorkInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFieldWorkInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFieldWorkInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
