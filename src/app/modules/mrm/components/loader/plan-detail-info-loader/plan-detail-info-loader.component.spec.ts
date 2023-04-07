import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDetailInfoLoaderComponent } from './plan-detail-info-loader.component';

describe('PlanDetailInfoLoaderComponent', () => {
  let component: PlanDetailInfoLoaderComponent;
  let fixture: ComponentFixture<PlanDetailInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanDetailInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDetailInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
