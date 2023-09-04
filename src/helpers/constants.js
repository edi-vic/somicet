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

export const REGISTRATION_STATUS_FULL = {
  0: {
    code: "no_status",
    copy: "Estado",
  },
  1: {
    code: "pending",
    copy: "Pendiente",
  },
  2: {
    code: "approved",
    copy: "Aprobado",
  },
  3: {
    code: "rejected",
    copy: "Rechazado",
  },
}

export const REGISTRATION_GROUPS = {
  0: {
    code: "no_group",
    copy: "Grupo",
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
    price: "$300",
  },
  3: {
    code: "student",
    copy: "Estudiantes no miembros",
    price: "$400",
  },
  4: {
    code: "public",
    copy: "Público en general",
    price: "$1,000",
  },
}

export const BILL_STATUS = {
  0: {
    code: "no_status",
    copy: "Estado",
  },
  1: {
    code: "pending",
    copy: "Pendiente",
  },
  2: {
    code: "approved",
    copy: "Enviada",
  },
  // 3: {
  //   code: "rejected",
  //   copy: "Rechazada",
  // },
}

export const POSTER_STATUS = {
  0: {
    code: "no_status",
    copy: "Estado",
  },
  1: {
    code: "pending",
    copy: "Pendiente",
  },
  2: {
    code: "approved",
    copy: "Aprobado",
  },
  3: {
    code: "rejected",
    copy: "Rechazada",
  },
}

export const POSTER_THEMES = {
  0: {
    code: "no_theme",
    copy: "Tema",
    short_copy: "Tema",
  },
  1: {
    code: "pluripotent",
    copy: "Células Troncales Pluripotenciales",
    short_copy: "Pluripotenciales",
  },
  2: {
    code: "neural_hematopoietic",
    copy: "Células Troncales Neurales y Hematopoyéticas",
    short_copy: "Neurales y Hematopoyéticas",
  },
  3: {
    code: "mesenchymal",
    copy: "Células Estromales Mesenquimales",
    short_copy: "Estromales Mesenquimales",
  },
  4: {
    code: "regeneration",
    copy: "Células Troncales y de Regeneración",
    short_copy: "Regeneración",
  },
  5: {
    code: "cancer",
    copy: "Células Troncales y Cáncer",
    short_copy: "Cáncer",
  },
  6: {
    code: "aging",
    copy: "Envejecimiento",
    short_copy: "Envejecimiento",
  },
}