const left = document.querySelector(".left");
const right = document.querySelector(".right");
const player = document.querySelector(".player");
const score = document.querySelector(".score");
const menu = document.querySelector(".menu");
const lastScore = document.querySelector(".last-score");
const highScore = document.querySelector(".high-score");
const restart = document.querySelector(".restart");
const challenege = document.querySelector(".challenge");
const timer = document.querySelector(".timer");
const lastTimer = document.querySelector(".last-timer");
const ground = document.querySelector(".ground");
let lose = false;
let position = parseInt(window.getComputedStyle(player).getPropertyValue("margin-left"));
let pos = -1;

const times = window.innerWidth - 100;
Object.assign(left.style, {
	top: window.innerHeight - 150,
	left: 50
})

Object.assign(right.style, {
	top: window.innerHeight - 150,
	left: window.innerWidth - 150
})

const setMovement = (windowWidth) => {
	return windowWidth / 10 + 0.5;
}

player.style.top = window.innerHeight - ground.style.height - 110

const moveBy = setMovement(window.innerWidth);

alert("use left, right arrows to move the player, or if you are on mobile use the on-screen controls");

const goLeft = () => {
	pos = -1;
	if (position < 1) return;
	player.style.boxShadow = "30px 0 10px rgb(100, 100, 255)";
	player.style.opacity = 0.7;
	position -= moveBy;
	player.style.left = position;

	setTimeout(() => {
		player.style.boxShadow = "none";
		player.style.opacity = 1;
	}, 200);
}

const goRight = () => {
	pos = 1;
	if (position > window.innerWidth - 180) return;
	player.style.boxShadow = "-30px 0 10px rgb(100, 100, 255)";
	player.style.opacity = 0.7;
	position += moveBy;
    player.style.left = position;
	setTimeout(() => {
		player.style.boxShadow = "none";
		player.style.opacity = 1;
	}, 200);
}

let scoreCount = 0;
let doubledTimes = 0;

const collect = (x, doubler) => {
	if (doubler) doubledTimes += 5;
	if (doubledTimes !== 0) {
		scoreCount += x * 2;
		score.textContent = scoreCount;
		--doubledTimes;
	} else {
		scoreCount += x;
		score.textContent = scoreCount;
	}
	score.textContent = scoreCount;
}

const spawn = (position, dash) => {
	if (scoreCount >= 3000 && scoreCount < 5000) dash -= 2;
	else if (scoreCount >= 5000 && scoreCount < 10000) dash -= 4;
	else dash += 2;
	let speed = 50;
	let top = -50;
	const element = document.createElement("div");
	if (dash === 1) {
		speed = 85;
		Object.assign(element.style, {
			background: "red",
			boxShadow: "0 -30px 30px rgb(100, 100, 200)"
		});
	} else if (dash === 0) {
		speed = 115;
		Object.assign(element.style, {
			background: "red",
			boxShadow: "0 -35px 30px orange, 0 -55px 35px red"
		});
	} else if (dash >= 11) {
		speed = 50;
		Object.assign(element.style, {
			background: "rgb(100, 200, 100)",
			display: "flex",
			justifyContent: "center",
			placeItems: "center"
		});
		element.textContent = "2X";
	} else {
		Object.assign(element.style, {background: "red"})
		speed = 50;
	}
	Object.assign(element.style, {
		height: 50,
		width: 50,
		borderRadius: "50%",
		position: "absolute",
		top: -50,
		left: position,
		transition: "all 0.5s linear"
	});
	document.body.appendChild(element);
	setInterval(() => {
		const elementTop = parseInt(window.getComputedStyle(element).getPropertyValue("top"));
		const playerTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
		const playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
		if (elementTop > playerTop - 70 && playerLeft >= position - 100 && playerLeft <= position + 100) {
			document.body.removeChild(element);
			if (speed === 85) collect(150, false);
			if (speed === 300) collect(200, false);
			if (speed === 115) collect(250, false);
			if (speed === 50 && element.style.background === "rgb(100, 200, 100)") collect(0, true);
			else collect(100, false);
		}
		top += speed;
    	element.style.top = top;
    	if (elementTop > playerTop + 50 && dash < 11) {
    		lose = true;
    		document.body.removeChild(element);
    	}
    }, 100);
}

let x = 2000;

setInterval(() => {
	if (lose) {
		menu.style.display = "flex";
		x = 2000;
		lastScore.textContent = `SCORE: ${score.textContent}`;
		scoreCount = 0;
        if (seconds < 10 && minutes < 10) lastTimer.textContent = `TIME: 0${minutes}:0${seconds}`
    	else lastTimer.textContent = `TIME: ${minutes}:${seconds}`
		left.removeEventListener("touchstart", goLeft);
		right.removeEventListener("touchstart", goRight);
		window.removeEventListener("keydown", null);
	} else {
		setTimeout(() => {
		    spawn(Math.random() * (100, window.innerWidth - 110), parseInt(Math.random() * 11));
		    if (x === 0) x = 2000;
		    x -= 500;
		}, x);
	}
}, 2000);

const _restart = () => {
	lose = false;
	position = 0;
	minutes = 0;
	seconds = 0;
	player.style.left = 0;
	score.textContent = 0;
	menu.style.display = "none";
	left.addEventListener("touchstart", goLeft);
	right.addEventListener("touchstart", goRight);
}

left.addEventListener("touchstart", goLeft);
right.addEventListener("touchstart", goRight);
window.addEventListener("keydown", (key) => {
	switch (key.code) {
		case "ArrowLeft":
		    goLeft();
		    break;
		case "ArrowRight":
		    goRight();
		    break;
	}
});
restart.addEventListener("click", _restart);

setInterval(() => {
	if (scoreCount >= 3000 && scoreCount <= 5000) challenege.textContent = "CHALLENGE: REACH 5000";
	else if (scoreCount >= 5000 && scoreCount < 10000) challenege.textContent = "CHALLENGE: REACH 10000";
	else if (scoreCount >= 10000) challenge.textContent = "NO CHALLENGE: YOU ARE UNSTOPPABLE!";
}, 0);

let seconds = 0;
let minutes = 0;

setInterval(() => {
	if (lose) return;
	if (seconds == 61) {
		seconds = 0;
		minutes++;
	} else seconds++;
	if (seconds < 10 && minutes < 10) timer.textContent = `0${minutes}:0${seconds}`
	else timer.textContent = `${minutes}:${seconds}`
}, 1000);
