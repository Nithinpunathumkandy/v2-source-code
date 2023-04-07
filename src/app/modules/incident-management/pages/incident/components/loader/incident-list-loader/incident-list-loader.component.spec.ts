import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentListLoaderComponent } from './incident-list-loader.component';

describe('IncidentListLoaderComponent', () => {
  let component: IncidentListLoaderComponent;
  let fixture: ComponentFixture<IncidentListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
