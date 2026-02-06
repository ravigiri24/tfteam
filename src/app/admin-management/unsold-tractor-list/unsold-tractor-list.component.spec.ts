import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnsoldTractorListComponent } from './unsold-tractor-list.component';

describe('UnsoldTractorListComponent', () => {
  let component: UnsoldTractorListComponent;
  let fixture: ComponentFixture<UnsoldTractorListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsoldTractorListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnsoldTractorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
