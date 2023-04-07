import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingDetailsDashboardComponent } from './finding-details-dashboard.component';

describe('FindingDetailsDashboardComponent', () => {
  let component: FindingDetailsDashboardComponent;
  let fixture: ComponentFixture<FindingDetailsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingDetailsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingDetailsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
