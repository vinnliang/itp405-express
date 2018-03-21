const fs = require('fs');


function doSomethingAsync(callbackFunction)
{
  setTimeout(function()
  {
      fs.readFile('hello.txt', {encoding: 'utf8'}, function(error, contents)
      {
        callbackFunction(contents);
      });
  }, 1500);
}

console.log(1);
doSomethingAsync(function(contents)
{
  console.log(contents);
});
console.log(2);
