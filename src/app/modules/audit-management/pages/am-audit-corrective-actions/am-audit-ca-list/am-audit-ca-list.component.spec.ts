import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditCaListComponent } from './am-audit-ca-list.component';

describe('AmAuditCaListComponent', () => {
  let component: AmAuditCaListComponent;
  let fixture: ComponentFixture<AmAuditCaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditCaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditCaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
