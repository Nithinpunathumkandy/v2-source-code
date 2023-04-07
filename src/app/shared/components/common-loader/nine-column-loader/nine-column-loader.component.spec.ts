import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NineColumnLoaderComponent } from './nine-column-loader.component';

describe('NineColumnLoaderComponent', () => {
  let component: NineColumnLoaderComponent;
  let fixture: ComponentFixture<NineColumnLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NineColumnLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NineColumnLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
