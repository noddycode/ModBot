exports.getType = function (elem) 
{
	return Object.prototype.toString.call(elem).slice(8, -1);
}

exports.getRandomIntInclusive = function(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.inArray = function(searchArray, targetArray)
{
	for (var i = 0; i < searchArray.length; i++)
	{
		if (targetArray.indexOf(searchArray[i]) >= 0)
			return true;
	}

	return false;
}