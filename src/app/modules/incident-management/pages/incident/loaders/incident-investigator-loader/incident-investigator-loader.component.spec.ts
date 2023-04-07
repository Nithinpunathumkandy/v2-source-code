import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentInvestigatorLoaderComponent } from './incident-investigator-loader.component';

describe('IncidentInvestigatorLoaderComponent', () => {
  let component: IncidentInvestigatorLoaderComponent;
  let fixture: ComponentFixture<IncidentInvestigatorLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentInvestigatorLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentInvestigatorLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
