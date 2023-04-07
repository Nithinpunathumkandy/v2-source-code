import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmOverviewComponent } from './bpm-overview.component';

describe('BpmOverviewComponent', () => {
  let component: BpmOverviewComponent;
  let fixture: ComponentFixture<BpmOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
