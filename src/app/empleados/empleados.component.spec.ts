import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { EmpleadosComponent } from './empleados.component';
import { EmpleadosService } from '../servicios/empleados.service';
import { RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

describe('EmpleadosComponent', () => {
  it('loads and saves the existing entity contract through its service', async () => {
    const service = {
      consultartodoEmpleado: vi.fn(() => of([])),
      insertarEmpleado: vi.fn(() => of({})),
      modificarEmpleado: vi.fn(() => of({})),
      eliminarEmpleado: vi.fn(() => of({})),
    };
    await TestBed.configureTestingModule({
      imports: [EmpleadosComponent],
      providers: [{ provide: EmpleadosService, useValue: service }],
    }).compileComponents();
    const fixture = TestBed.createComponent(EmpleadosComponent);
    fixture.detectChanges();
    const workspace = fixture.debugElement.query(By.directive(RecordWorkspaceComponent)).componentInstance as RecordWorkspaceComponent;
    expect(service.consultartodoEmpleado).toHaveBeenCalledTimes(1);
    expect(workspace.config.fields.map(field => field.key)).toEqual(["id","nombre","apellido_paterno","apellido_materno","puesto","sueldo"]);
    workspace.create();
    const payload = {
      "id": "ejemplo",
      "nombre": "ejemplo",
      "apellido_paterno": "ejemplo",
      "apellido_materno": "ejemplo",
      "puesto": "ejemplo",
      "sueldo": "2"
    };
    workspace.draft = { ...payload };
    workspace.save();
    expect(service.insertarEmpleado).toHaveBeenCalledExactlyOnceWith(payload);
    expect(service.modificarEmpleado).not.toHaveBeenCalled();
    expect(service.eliminarEmpleado).not.toHaveBeenCalled();
  });
});
