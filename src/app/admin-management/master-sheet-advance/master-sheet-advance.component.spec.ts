import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MasterSheetAdvanceComponent } from './master-sheet-advance.component';

describe('MasterSheetAdvanceComponent', () => {
  let component: MasterSheetAdvanceComponent;
  let fixture: ComponentFixture<MasterSheetAdvanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSheetAdvanceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterSheetAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
