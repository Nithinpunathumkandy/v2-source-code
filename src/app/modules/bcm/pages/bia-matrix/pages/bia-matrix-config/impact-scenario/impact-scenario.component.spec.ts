import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactScenarioComponent } from './impact-scenario.component';

describe('ImpactScenarioComponent', () => {
  let component: ImpactScenarioComponent;
  let fixture: ComponentFixture<ImpactScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactScenarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
