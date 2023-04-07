import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingInfoComponent } from './audit-finding-info.component';

describe('AuditFindingInfoComponent', () => {
  let component: AuditFindingInfoComponent;
  let fixture: ComponentFixture<AuditFindingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditFindingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
