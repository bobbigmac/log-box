
pluraliseString = function(str, val, ending) {
	return (val > 1 ? str + (ending || 's') : str);
};