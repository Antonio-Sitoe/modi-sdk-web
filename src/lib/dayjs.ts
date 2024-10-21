import updateLocale from 'dayjs/plugin/updateLocale'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
dayjs.extend(updateLocale)
dayjs.updateLocale('pt-br', {
  weekdaysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  weekdays: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
})
