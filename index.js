const { Telegraf, Markup } = require('telegraf')
const LocalSession = require('telegraf-session-local')
require('dotenv').config()

const token = process.env.TELEGRAM_TOKEN
const bot = new Telegraf(token)

const effectsForImages = [
	'размытие в движении',
	'яркие неоновые цвета',
	'неоновые светящиеся контуры',
	'инверсия цвета',
	'шум',
	'сепия',
	'постеризация',
	'контраст',
	'размытие по Гауссу',
	'резкость',
	'стеклянное размытия',
	'соляризация',
	'медианное размытие',
	'насыщенность',
	'эффект тиснения',
	'чёрно-белый',
	'смещение',
	'поменять оттенок',
	'мягкое размытие',
	'блур',
	'глитч-эффект',
	'градиентная заливка',
	'мягкий свет',
	'эффект зерна',
	'растушевка',
	'тени',
	'круговая обрезка',
	'перспективное искажение',
	'разделение каналов',
	'эффект старинного кино',
	'текстурное наложение',
	'мозаичный эффект',
	'скевоморфизм',
]
const effectsFor3D = [
	'глубина и текстура',
	'параллакс-эффект',
	'динамические тени',
	'искажение перспективы',
	'кристаллический эффект',
	'симуляция жидкости',
	'объёмные текстуры',
	'анимация частиц',
	'луминесцентные узоры',
	'хроматическая аберрация',
	'разрушение объектов',
	'зеркальные поверхности',
	'генеративные узоры',
	'фрактальные структуры',
	'размытия движения',
	'морфинг текстур',
	'световые лучи',
	'объёмный свет',
	'рефракция',
	'элементы абстракции',
	'смешивание материалов',
	'картографические текстуры',
	'пустотные объекты',
	'цветовая интерполяция',
	'световые градиенты',
	'кинетическая типография',
	'непредсказуемая анимация',
	'текстурные искажения',
	'текучие формы',
	'спиральные движения',
	'светящиеся контуры',
	'глубинная размытие',
	'вибрационные эффекты',
]
const effectsForMotion = [
	'размытие Гаусса',
	'старение',
	'свечение',
	'динамическое размытие',
	'искажение',
	'градиенты ',
	'фоновые анимации',
	'пульсация',
	'деформация форм',
	'отражение',
	'шум',
	'текстурные слои',
	'растяжение',
	'сжатие',
	'кадрирование',
	'параллакс',
	'перекрытие объектов',
	'статика',
	'движение камеры',
	'прерывистая анимация',
	'симметричная анимация',
	'размытие движения',
	'трёхмерное искажение',
	'эффект глубины',
	'вспонтанные вспышки',
	'тонирование',
	'глитч',
	'ретро',
	'голографический эффект',
]
const effectsForEditing = [
	'кадрирование',
	'зум',
	'визуальные метки',
	'параллсакс',
	'шум',
	'паттерны',
	'маски и обрезки',
	'ретро',
	'тремор',
	'глитч',
	'фильмирование',
	'линейные переходы',
	'сплошные заливки',
	'вспышка',
	'кинетическая типографика',
	'симуляция камеры',
	'статические кадры',
	'деформация текста',
	'затемнение краёв ',
	'затемнение',
	'таймлапс',
	'маскировка объектов',
	'разделение экрана',
	'пульсация',
	'спид-рампы',
	'масштабирование объектов',
	'эффект глубины',
	'эффект стробоскопа',
	'резкость',
	'камера с наклоном',
	'иллюзия движения',
]

bot.use(new LocalSession({ database: 'session_db.json' }).middleware())

function initializeStatistics(ctx) {
	if (!ctx.session.stats) {
		ctx.session.stats = {
			startCommandCount: 0,
			buttonClickCounts: {
				images: 0,
				threeD: 0,
				motion: 0,
				editing: 0,
			},
			inspireClickCount: 0,
			imageReceivedCount: 0,
		}
	}
}

bot.start(ctx => {
	initializeStatistics(ctx)
	ctx.session.stats.startCommandCount += 1

	ctx.reply(
		'Привет! 🌟 Я твой бот для вдохновения. Выбери одну из категорий ниже, чтобы получить идеи!',
		Markup.keyboard([
			['Идеи для картинок', 'Идеи для 3D'],
			['Идеи для моушена', 'Идеи для монтажа'],
		]).resize()
	)
})

bot.hears('Идеи для картинок', ctx => {
	initializeStatistics(ctx)
	ctx.session.stats.buttonClickCounts.images += 1
	ctx.session.category = effectsForImages
	sendNewEffectMessage(ctx, effectsForImages)
})

bot.hears('Идеи для 3D', ctx => {
	initializeStatistics(ctx)
	ctx.session.stats.buttonClickCounts.threeD += 1
	ctx.session.category = effectsFor3D
	sendNewEffectMessage(ctx, effectsFor3D)
})

bot.hears('Идеи для моушена', ctx => {
	initializeStatistics(ctx)
	ctx.session.stats.buttonClickCounts.motion += 1
	ctx.session.category = effectsForMotion
	sendNewEffectMessage(ctx, effectsForMotion)
})

bot.hears('Идеи для монтажа', ctx => {
	initializeStatistics(ctx)
	ctx.session.stats.buttonClickCounts.editing += 1
	ctx.session.category = effectsForEditing
	sendNewEffectMessage(ctx, effectsForEditing)
})

bot.action('inspire', ctx => {
	initializeStatistics(ctx)
	ctx.session.stats.inspireClickCount += 1
	const currentCategory = ctx.session.category || effectsForImages
	sendNewEffectMessage(ctx, currentCategory)
	ctx.answerCbQuery()
})

bot.on('photo', ctx => {
	initializeStatistics(ctx)
	ctx.session.stats.imageReceivedCount += 1
	ctx.reply('Спасибо, что поделился! 😊')
})

function sendNewEffectMessage(ctx, effectList) {
	const selectedEffects = selectRandomEffects(effectList, 3)
	const message = `Попробуй объединить: ${selectedEffects.join(
		', '
	)}. Что получится на этот раз? Пришлешь результат?`

	ctx.reply(message, {
		reply_markup: {
			inline_keyboard: [[{ text: 'ещё', callback_data: 'inspire' }]],
		},
	})
}

function selectRandomEffects(effectsArray, count) {
	if (effectsArray.length < count) {
		return effectsArray.slice()
	}
	const shuffled = effectsArray.sort(() => 0.5 - Math.random())
	return shuffled.slice(0, count)
}

process.on('exit', () => {
	console.log('Bot statistics on exit:', bot.context.session.stats)
})

bot
	.launch()
	.then(() => console.log('Bot is running...'))
	.catch(error => {
		console.error('Error launching bot:', error)
		console.log('Check your bot token and configuration.')
	})
