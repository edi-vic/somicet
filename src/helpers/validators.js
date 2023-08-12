
export const isEmpty = (value) => value.trim() === ''

export const isEmail = (value) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return emailRegex.test(value.trim())
}

export const isLength = (value, length) => value.trim().length === length