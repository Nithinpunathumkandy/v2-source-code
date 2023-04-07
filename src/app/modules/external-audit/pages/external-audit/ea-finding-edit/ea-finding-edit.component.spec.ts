import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EaFindingEditComponent } from './ea-finding-edit.component';

describe('EaFindingEditComponent', () => {
  let component: EaFindingEditComponent;
  let fixture: ComponentFixture<EaFindingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EaFindingEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EaFindingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
