import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStrategicThemeComponent } from './add-strategic-theme.component';

describe('AddStrategicThemeComponent', () => {
  let component: AddStrategicThemeComponent;
  let fixture: ComponentFixture<AddStrategicThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStrategicThemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStrategicThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
