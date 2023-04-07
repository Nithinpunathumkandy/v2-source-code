import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyProfileFocusAreaNoteComponent } from './strategy-profile-focus-area-note.component';

describe('StrategyProfileFocusAreaNoteComponent', () => {
  let component: StrategyProfileFocusAreaNoteComponent;
  let fixture: ComponentFixture<StrategyProfileFocusAreaNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyProfileFocusAreaNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyProfileFocusAreaNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
