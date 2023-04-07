import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevenColumnLoaderComponent } from './seven-column-loader.component';

describe('SevenColumnLoaderComponent', () => {
  let component: SevenColumnLoaderComponent;
  let fixture: ComponentFixture<SevenColumnLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SevenColumnLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SevenColumnLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
