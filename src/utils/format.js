export const formatDateTime = (value) => new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
export const formatDate = (value) => new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium' }).format(new Date(value))
export const formatTime = (value) => new Intl.DateTimeFormat('es-EC', { timeStyle: 'short' }).format(new Date(value))
