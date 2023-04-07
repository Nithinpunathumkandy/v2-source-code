import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryLoaderComponent } from './history-loader.component';

describe('HistoryLoaderComponent', () => {
  let component: HistoryLoaderComponent;
  let fixture: ComponentFixture<HistoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
