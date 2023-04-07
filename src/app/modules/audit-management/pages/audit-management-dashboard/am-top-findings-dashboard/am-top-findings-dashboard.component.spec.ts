import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmTopFindingsDashboardComponent } from './am-top-findings-dashboard.component';

describe('AmTopFindingsDashboardComponent', () => {
  let component: AmTopFindingsDashboardComponent;
  let fixture: ComponentFixture<AmTopFindingsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmTopFindingsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmTopFindingsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
