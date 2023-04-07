import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditProgramsListComponent } from './ms-audit-programs-list.component';

describe('MsAuditProgramsListComponent', () => {
  let component: MsAuditProgramsListComponent;
  let fixture: ComponentFixture<MsAuditProgramsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditProgramsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditProgramsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
