import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TarimasComponent } from './tarimas.component';
import { TarimasService } from '../servicios/tarimas.service';
import { RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

describe('TarimasComponent', () => {
  it('loads and saves the existing entity contract through its service', async () => {
    const service = {
      consultartodoTarima: vi.fn(() => of([])),
      insertarTarima: vi.fn(() => of({})),
      modificarTarima: vi.fn(() => of({})),
      eliminarTarima: vi.fn(() => of({})),
    };
    await TestBed.configureTestingModule({
      imports: [TarimasComponent],
      providers: [{ provide: TarimasService, useValue: service }],
    }).compileComponents();
    const fixture = TestBed.createComponent(TarimasComponent);
    fixture.detectChanges();
    const workspace = fixture.debugElement.query(By.directive(RecordWorkspaceComponent)).componentInstance as RecordWorkspaceComponent;
    expect(service.consultartodoTarima).toHaveBeenCalledTimes(1);
    expect(workspace.config.fields.map(field => field.key)).toEqual(["id","descripcion","tipo","cantidad","precio"]);
    workspace.create();
    const payload = {
      "id": "ejemplo",
      "descripcion": "ejemplo",
      "tipo": "ejemplo",
      "cantidad": "2",
      "precio": "2"
    };
    workspace.draft = { ...payload };
    workspace.save();
    expect(service.insertarTarima).toHaveBeenCalledExactlyOnceWith(payload);
    expect(service.modificarTarima).not.toHaveBeenCalled();
    expect(service.eliminarTarima).not.toHaveBeenCalled();
  });
});
