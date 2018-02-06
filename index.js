var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var URL = require('url-parse');
var checkUrl = require('valid-url');
var Heap = require('minheap');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.on('post input', function(input){

		var k = parseInt(input);
		request('http://terriblytinytales.com/test.txt', function (error, response, body) {
			if(error){
				io.emit('send output','can\'t connect to website');
				return false;
			}
			else
			{
				body = body.toString();
			// Process text file to get only lines //
			body = body.replace(/\t/g, ' ');
			body = body.replace(/\n/g, "\n\n");      
			body = body.split("\n\n");
			body = body.filter(String);
			body = body.filter(function(e){return e}); 
			
			// End of processing //

			//  process line by line and get words with punchuations removed!
			var words = {};

			var len = body.length;

			for(var i=0; i<len;i++)
			{

				var line = body[i];
				var word_array = line.split(' ')

				for(var j = 0 ; j < word_array.length ; j++)
				{
							// if word is url process hostname
							if(checkUrl.isUri(word_array[j]))
							{
								var url = new URL(word_array[j]);
								word_array[j] = url.hostname;
							}
							else
							{
										// remove punctuations from word
										word_array[j] = word_array[j].replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase();
									}
							// set in hash , no numbers 
							if(word_array[j] && !words[word_array[j]] && !isNumber(word_array[j]))
							{
								words[word_array[j]] = 1;

							}
							else if(word_array[j] && words[word_array[j]] && !isNumber(word_array[j]))
							{
								words[word_array[j]]++;

							}
						}
					}
			// compute top k occuring words
			compute(words,k);
		}
	});

	});
});

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function compute(words,k)
{

	if(k > Object.keys(words).length)
	{
		io.emit('send output','Input is more than the number of words in the text file!');
		return false;
	}

	var heap = new Heap(function(l,r) {
		return l.weight - r.weight;
	});
	var len = words.length;
	var i = 0;
	 // O(N + n-k*logk ) algo to compute top k words
	 // fill k words into heap
	 for (var key in words) {
	 	heap.push({weight: words[key], word: key })
	 	i++;
	 	if(i==k)
	 		break;
	 }

	 var wordsleft = len - k;
	 i = 0;
	 var weight;
	 var topWeight;
	 // process the other n-k elements of hash. Compare with top element of heap, if element's weight greater than the top element's weight replace and heapify.  
	 for(var key in words)
	 {

	 	i++;
	 	if(i>=k)
	 	{
	 		
	 		weight = words[key];
	 		topWeight = heap.top().weight;

	 		if(weight > topWeight)
	 		{
	 			heap.pop();
	 			heap.push({weight: words[key], word: key });
	 		}

	 	}  
	 }
	 // finally we have the top occuring words in the heap.
	 // make table string and return back to client side
	 make(heap,k);
	}
	function make(heap,k)
	{
		var table = '<table border="1" style="width: 75px; text-align: center"><tr><th>Word</th><th>Count</th></tr>';
	// push heap elements into an array
	var arr = [];
	for(var i=0;i<k ; i++)
	{
		arr.push(heap.top());
		heap.pop();
	}
	// Complete table string and return back to client side
	for(var i = k-1 ; i >= 0; i--)
	{
		table += '<tr>'

		table +=	'<td>' + arr[i].word + '</td>' + '<td>' + arr[i].weight + '</td>'; 

		table += '</tr>'
	}
	table += '</table>';
	io.emit('send output',table);
}

http.listen(process.env.PORT || 5000);