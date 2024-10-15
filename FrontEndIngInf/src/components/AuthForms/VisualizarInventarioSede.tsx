import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export function VisualizarInventarioSede() {
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (sedeSeleccionada) {
      // Aquí puedes hacer la llamada a tu API para obtener los ítems de la sede seleccionada
      const fetchItems = async () => {
        const response = await fetch(`/api/items?sede=${sedeSeleccionada}`);
        const data = await response.json();
        setItems(data);
      };
      fetchItems();
    }
  }, [sedeSeleccionada]);

  return (
    <div className="grid place-items-center mt-4 px-6 pl-3 text-left font-normal ">
      <div className="w-1/3 space-y-6 mb-2">
        <Select value={sedeSeleccionada} onValueChange={setSedeSeleccionada}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar sede" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sede 1">Sede 1</SelectItem>
            <SelectItem value="Sede 2">Sede 2</SelectItem>
            {/* Agregar más sedes dinámicamente */}
          </SelectContent>
        </Select>
      </div>
      {items.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Ítem</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Cantidad</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No hay ítems en esta sede.</p>
      )}
    </div>
  );
}
