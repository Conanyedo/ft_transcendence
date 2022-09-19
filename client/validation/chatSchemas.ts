import * as Yup from "yup";

export const chatValidationSchema = Yup.object({
    cName: Yup.string().max(15).min(3).required(),
    password: Yup.string().max(15).min(8),
    members: Yup.array().max(10).min(1).required(),
  });