import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemlogDetailsLoaderComponent } from './systemlog-details-loader.component';

describe('SystemlogDetailsLoaderComponent', () => {
  let component: SystemlogDetailsLoaderComponent;
  let fixture: ComponentFixture<SystemlogDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemlogDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemlogDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
