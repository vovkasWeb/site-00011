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
// slider (обновлённый)
const innerTrack = document.getElementById('innerTrack')
const progress = document.getElementById('progress')
let slides = document.querySelectorAll('.inner-slide')

// --- клонирование (без ошибок из-за динамического NodeList) ---
const originalSlides = Array.from(slides)
const CLONES = 3

for (let i = 0; i < CLONES; i++) {
  const clone = originalSlides[i].cloneNode(true)
  innerTrack.appendChild(clone)
}
for (let i = originalSlides.length - CLONES; i < originalSlides.length; i++) {
  const clone = originalSlides[i].cloneNode(true)
  innerTrack.insertBefore(clone, innerTrack.firstChild)
}

slides = document.querySelectorAll('.inner-slide')

let current = CLONES // начинаем с "реального" первого слайда
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
  if (!progress) return
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
    if (current >= slides.length - CLONES) {
      current = CLONES
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
    if (current < CLONES) {
      // ставим на "аналогичный" слайд с конца
      current = slides.length - CLONES - 1
      updateInnerSlider(false)
    }
    isAnimating = false
  }, 500)

  startProgress()
}

// авто-слайд
function startAuto() {
  stopAuto()
  autoSlide = setInterval(nextSlide, 5000)
  startProgress()
}
function stopAuto() {
  if (autoSlide) clearInterval(autoSlide)
  autoSlide = null
}

// --- Свайпы: Pointer Events (если есть) + fallback на Touch ---
const SWIPE_THRESHOLD = 50
let startX = 0
let startY = 0
let isPointerDown = false
let isDragging = false
let moved = false

function onPointerDown(e) {
  isPointerDown = true
  isDragging = false
  moved = false
  startX = e.clientX
  startY = e.clientY
  stopAuto()
  // попытка захватить pointer (чтобы получать move/up даже если указатель уедет)
  try { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId) } catch (err) {}
}
function onPointerMove(e) {
  if (!isPointerDown) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY

  // только если горизонталь > вертикаль — считаем это свайпом
  if (!isDragging && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
    isDragging = true
  }

  if (isDragging) {
    // предотвращаем скролл страницы горизонтальным свайпом
    e.preventDefault()
    moved = true
  }
}
function onPointerUp(e) {
  if (!isPointerDown) return
  const dx = e.clientX - startX
  if (dx < -SWIPE_THRESHOLD) nextSlide()
  else if (dx > SWIPE_THRESHOLD) prevSlide()

  startAuto()
  isPointerDown = false
  isDragging = false
  try { e.target.releasePointerCapture && e.target.releasePointerCapture(e.pointerId) } catch (err) {}
}
function onPointerCancel() {
  isPointerDown = false
  isDragging = false
  startAuto()
}

// fallback (touch)
function onTouchStart(e) {
  isPointerDown = true
  isDragging = false
  moved = false
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  stopAuto()
}
function onTouchMove(e) {
  if (!isPointerDown) return
  const dx = e.touches[0].clientX - startX
  const dy = e.touches[0].clientY - startY
  if (Math.abs(dx) > Math.abs(dy)) {
    // горизонтальный свайп — блокируем вертикальный перенос страницы
    e.preventDefault()
    moved = true
  }
}
function onTouchEnd(e) {
  if (!isPointerDown) return
  const endX = e.changedTouches[0].clientX
  const dx = endX - startX
  if (dx < -SWIPE_THRESHOLD) nextSlide()
  else if (dx > SWIPE_THRESHOLD) prevSlide()

  startAuto()
  isPointerDown = false
  isDragging = false
}

// attach listeners
if (window.PointerEvent) {
  innerTrack.addEventListener('pointerdown', onPointerDown, { passive: false })
  innerTrack.addEventListener('pointermove', onPointerMove, { passive: false })
  innerTrack.addEventListener('pointerup', onPointerUp, { passive: false })
  innerTrack.addEventListener('pointercancel', onPointerCancel)
  innerTrack.addEventListener('lostpointercapture', onPointerCancel)
} else {
  // touch fallback — touchmove must be passive: false чтобы preventDefault работал
  innerTrack.addEventListener('touchstart', onTouchStart, { passive: true })
  innerTrack.addEventListener('touchmove', onTouchMove, { passive: false })
  innerTrack.addEventListener('touchend', onTouchEnd, { passive: false })
  innerTrack.addEventListener('touchcancel', onPointerCancel, { passive: true })
}

// предотвращаем срабатывание click при свайпе (чтобы ссылки не открывались)
innerTrack.addEventListener('click', e => {
  if (moved) {
    e.preventDefault()
    e.stopPropagation()
  }
}, true)

// Если у тебя были mouse-события (mousedown/mouseup) — они покрываются Pointer Events.
// Но на всякий случай добавим mouseleave чтобы сбросить состояние при уходе курсора:
innerTrack.addEventListener('mouseleave', () => {
  if (isPointerDown) {
    isPointerDown = false
    isDragging = false
    startAuto()
  }
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
