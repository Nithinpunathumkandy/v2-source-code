import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditCheckListComponent } from './ms-audit-check-list.component';

describe('MsAuditCheckListComponent', () => {
  let component: MsAuditCheckListComponent;
  let fixture: ComponentFixture<MsAuditCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditCheckListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
