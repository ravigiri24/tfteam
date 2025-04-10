import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SyncTractorWithMaintaninanceComponent } from './sync-tractor-with-maintaninance.component';

describe('SyncTractorWithMaintaninanceComponent', () => {
  let component: SyncTractorWithMaintaninanceComponent;
  let fixture: ComponentFixture<SyncTractorWithMaintaninanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncTractorWithMaintaninanceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SyncTractorWithMaintaninanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
