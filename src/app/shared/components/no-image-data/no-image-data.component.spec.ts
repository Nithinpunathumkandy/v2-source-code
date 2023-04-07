import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoImageDataComponent } from './no-image-data.component';

describe('NoImageDataComponent', () => {
  let component: NoImageDataComponent;
  let fixture: ComponentFixture<NoImageDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoImageDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoImageDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
