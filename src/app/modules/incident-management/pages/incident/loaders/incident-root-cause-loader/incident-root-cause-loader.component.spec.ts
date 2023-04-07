import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentRootCauseLoaderComponent } from './incident-root-cause-loader.component';

describe('IncidentRootCauseLoaderComponent', () => {
  let component: IncidentRootCauseLoaderComponent;
  let fixture: ComponentFixture<IncidentRootCauseLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentRootCauseLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentRootCauseLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
