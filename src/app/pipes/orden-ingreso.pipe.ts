import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../modelos/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] { //Este pipe lo voy a usar para ordenar la lista de detalle
    return items.sort((a, b) => {

      if (a.tipo === 'ingreso') {
        return -1;
      } else {
        return 1; //Los ingresos quedaran arriba y los egresos abajo
      }

    });
  }

}
