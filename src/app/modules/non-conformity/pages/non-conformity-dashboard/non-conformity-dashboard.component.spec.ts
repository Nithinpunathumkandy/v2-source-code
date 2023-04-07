import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConformityDashboardComponent } from './non-conformity-dashboard.component';

describe('NonConformityDashboardComponent', () => {
  let component: NonConformityDashboardComponent;
  let fixture: ComponentFixture<NonConformityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConformityDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConformityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
