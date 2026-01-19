import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TarritoryManagerFooterComponent } from './tarritory-manager-footer.component';

describe('TarritoryManagerFooterComponent', () => {
  let component: TarritoryManagerFooterComponent;
  let fixture: ComponentFixture<TarritoryManagerFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarritoryManagerFooterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TarritoryManagerFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
