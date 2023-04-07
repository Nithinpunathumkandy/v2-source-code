import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditPlanLoaderComponent } from './am-audit-plan-loader.component';

describe('AmAuditPlanLoaderComponent', () => {
  let component: AmAuditPlanLoaderComponent;
  let fixture: ComponentFixture<AmAuditPlanLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditPlanLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditPlanLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
