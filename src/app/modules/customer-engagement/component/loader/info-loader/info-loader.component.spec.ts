import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLoaderComponent } from './info-loader.component';

describe('InfoLoaderComponent', () => {
  let component: InfoLoaderComponent;
  let fixture: ComponentFixture<InfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
