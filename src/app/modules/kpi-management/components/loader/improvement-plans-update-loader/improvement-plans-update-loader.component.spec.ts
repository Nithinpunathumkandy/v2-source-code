import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlansUpdateLoaderComponent } from './improvement-plans-update-loader.component';

describe('ImprovementPlansUpdateLoaderComponent', () => {
  let component: ImprovementPlansUpdateLoaderComponent;
  let fixture: ComponentFixture<ImprovementPlansUpdateLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlansUpdateLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlansUpdateLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
