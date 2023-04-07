import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingObjectiveInfoLoaderComponent } from './mapping-objective-info-loader.component';

describe('MappingObjectiveInfoLoaderComponent', () => {
  let component: MappingObjectiveInfoLoaderComponent;
  let fixture: ComponentFixture<MappingObjectiveInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingObjectiveInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingObjectiveInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
