import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeStructureComponent } from './theme-structure.component';

describe('ThemeStructureComponent', () => {
  let component: ThemeStructureComponent;
  let fixture: ComponentFixture<ThemeStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
