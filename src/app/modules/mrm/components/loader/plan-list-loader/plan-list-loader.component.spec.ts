import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanListLoaderComponent } from './plan-list-loader.component';

describe('PlanListLoaderComponent', () => {
  let component: PlanListLoaderComponent;
  let fixture: ComponentFixture<PlanListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
