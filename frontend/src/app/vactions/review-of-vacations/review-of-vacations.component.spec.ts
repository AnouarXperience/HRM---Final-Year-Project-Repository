import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOfVacationsComponent } from './review-of-vacations.component';

describe('ReviewOfVacationsComponent', () => {
  let component: ReviewOfVacationsComponent;
  let fixture: ComponentFixture<ReviewOfVacationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewOfVacationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewOfVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
