import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EaFindingAddComponent } from './ea-finding-add.component';

describe('EaFindingAddComponent', () => {
  let component: EaFindingAddComponent;
  let fixture: ComponentFixture<EaFindingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EaFindingAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EaFindingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
