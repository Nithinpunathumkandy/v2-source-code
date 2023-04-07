import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillDetailsLoaderComponent } from './mock-drill-details-loader.component';

describe('MockDrillDetailsLoaderComponent', () => {
  let component: MockDrillDetailsLoaderComponent;
  let fixture: ComponentFixture<MockDrillDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
