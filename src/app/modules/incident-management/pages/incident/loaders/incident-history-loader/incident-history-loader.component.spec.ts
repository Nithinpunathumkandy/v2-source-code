import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentHistoryLoaderComponent } from './incident-history-loader.component';

describe('IncidentHistoryLoaderComponent', () => {
  let component: IncidentHistoryLoaderComponent;
  let fixture: ComponentFixture<IncidentHistoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentHistoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentHistoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
