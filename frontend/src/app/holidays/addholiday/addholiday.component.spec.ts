import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddholidayComponent } from './addholiday.component';

describe('AddholidayComponent', () => {
  let component: AddholidayComponent;
  let fixture: ComponentFixture<AddholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddholidayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
