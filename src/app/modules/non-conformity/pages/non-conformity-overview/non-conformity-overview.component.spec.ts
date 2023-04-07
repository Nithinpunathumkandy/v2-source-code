import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConformityOverviewComponent } from './non-conformity-overview.component';

describe('NonConformityOverviewComponent', () => {
  let component: NonConformityOverviewComponent;
  let fixture: ComponentFixture<NonConformityOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConformityOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConformityOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
