import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAuditPlanDetialsLoaderComponent } from './ng-audit-plan-detials-loader.component';

describe('NgAuditPlanDetialsLoaderComponent', () => {
  let component: NgAuditPlanDetialsLoaderComponent;
  let fixture: ComponentFixture<NgAuditPlanDetialsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgAuditPlanDetialsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgAuditPlanDetialsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
