function timeout(milliseconds)
{
  return new Promise(function(resolve, reject)
  {
    setTimeout(function()
      {
        if (milliseconds > 2000)
        {
          reject();
        } else
        {
          resolve();
        };
      }, milliseconds)
  });
}

console.log(1);
timeout(1500).then
(
  function()
  {
    console.log("sup");
  },
  function()
  {
    console.log("too long");
  }
);
console.log(2);
