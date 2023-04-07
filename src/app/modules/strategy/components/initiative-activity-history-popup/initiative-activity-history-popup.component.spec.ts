import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeActivityHistoryPopupComponent } from './initiative-activity-history-popup.component';

describe('InitiativeActivityHistoryPopupComponent', () => {
  let component: InitiativeActivityHistoryPopupComponent;
  let fixture: ComponentFixture<InitiativeActivityHistoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiativeActivityHistoryPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeActivityHistoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
