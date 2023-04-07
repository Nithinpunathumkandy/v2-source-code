import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceTypeModalComponent } from './space-type-modal.component';

describe('SpaceTypeModalComponent', () => {
  let component: SpaceTypeModalComponent;
  let fixture: ComponentFixture<SpaceTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
