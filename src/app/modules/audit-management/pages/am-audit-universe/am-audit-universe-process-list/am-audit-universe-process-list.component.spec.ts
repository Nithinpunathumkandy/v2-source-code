import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditUniverseProcessListComponent } from './am-audit-universe-process-list.component';

describe('AmAuditUniverseProcessListComponent', () => {
  let component: AmAuditUniverseProcessListComponent;
  let fixture: ComponentFixture<AmAuditUniverseProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditUniverseProcessListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditUniverseProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
