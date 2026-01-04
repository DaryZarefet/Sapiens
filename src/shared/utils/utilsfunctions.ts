//FUNCION QUE INDICA CUANTO TIEMPO HA PASADO DESDE LA REALIZACION DE LA PUBLICACION
export function timeAgo(time: Date | string | number): string {
  const now = new Date();
  const date = time instanceof Date ? time : new Date(time);

  if (isNaN(date.getTime())) return "fecha inválida";

  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "justo ahora";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const plural = (n: number, singular: string, pluralForm?: string) => `${n} ${n === 1 ? singular : pluralForm ?? singular + "s"}`;

  if (seconds < 60) {
    return `hace ${plural(seconds, "segundo")}`;
  }

  if (minutes < 60) {
    return `hace ${plural(minutes, "minuto")}`;
  }

  if (hours < 24) {
    return `hace ${plural(hours, "hora")}`;
  }

  if (days < 7) {
    return `hace ${plural(days, "día")}`;
  }

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

//FUNCION QUE FORMATE LA FECHA DIAS MES(en texto) ANO
export function formatearFecha({ fecha }: { fecha: string }): string {
  const opciones: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  return new Date(fecha).toLocaleDateString("es-ES", opciones);
}

export function formatearFechaShort({ fecha }: { fecha: string }): string {
  const date = new Date(fecha);
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const anio = date.getFullYear();

  return `${dia}/${mes}/${anio}`;
}
