import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceTypeComponent } from './space-type.component';

describe('SpaceTypeComponent', () => {
  let component: SpaceTypeComponent;
  let fixture: ComponentFixture<SpaceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
