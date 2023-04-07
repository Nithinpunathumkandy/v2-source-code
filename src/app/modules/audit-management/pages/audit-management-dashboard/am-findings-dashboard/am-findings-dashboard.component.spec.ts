import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmFindingsDashboardComponent } from './am-findings-dashboard.component';

describe('AmFindingsDashboardComponent', () => {
  let component: AmFindingsDashboardComponent;
  let fixture: ComponentFixture<AmFindingsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmFindingsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmFindingsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
