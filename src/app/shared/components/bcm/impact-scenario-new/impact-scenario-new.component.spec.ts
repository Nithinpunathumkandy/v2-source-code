import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactScenarioNewComponent } from './impact-scenario-new.component';

describe('ImpactScenarioNewComponent', () => {
  let component: ImpactScenarioNewComponent;
  let fixture: ComponentFixture<ImpactScenarioNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactScenarioNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactScenarioNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
