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
  const [sedeSeleccionada, setSedeSeleccionada] = useState(""); // Almacenamos el ID de la sede
  const [items, setItems] = useState([]);
  const [sedes, setSedes] = useState([]);

  // Efecto para cargar las sedes al iniciar el componente
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await fetch(
          "https://gestion-83lw.onrender.com/api/sedes"
        );
        const data = await response.json();
        console.log(data);
        setSedes(data);
      } catch (error) {
        console.error("Error al obtener las sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  // Efecto para cargar los ítems cuando se selecciona una sede
  useEffect(() => {
    if (sedeSeleccionada) {
      console.log("Sede seleccionada (ID):", sedeSeleccionada); // Muestra el ID de la sede
      const fetchItems = async () => {
        try {
          const response = await fetch(
            `https://gestion-83lw.onrender.com/api/items-sede/sede/${sedeSeleccionada}` // Ahora utilizamos el ID de la sede
          );
          const data = await response.json();
          console.log(data);
          setItems(data);
        } catch (error) {
          console.error("Error al obtener los ítems:", error);
        }
      };
      fetchItems();
    }
  }, [sedeSeleccionada]); // Cambió de dependencia: escuchamos cambios del ID, no del nombre

  return (
    <div className="grid place-items-center mt-4 px-6 pl-3 text-left font-normal ">
      <div className="w-1/3 space-y-6 mb-2">
        {sedes.length > 0 ? (
          <Select
            value={sedeSeleccionada}
            onValueChange={setSedeSeleccionada} // Actualiza con el ID de la sede
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar sede" />
            </SelectTrigger>
            <SelectContent>
              {sedes.map((sede) => (
                <SelectItem key={sede.id} value={sede.id}>
                  {" "}
                  {/* Aquí usamos el id */}
                  {sede.sede} {/* Mostramos el nombre de la sede */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>Cargando sedes...</p>
        )}
      </div>

      {items.length > 0 ? (
        <>
          <div className="w-2/3 space-y-6 mb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Ítem</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Imagen</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item.nombre}</TableCell>
                    <TableCell>{item.item.descripcion}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <img
                      src={item.item.imagenUrl}
                      alt={item.item.nombre}
                      className="w-12 h-12 border-2 border-gray-300 rounded-md my-2"
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <p>No hay ítems en esta sede.</p>
      )}
    </div>
  );
}
