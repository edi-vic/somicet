export const REGISTRATION_STEPS = {
  0: "no_user",
  1: "otp",
  2: "user_name",
  3: "registration",
  4: "validation",
}

export const REGISTRATION_STATUS = {
  0: "pending",
  1: "approved",
  2: "rejected",
}

export const REGISTRATION_GROUPS = {
  0: {
    code: "no_group",
    copy: "Selecciona uno",
    price: "$0",
  },
  1: {
    code: "investigator",
    copy: "Investigadores",
    price: "$1,000",
  },
  2: {
    code: "student_member",
    copy: "Estudiantes miembros (al año 2019)",
    price: "$200",
  },
  3: {
    code: "student",
    copy: "Estudiantes no miembros",
    price: "$300",
  },
  4: {
    code: "public",
    copy: "Público en general",
    price: "$1,000",
  },
}

export const PROJECT_STEPS = {
  0: "no_user",
}