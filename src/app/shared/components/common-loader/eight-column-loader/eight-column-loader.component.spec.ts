import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EightColumnLoaderComponent } from './eight-column-loader.component';

describe('EightColumnLoaderComponent', () => {
  let component: EightColumnLoaderComponent;
  let fixture: ComponentFixture<EightColumnLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EightColumnLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EightColumnLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
