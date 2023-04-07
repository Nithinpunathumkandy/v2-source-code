import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDetailsLoaderComponent } from './control-details-loader.component';

describe('ControlDetailsLoaderComponent', () => {
  let component: ControlDetailsLoaderComponent;
  let fixture: ComponentFixture<ControlDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
