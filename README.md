Deployed on https://afternoon-journey-81115.herokuapp.com/

The task was developed on Node.JS, Express JS and Socket.IO.

Frontend Framweork: Bootstrap

Main Files:

index.html: Frontend
index.js: Backend

Explanation:

Algorithm Used:

1) Retrieve and process words from textfile and store into hash/JSON with their count. Processing includes removing punctuations, proccessing URL's etc. For simplicity, words are converted to lower case.
    
    Time Comlexity: O(N)
    
2) Get input from User (k). We need to retrieve top k occuring words from the hash efficiently, so we will use a Min heap.

Fix the size of heap to k and add first k words from hash into the heap. For the remaining n-k words, There will be two sub cases:
if count of top element of heap is less than the current word's count , pop the top element of heap and add the current word.
else
continue

Repeat till all n-k words are done, Finally we will have the top k occuring words in the min heap.

Overall Time Complexity: O(N + (n-k)logk) = O(N).

Explanantion of index.js.

Modules used ( can be installed by npm):
1) Request module
2) Heap module
3) Http
4) valid-url
5) url-parse

Function Explanation:

connection: (line 13)
FIrst I got the inpuit from user k, then used the request module to fetch texrt file then basic processing is done to clean the words and added into a JSON object.
compute function is called to get top k words using heap.

make: (line 133)

The table string is computed to return back to the user.

---------------------------------------------------------------------------------------------------

Further optimizations that can be done:

Prefetch and compute the hash, and not compute again for each user input.
Use a CRON to check if txt file was changed,If changed then precompute again.

Don't consider stop words like 'to','and','or', as they are in every sentence.


By: Nihar Rao









    






