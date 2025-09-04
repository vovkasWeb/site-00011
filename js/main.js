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

// Клонируем первые 3 в конец
for (let i = 0; i < 3; i++) {
  let clone = slides[i].cloneNode(true)
  innerTrack.appendChild(clone)
}
// Клонируем последние 3 в начало
for (let i = slides.length - 3; i < slides.length; i++) {
  let clone = slides[i].cloneNode(true)
  innerTrack.insertBefore(clone, innerTrack.firstChild)
}

slides = document.querySelectorAll('.inner-slide')

let current = 3 // начинаем с "реального" первого слайда
let slidesPerView
let slideWidth
let autoSlide
let isAnimating = false

function updateSlidesPerView() {
  if (window.innerWidth <= 650) {
    slidesPerView = 1
  } else if (window.innerWidth < 900) {
    slidesPerView = 2
  } else {
    slidesPerView = 3
  }
  slideWidth = 100 / slidesPerView
}

// функция сдвига слайдера
function updateInnerSlider(animate = true) {
  innerTrack.style.transition = animate ? 'transform 0.5s ease' : 'none'
  innerTrack.style.transform = `translateX(-${current * slideWidth}%)`
}

// прогресс-бар
function startProgress() {
  progress.style.transition = 'none'
  progress.style.width = '0'
  setTimeout(() => {
    progress.style.transition = 'width 5s linear'
    progress.style.width = '100%'
  }, 50)
}

function nextSlide() {
  if (isAnimating) return
  isAnimating = true
  current++
  updateInnerSlider()

  setTimeout(() => {
    if (current >= slides.length - 3) {
      current = 3
      updateInnerSlider(false)
    }
    isAnimating = false
  }, 500)

  startProgress()
}

function prevSlide() {
  if (isAnimating) return
  isAnimating = true
  current--
  updateInnerSlider()

  setTimeout(() => {
    if (current < 3) {
      current = slides.length - 3 - 1
      updateInnerSlider(false)
    }
    isAnimating = false
  }, 500)

  startProgress()
}

// авто-слайд
function startAuto() {
  autoSlide = setInterval(nextSlide, 5000)
  startProgress()
}
function stopAuto() {
  clearInterval(autoSlide)
}

// --- свайпы ---
// ПК (мышь)
let startX = 0
let isDown = false

innerTrack.addEventListener('mousedown', e => {
  isDown = true
  startX = e.pageX
  stopAuto()
})
innerTrack.addEventListener('mouseup', e => {
  if (!isDown) return
  let diff = e.pageX - startX
  if (diff < -50) nextSlide()
  if (diff > 50) prevSlide()
  startAuto()
  isDown = false
})

// Моб (iPhone + Android)
innerTrack.addEventListener('touchstart', e => {
  isDown = true
  startX = e.touches[0].clientX
  stopAuto()
})
innerTrack.addEventListener('touchend', e => {
  if (!isDown) return
  const endX = e.changedTouches[0].clientX
  const diff = endX - startX

  if (diff < -50) nextSlide() // свайп влево
  if (diff > 50) prevSlide() // свайп вправо

  startAuto()
  isDown = false
})

// пересчёт при ресайзе
window.addEventListener('resize', () => {
  updateSlidesPerView()
  updateInnerSlider(false)
})

// запуск
updateSlidesPerView()
updateInnerSlider(false)
startAuto()
