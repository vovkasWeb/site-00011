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
//slider
document.addEventListener('DOMContentLoaded', () => {
	const track = document.getElementById('innerTrack')
	const progress = document.getElementById('progress')
	let slides = document.querySelectorAll('.inner-slide')

	let slidesPerView, slideWidth
	let current = 0
	let autoSlide

	// 🔹 Рассчёт количества видимых слайдов
	function updateSlidesPerView() {
		if (window.innerWidth <= 650) slidesPerView = 1
		else if (window.innerWidth < 900) slidesPerView = 2
		else slidesPerView = 3

		slideWidth = 100 / slidesPerView
	}

	// 🔹 Обновляем слайдер
	function updateSlider() {
		track.style.transition = 'transform 0.5s ease'
		track.style.transform = `translateX(-${current * slideWidth}%)`
	}

	// 🔹 Прогресс-бар
	function startProgress() {
		progress.style.transition = 'none'
		progress.style.width = '0'
		setTimeout(() => {
			progress.style.transition = 'width 5s linear'
			progress.style.width = '100%'
		}, 50)
	}

	// 🔹 Переход к слайду
	function goTo(index) {
		current = (index + slides.length) % slides.length
		updateSlider()
		startProgress()
	}

	// 🔹 Следующий слайд
	function nextSlide() {
		goTo(current + 1)
	}

	// 🔹 Предыдущий слайд
	function prevSlide() {
		goTo(current - 1)
	}

	// 🔹 Автопрокрутка
	function startAuto() {
		autoSlide = setInterval(nextSlide, 5000)
		startProgress()
	}

	function stopAuto() {
		clearInterval(autoSlide)
	}

	function restartAuto() {
		stopAuto()
		startAuto()
	}

	// 🔹 Свайпы
	let startX = 0

	track.addEventListener('touchstart', e => (startX = e.touches[0].clientX))
	track.addEventListener('touchend', e => {
		let dx = startX - e.changedTouches[0].clientX
		if (dx > 50) nextSlide()
		else if (dx < -50) prevSlide()
		restartAuto()
	})

	track.addEventListener('mousedown', e => (startX = e.clientX))
	track.addEventListener('mouseup', e => {
		let dx = startX - e.clientX
		if (dx > 50) nextSlide()
		else if (dx < -50) prevSlide()
		restartAuto()
	})

	// 🔹 Пересчёт при ресайзе
	window.addEventListener('resize', () => {
		updateSlidesPerView()
		updateSlider()
	})

	// 🔹 Инициализация
	updateSlidesPerView()
	updateSlider()
	startAuto()
})
