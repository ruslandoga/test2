import * as yup from "yup";

const regSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  username: yup.string().required(),
  password: yup.string().required(),
  passwordConfirm: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Passwords do not match"),
});

export { regSchema };