document.addEventListener('DOMContentLoaded', function () {
	const menuBtns = document.querySelectorAll('.faq__menu-button')
	const fields = document.querySelectorAll('.anchor-item')
	const sections = document.querySelectorAll('.section')
	const header = document.querySelector('.header')
	const block = document.querySelector('.header__wrapper-btns')
	const burgerBtn = document.querySelector('.header__burger-menu')
	const closeBtn = document.querySelector('.header__close')
	const scrollContainer = document.querySelector('.coms__wrap-line')
	const scrollLeftBtn = document.querySelector('.coms__scroll-btn--left')
	const scrollRightBtn = document.querySelector('.coms__scroll-btn--right')

	const headerBgOn = () => {
		if (window.scrollY > 50) {
			header.classList.add('solid')
			header.classList.remove('transparent')
		} else {
			header.classList.remove('solid')
			header.classList.add('transparent')
		}
	}
	window.addEventListener('scroll', function () {
		headerBgOn()
	})

	menuBtns.forEach(menuBtn => {
		menuBtn.addEventListener('click', function () {
			const activeAccordion = document.querySelector('.faq__menu-button.open')
			if (activeAccordion && activeAccordion !== menuBtn) {
				activeAccordion.nextElementSibling.style.height = 0
				activeAccordion.nextElementSibling.style.padding = '0px 20px'
				activeAccordion.classList.remove('open')
				activeAccordion.querySelector('.icon').innerHTML = '&plus;'
			}
			menuBtn.classList.toggle('open')
			const icon = menuBtn.querySelector('.icon')
			const content = menuBtn.nextElementSibling
			if (menuBtn.classList.contains('open')) {
				content.style.height = content.scrollHeight + 10 + 'px'
				content.style.padding = '10px 10px 10px 0px'
				icon.innerHTML = '&minus;'
			} else {
				content.style.height = 0
				content.style.padding = '0px 20px'
				icon.innerHTML = '&plus;'
			}
		})
	})

	fields.forEach(field => {
		field.addEventListener('click', () => {
			fields.forEach(f => f.classList.remove('selected'))
			field.classList.add('selected')
			block.classList.remove('active')
			burgerBtn.classList.remove('opens')
		})
	})

	window.addEventListener('scroll', () => {
		let currentSection = ''
		sections.forEach(section => {
			const sectionTop = section.offsetTop
			const sectionHeight = section.clientHeight
			if (window.scrollY >= sectionTop - sectionHeight / 3) {
				currentSection = section.getAttribute('id')
			}
		})

		const reachedBottom =
			Math.ceil(window.innerHeight + window.scrollY) >=
			document.body.offsetHeight
		if (reachedBottom) {
			const lastSection = sections[sections.length - 1]
			currentSection = lastSection.getAttribute('id')
		}

		fields.forEach(link => {
			link.classList.remove('selected')
			if (link.getAttribute('href') === '#' + currentSection) {
				link.classList.add('selected')
				document.body.style.overflow = ''
				header.classList.remove('solid')
				headerBgOn()
			}
		})
	})

	burgerBtn.addEventListener('click', function () {
		block.classList.add('active')
		header.classList.add('solid')
		burgerBtn.classList.add('opens')
		document.body.style.overflow = 'hidden'
	})

	closeBtn.addEventListener('click', function () {
		block.classList.remove('active')
		header.classList.remove('solid')
		headerBgOn()
		burgerBtn.classList.remove('opens')
		document.body.style.overflow = ''
	})

	if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
		scrollContainer.scrollLeft = 0
		scrollLeftBtn.addEventListener('click', () => {
			scrollContainer.scrollBy({
				left: -264,
				behavior: 'smooth',
			})
		})
		scrollRightBtn.addEventListener('click', () => {
			scrollContainer.scrollBy({
				left: 264,
				behavior: 'smooth',
			})
		})
	}

	fields.forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault()

			const targetId = link.getAttribute('href').substring(1)
			const targetElement = document.getElementById(targetId)

			if (targetElement) {
				const sectionTitle =
					targetElement.querySelector('h2, h3') || targetElement
				const headerHeight = header ? header.offsetHeight : 0
				const extraOffset = 20

				const targetPosition =
					sectionTitle.getBoundingClientRect().top + window.scrollY

				window.scrollTo({
					top: targetPosition - headerHeight - extraOffset,
					behavior: 'smooth',
				})
			}
		})
	})
})

//slider
const innerTrack = document.getElementById('innerTrack')
const progress = document.getElementById('progress')
let slides = document.querySelectorAll('.inner-slide')

// Клонируем первые 3 слайда для бесконечного эффекта
for (let i = 0; i < 3; i++) {
	let clone = slides[i].cloneNode(true)
	innerTrack.appendChild(clone)
}
slides = document.querySelectorAll('.inner-slide')

let current = 0
let slidesPerView = 3
let slideWidth
let autoSlide
let isAnimating = false
let isDown = false
let startX = 0

// Определяем количество слайдов в зависимости от ширины экрана
function updateSlidesPerView() {
	const prevSlidesPerView = slidesPerView
	if (window.innerWidth <= 650) {
		slidesPerView = 1
	} else if (window.innerWidth < 900) {
		slidesPerView = 2
	} else {
		slidesPerView = 3
	}
	slideWidth = 100 / slidesPerView

	// Сбрасываем позицию при изменении slidesPerView
	if (prevSlidesPerView !== slidesPerView) {
		current = 0
		updateInnerSlider(false)
	}
	console.log(`Slides per view: ${slidesPerView}, Slide width: ${slideWidth}%`)
}

// Обновление позиции слайдера
function updateInnerSlider(animate = true) {
	innerTrack.style.transition = animate ? 'transform 0.5s ease' : 'none'
	innerTrack.style.transform = `translateX(-${current * slideWidth}%)`
	console.log(`Current slide: ${current}, Transform: -${current * slideWidth}%`)
}

// Прогресс-бар
function startProgress() {
	progress.style.transition = 'none'
	progress.style.width = '0'
	setTimeout(() => {
		progress.style.transition = 'width 5s linear'
		progress.style.width = '100%'
	}, 50)
}

// Переход к следующему слайду
function nextSlide() {
	if (isAnimating) {
		console.log('Animation in progress, ignoring nextSlide')
		return
	}
	isAnimating = true
	current++
	updateInnerSlider()

	if (current >= slides.length - slidesPerView) {
		setTimeout(() => {
			current = 0
			updateInnerSlider(false)
			isAnimating = false
		}, 500)
	} else {
		setTimeout(() => {
			isAnimating = false
		}, 500)
	}
	startProgress()
	console.log('Next slide triggered')
}

// Переход к предыдущему слайду
function prevSlide() {
	if (isAnimating) {
		console.log('Animation in progress, ignoring prevSlide')
		return
	}
	isAnimating = true
	current--
	if (current < 0) {
		current = slides.length - slidesPerView
		updateInnerSlider(false)
	}
	updateInnerSlider()
	setTimeout(() => {
		isAnimating = false
	}, 500)
	startProgress()
	console.log('Previous slide triggered')
}

// Автоматическое переключение
function startAuto() {
	stopAuto()
	autoSlide = setInterval(nextSlide, 5000)
	startProgress()
	console.log('Auto slide started')
}

function stopAuto() {
	clearInterval(autoSlide)
	console.log('Auto slide stopped')
}

// Обработка сенсорных и мышиных событий
innerTrack.addEventListener('mousedown', e => {
	isDown = true
	startX = e.pageX
	stopAuto()
	console.log('Mouse down, startX:', startX)
})

innerTrack.addEventListener('mouseup', e => {
	if (!isDown) return
	isDown = false
	const diff = e.pageX - startX
	console.log('Mouse up, diff:', diff)
	if (diff < -20) nextSlide() // Уменьшен порог для большей чувствительности
	if (diff > 20) prevSlide()
	startAuto()
})

innerTrack.addEventListener(
	'touchstart',
	e => {
		isDown = true
		startX = e.touches[0].clientX
		stopAuto()
		console.log('Touch start, startX:', startX)
	},
	{ passive: true }
)

innerTrack.addEventListener(
	'touchmove',
	e => {
		if (!isDown) return
		const currentX = e.touches[0].clientX
		const diff = currentX - startX
		if (Math.abs(diff) > 10) {
			e.preventDefault() // Блокируем скролл только при значительном свайпе
		}
		console.log('Touch move, diff:', diff)
	},
	{ passive: false }
)

innerTrack.addEventListener('touchend', e => {
	if (!isDown) return
	isDown = false
	const diff = e.changedTouches[0].clientX - startX
	console.log('Touch end, diff:', diff)
	if (diff < -20) nextSlide() // Уменьшен порог для iOS
	if (diff > 20) prevSlide()
	startAuto()
})

innerTrack.addEventListener('touchcancel', () => {
	if (isDown) {
		isDown = false
		startAuto()
		console.log('Touch cancelled')
	}
})

// Обработка изменения размера окна
window.addEventListener('resize', () => {
	updateSlidesPerView()
	updateInnerSlider(false)
})

// Инициализация
updateSlidesPerView()
updateInnerSlider(false)
startAuto()