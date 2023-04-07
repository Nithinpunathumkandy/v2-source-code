import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlansListComponent } from './ms-audit-plans-list.component';

describe('MsAuditPlansListComponent', () => {
  let component: MsAuditPlansListComponent;
  let fixture: ComponentFixture<MsAuditPlansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlansListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
