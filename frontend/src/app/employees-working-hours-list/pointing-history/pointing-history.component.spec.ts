import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointingHistoryComponent } from './pointing-history.component';

describe('PointingHistoryComponent', () => {
  let component: PointingHistoryComponent;
  let fixture: ComponentFixture<PointingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointingHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
