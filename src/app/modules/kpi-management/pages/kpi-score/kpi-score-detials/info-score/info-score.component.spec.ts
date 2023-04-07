import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoScoreComponent } from './info-score.component';

describe('InfoScoreComponent', () => {
  let component: InfoScoreComponent;
  let fixture: ComponentFixture<InfoScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
