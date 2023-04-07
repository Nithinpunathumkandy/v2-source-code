import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingListComponent } from './audit-finding-list.component';

describe('AuditFindingListComponent', () => {
  let component: AuditFindingListComponent;
  let fixture: ComponentFixture<AuditFindingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditFindingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
