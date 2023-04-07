import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmBySectionComponent } from './hm-by-section.component';

describe('HmBySectionComponent', () => {
  let component: HmBySectionComponent;
  let fixture: ComponentFixture<HmBySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmBySectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmBySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
