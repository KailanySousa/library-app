/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Aliases (para ler melhor no código)
        magenta: colors.fuchsia, // agora você pode usar bg-magenta-600 etc.
        violet: colors.violet,

        // Paleta "brand" opcional (escolha os tons que quer usar como padrão)
        brand: {
          DEFAULT: colors.fuchsia[600],  // cor primária padrão
          hover: colors.fuchsia[700],
          focus: colors.fuchsia[300],
          surface: colors.fuchsia[50],
          text: colors.white,
          // secundária (violet) para composições/gradientes
          secondary: colors.violet[600],
          secondaryHover: colors.violet[700],
        },
      },
    },
  },
  plugins: [],
};
