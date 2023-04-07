import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCheckListComponent } from './audit-check-list.component';

describe('AuditCheckListComponent', () => {
  let component: AuditCheckListComponent;
  let fixture: ComponentFixture<AuditCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditCheckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
