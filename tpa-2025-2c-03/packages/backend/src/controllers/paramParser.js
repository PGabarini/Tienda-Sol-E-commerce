import mongoose from "mongoose";
import z from "zod";

export const ObjectId= z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))

export const EstadoBooleano = z.enum(["true", "false"]).transform(val => val === "true");
