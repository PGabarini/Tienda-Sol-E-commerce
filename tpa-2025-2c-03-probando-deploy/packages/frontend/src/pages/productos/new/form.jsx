import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import "./style.css";
import { TagInput } from "../../../components/Tag";

const productoSchema = z.object({
  titulo: z.string().min(3, "Título muy corto").max(200, "Título muy largo"),
  descripcion: z.string().min(5, "Descripción muy corta").max(150, "Descripción muy larga"),
  categorias: z.string().min(5, "Categoria muy corta").max(20, "Categoría muy larga").array(),
  precio: z.number("El precio debe ser un número").positive("Debe tener precio"),
  moneda: z.string().nonempty("Debe tener moneda"),
  stock: z.number("El stock debe ser un número").int("El stock debe ser un entero").positive("Debe tener stock"),
  fotos: z.string().array(),
});

export default function ProductoForm({ onSubmit }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      categorias: [],
      moneda: "",
      fotos: [],
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="producto-form">

      <input {...register("titulo")} placeholder="Título" />
      {errors.titulo && <p className="error-message">{errors.titulo.message}</p>}

      <textarea {...register("descripcion")} placeholder="Descripción" />
      {errors.descripcion && <p className="error-message">{errors.descripcion.message}</p>}

      <Controller
        control={control}
        name="categorias"
        render={({ field }) => (
          <TagInput values={field.value} setValues={field.onChange} placeholder="Categorías" />
        )}
      />
      {errors.categorias && <p className="error-message">{errors.categorias.message}</p>}

      <input type="number" step="1" {...register("precio", { valueAsNumber: true })} placeholder="Precio" />
      {errors.precio && <p className="error-message">{errors.precio.message}</p>}

      <label>
        <span>Moneda</span>
        <select {...register("moneda")}>
          <option value="">Selecciona una moneda</option>
          <option value="PESO_ARG">ARS - Peso argentino</option>
          <option value="DOLAR_USA">USD - Dólar</option>
          <option value="REAL">EUR - Euro</option>
        </select>
        {errors.moneda && <p className="error-message">{errors.moneda.message}</p>}
      </label>

      <input type="number" {...register("stock", { valueAsNumber: true })} placeholder="Stock" />
      {errors.stock && <p className="error-message">{errors.stock.message}</p>}

      <Controller
        control={control}
        name="fotos"
        render={({ field }) => (
          <TagInput values={field.value} setValues={field.onChange} placeholder="Fotos URLs" />
        )}
      />
      {errors.fotos && <p className="error-message">{errors.fotos.message}</p>}

      <button type="submit">
        Crear Producto
      </button>
    </form>
  );
}

export { ProductoForm as Component };
