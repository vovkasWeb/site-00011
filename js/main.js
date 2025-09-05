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
	const slides = Array.from(document.querySelectorAll('.inner-slide'))
	const progress = document.getElementById('progress')
	const prevBtn = document.getElementById('prevSlide')
	const nextBtn = document.getElementById('nextSlide')

	let slidesPerView = 1
	let slideWidth = 0
	let current = 0
	let autoSlide
	let isDragging = false
	let startX = 0

	// 🔹 Расчёт ширины слайдов и количества видимых
	function updateSlides() {
		if (window.innerWidth <= 650) slidesPerView = 1
		else if (window.innerWidth < 900) slidesPerView = 2
		else slidesPerView = 3

		slideWidth = track.offsetWidth / slidesPerView
		slides.forEach(slide => (slide.style.width = `${slideWidth}px`))
		updateSlider(false)
	}

	// 🔹 Обновление позиции слайдера
	function updateSlider(animate = true) {
		track.style.transition = animate ? 'transform 0.5s ease' : 'none'
		track.style.transform = `translateX(-${current * slideWidth}px)`
	}

	// 🔹 Прогресс-бар
	function startProgress() {
		if (!progress) return
		progress.style.transition = 'none'
		progress.style.width = '0'
		setTimeout(() => {
			progress.style.transition = 'width 5s linear'
			progress.style.width = '100%'
		}, 50)
	}

	// 🔹 Переход к слайду с цикличностью
	function goTo(index) {
		current = (index + slides.length) % slides.length
		updateSlider()
		startProgress()
	}

	function nextSlideFunc() {
		goTo(current + 1)
	}
	function prevSlideFunc() {
		goTo(current - 1)
	}

	// 🔹 Автопрокрутка
	function startAuto() {
		clearInterval(autoSlide)
		autoSlide = setInterval(nextSlideFunc, 5000)
		startProgress()
	}
	function stopAuto() {
		clearInterval(autoSlide)
	}

	// 🔹 Свайпы для мобильных
	track.addEventListener('touchstart', e => {
		startX = e.touches[0].clientX
		stopAuto()
		isDragging = true
	})
	track.addEventListener('touchend', e => {
		if (!isDragging) return
		const dx = e.changedTouches[0].clientX - startX
		if (dx < -15) nextSlideFunc()
		else if (dx > 15) prevSlideFunc()
		startAuto()
		isDragging = false
	})

	// 🔹 Кнопки "влево/вправо"
	if (prevBtn)
		prevBtn.addEventListener('click', () => {
			prevSlideFunc()
			startAuto()
		})
	if (nextBtn)
		nextBtn.addEventListener('click', () => {
			nextSlideFunc()
			startAuto()
		})

	// 🔹 Обновление при ресайзе
	window.addEventListener('resize', updateSlides)

	// 🔹 Инициализация
	updateSlides()
	updateSlider(false)
	startAuto()
})
