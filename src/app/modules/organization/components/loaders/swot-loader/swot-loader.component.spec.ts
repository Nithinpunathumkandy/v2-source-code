import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwotLoaderComponent } from './swot-loader.component';

describe('SwotLoaderComponent', () => {
  let component: SwotLoaderComponent;
  let fixture: ComponentFixture<SwotLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwotLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwotLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
