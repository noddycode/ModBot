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

exports.inArray = function(searchItem, array)
{
	let item = searchItem.toLowerCase();
	let tmp = array;

	tmp.forEach(function(item, i)
	{
		tmp[i] = tmp[i].toLowerCase();
	});

	let idx = array.indexOf(item);

	if (idx <= 0)
		return false;
	else
		return true;
}