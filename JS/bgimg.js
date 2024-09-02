function doesFileExist(urlToFile) {
	var xhr = new XMLHttpRequest();
	xhr.open('HEAD', urlToFile, false);
	xhr.send();
	if (xhr.status == '404') {
		return false;
	} else {
		return true;
	}
	var xhr = null;
}

function bg() {
	var num = 1;
	while (doesFileExist('./img/bgimg/bgimg_' + num + '.png') == true) {
		num = ++num;
	}
	return num;
}

function dobg() {
	var num = 1;
	while (doesFileExist('./img/bgimg/progress/bgimg_' + num + '.png') == true) {
		num = ++num;
	}
	return num;
}

bg();

var num = bg() - 1;
document.getElementById('bgdiv').style.backgroundImage = "url('./img/bgimg/bgimg_" + num + ".png')";

var num = bg() - 2;
document.getElementById('bgdiv-1').style.backgroundImage = "url('./img/bgimg/bgimg_" + num + ".png')";

var num = bg() - 3;
document.getElementById('bgdiv-2').style.backgroundImage = "url('./img/bgimg/bgimg_" + num + ".png')";

var num = dobg();
document.getElementById('bgdiv-do').style.backgroundImage = "url('./../img/bgimg/progress/bgimg_" + num + ".png')";

var num = bg() - 1;
document.getElementById('bgdiv-end').style.backgroundImage = "url('./../img/bgimg/bgimg_" + num + ".png')";

// astrogistmonamegistos