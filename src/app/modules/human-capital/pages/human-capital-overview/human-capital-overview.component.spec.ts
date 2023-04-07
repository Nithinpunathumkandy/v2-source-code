import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanCapitalOverviewComponent } from './human-capital-overview.component';

describe('HumanCapitalOverviewComponent', () => {
  let component: HumanCapitalOverviewComponent;
  let fixture: ComponentFixture<HumanCapitalOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HumanCapitalOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanCapitalOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
