import { Component, inject } from '@angular/core';
import { EmpleadosService } from '../servicios/empleados.service';
import { RecordWorkspace, RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [RecordWorkspaceComponent],
  templateUrl: './empleados.component.html',
})
export class EmpleadosComponent {
  private readonly service = inject(EmpleadosService);
  readonly workspace: RecordWorkspace = {
    title: 'Empleados',
    singular: 'Empleado',
    group: 'Directorio',
    description: 'Consulta y actualiza los datos del equipo de NATOS.',
    nameKey: 'nombre',
    fields: [
      {
        "key": "id",
        "label": "Código",
        "required": true
      },
      {
        "key": "nombre",
        "label": "Nombre",
        "required": true
      },
      {
        "key": "apellido_paterno",
        "label": "Apellido paterno"
      },
      {
        "key": "apellido_materno",
        "label": "Apellido materno"
      },
      {
        "key": "puesto",
        "label": "Puesto",
        "required": true
      },
      {
        "key": "sueldo",
        "label": "Sueldo (MXN)",
        "required": true,
        "kind": "money",
        "min": 0.01
      }
    ],
    list: () => this.service.consultartodoEmpleado(),
    create: record => this.service.insertarEmpleado(record),
    update: record => this.service.modificarEmpleado(record),
    remove: record => this.service.eliminarEmpleado(record),
  };
}
