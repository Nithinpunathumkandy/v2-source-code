import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFieldWorkListComponent } from './am-audit-field-work-list.component';

describe('AmAuditFieldWorkListComponent', () => {
  let component: AmAuditFieldWorkListComponent;
  let fixture: ComponentFixture<AmAuditFieldWorkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFieldWorkListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFieldWorkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
