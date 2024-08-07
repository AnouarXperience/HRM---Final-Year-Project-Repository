import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForVactionComponent } from './request-for-vaction.component';

describe('RequestForVactionComponent', () => {
  let component: RequestForVactionComponent;
  let fixture: ComponentFixture<RequestForVactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestForVactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForVactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
