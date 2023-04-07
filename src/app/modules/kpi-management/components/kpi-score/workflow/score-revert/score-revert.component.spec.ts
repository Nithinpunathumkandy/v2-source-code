import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreRevertComponent } from './score-revert.component';

describe('ScoreRevertComponent', () => {
  let component: ScoreRevertComponent;
  let fixture: ComponentFixture<ScoreRevertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreRevertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreRevertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
