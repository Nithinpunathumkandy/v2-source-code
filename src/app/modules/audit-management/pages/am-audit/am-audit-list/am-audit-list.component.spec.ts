import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditListComponent } from './am-audit-list.component';

describe('AmAuditListComponent', () => {
  let component: AmAuditListComponent;
  let fixture: ComponentFixture<AmAuditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
