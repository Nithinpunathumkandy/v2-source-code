import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraDetailsComponent } from './hira-details.component';

describe('HiraDetailsComponent', () => {
  let component: HiraDetailsComponent;
  let fixture: ComponentFixture<HiraDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
