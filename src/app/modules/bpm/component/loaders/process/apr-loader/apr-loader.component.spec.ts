import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprLoaderComponent } from './apr-loader.component';

describe('AprLoaderComponent', () => {
  let component: AprLoaderComponent;
  let fixture: ComponentFixture<AprLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
