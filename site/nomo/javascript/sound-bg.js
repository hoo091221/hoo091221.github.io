// 음원 변경

function sound() {
	var randomNumber = Math.floor(Math.random() * 6);
	var audio = 'bgm' + randomNumber + '.mp3';
	const audioplayer = document.getElementById('audio');
	audioplayer.src = './audio/' + audio;
	audioplayer.play();
}

// sound();

// 배경 변경

function bg() {
	var randomNumber = Math.floor(Math.random() * 10);
	document.body.style.backgroundImage = 'url("./img/background' + randomNumber + '.jpg' + '")';
}

bg();