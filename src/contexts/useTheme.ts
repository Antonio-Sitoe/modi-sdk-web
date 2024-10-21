export type TypeTheme = {
  border: string
  textAlt: string
  text: string
  input: string
  ring: string
  sucess: string
  disable: string
  background: string
  foreground: string
  primary: string
  destructive: string
}

export const useTheme = (theme: TypeTheme) => {
  return {
    text: theme?.text || '#020817',
    textAlt: theme?.textAlt || '#37373799',
    border: theme?.border || '#CCCCCC', // substituindo `hsl(var(--border))` por um cinza claro
    input: theme?.input || '#E0E0E0', // substituindo `hsl(var(--input))` por um cinza mais claro
    ring: theme?.ring || '#A0A0A0', // substituindo `hsl(var(--ring))` por um cinza médio
    sucess: theme?.sucess || '#0B8043', // verde para sucesso
    disable: theme?.disable || '#D9D9D9', // cinza claro para estado desativado
    background: theme?.background || '#F0F0F0', // substituindo `hsl(var(--background))` por um cinza bem claro
    foreground: theme?.foreground || '#FFFFFF', // substituindo `hsl(var(--foreground))` por branco
    primary: theme?.primary || '#72B84A', // verde claro para a cor primária
    destructive: theme?.destructive || '#E21717', // vermelho para ações destrutivas
  }
}
