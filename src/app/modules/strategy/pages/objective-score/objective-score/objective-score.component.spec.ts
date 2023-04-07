import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveScoreComponent } from './objective-score.component';

describe('ObjectiveScoreComponent', () => {
  let component: ObjectiveScoreComponent;
  let fixture: ComponentFixture<ObjectiveScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
