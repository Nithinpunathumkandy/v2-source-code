import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObjectiveScoreComponent } from './add-objective-score.component';

describe('AddObjectiveScoreComponent', () => {
  let component: AddObjectiveScoreComponent;
  let fixture: ComponentFixture<AddObjectiveScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddObjectiveScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddObjectiveScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
