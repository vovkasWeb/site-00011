const innerTrack = document.getElementById('innerTrack')
const innerPrev = document.getElementById('innerPrev')
const innerNext = document.getElementById('innerNext')

let innerIndex = 0
const maxIndex = 1
let timeoutId
export function restartSlider() {
	innerIndex = 0
	innerPrev.classList.add('active')
	innerNext.classList.remove('active')
	restartTimeout()
	updateInnerSlider()
}
let scrolle = 33.333

const updateInnerSlider = () => {
	innerTrack.style.transform = `translateX(-${innerIndex * scrolle}%)`
}

function updateScrollValue() {
	const element = document.querySelector('.inner-slide')
	const flexValue = parseFloat(getComputedStyle(element).flexBasis)

	if (flexValue === 50) {
		scrolle = 100
	} else if (flexValue === 33.333) {
		scrolle = 33.333
	} else {
		scrolle = 33.333
	}
	restartSlider()
}

updateScrollValue()
window.addEventListener('resize', updateScrollValue)
window.addEventListener('orientationchange', updateScrollValue)

function toggleActive() {
	innerPrev.classList.toggle('active')
	innerNext.classList.toggle('active')
}

innerNext.onclick = () => {
	innerIndex = 1
	updateInnerSlider()
	cancelTimeout()
	innerNext.classList.add('active')
	innerPrev.classList.remove('active')
}

innerPrev.onclick = () => {
	innerIndex = 0
	updateInnerSlider()
	restartTimeout()
	innerPrev.classList.add('active')
	innerNext.classList.remove('active')
}

function startTimeout() {
	timeoutId = setTimeout(() => {
		innerIndex = 1
		updateInnerSlider()
		toggleActive()
	}, 2500)
}

function cancelTimeout() {
	clearTimeout(timeoutId)
}

function restartTimeout() {
	clearTimeout(timeoutId)
	startTimeout()
}
startTimeout()
innerPrev.classList.add('active')
updateInnerSlider()
