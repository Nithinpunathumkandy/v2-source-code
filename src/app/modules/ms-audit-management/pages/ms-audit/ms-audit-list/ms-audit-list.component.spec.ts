import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditListComponent } from './ms-audit-list.component';

describe('MsAuditListComponent', () => {
  let component: MsAuditListComponent;
  let fixture: ComponentFixture<MsAuditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
