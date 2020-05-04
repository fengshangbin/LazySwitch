function ready() {
	var isReady = false;
	var readyList = [];

	this.bind = function (fn) {
		if (isReady)
			//fn();
			fn.call(window);
		else
			readyList.push(fn);
	}

	this.trigger = function () {
		if (isReady) return;
		isReady = true;
		for (var i = 0; i < readyList.length; i++) {
			readyList[i].apply(window);
			//readyList[i]();
		}
		readyList = null;
	}
};
module.exports = ready;