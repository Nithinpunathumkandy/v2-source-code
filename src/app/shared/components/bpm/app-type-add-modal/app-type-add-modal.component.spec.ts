import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTypeAddModalComponent } from './app-type-add-modal.component';

describe('AppTypeAddModalComponent', () => {
  let component: AppTypeAddModalComponent;
  let fixture: ComponentFixture<AppTypeAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTypeAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTypeAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
