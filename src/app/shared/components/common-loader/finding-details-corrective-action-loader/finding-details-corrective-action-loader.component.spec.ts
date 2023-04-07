import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingDetailsCorrectiveActionLoaderComponent } from './finding-details-corrective-action-loader.component';

describe('FindingDetailsCorrectiveActionLoaderComponent', () => {
  let component: FindingDetailsCorrectiveActionLoaderComponent;
  let fixture: ComponentFixture<FindingDetailsCorrectiveActionLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingDetailsCorrectiveActionLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingDetailsCorrectiveActionLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
