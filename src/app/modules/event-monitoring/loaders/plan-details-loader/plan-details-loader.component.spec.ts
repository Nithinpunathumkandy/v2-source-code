import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDetailsLoaderComponent } from './plan-details-loader.component';

describe('PlanDetailsLoaderComponent', () => {
  let component: PlanDetailsLoaderComponent;
  let fixture: ComponentFixture<PlanDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
