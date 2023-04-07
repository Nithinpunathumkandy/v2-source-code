import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingLoaderComponent } from './pending-loader.component';

describe('PendingLoaderComponent', () => {
  let component: PendingLoaderComponent;
  let fixture: ComponentFixture<PendingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
