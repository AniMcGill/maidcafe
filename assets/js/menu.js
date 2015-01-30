io.socket.get('/menuitem/categories', function(body, res){
  this.categories = body;
  console.log(this.categories);
});

io.socket.on('menuitem', function(data){
  console.log(data);
});
