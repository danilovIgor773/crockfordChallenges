import './index.scss';

//console.log("Hello World");
function log(arg){
  document.writeln(arg);
}

function indentityf(x){
  return function(){
    return x;
  }
}

function add(first, second){
  return first + second;
}

function sub(first,second){
  return first - second;
}

function mul(first, second){
  return first * second;
}


//---------Function addf() - with two invocations addf(3)(4)
function addf(firstArg){
  return function(secondArg){
    return firstArg + secondArg;
  }
}


//-----------Currying - is a way of breaking down a function into a series of function that each take a single argument

//-----------Function liftf(function) - takes binary function with two invokations
function liftf(fun){
  return function(firstArg){
    return function(secondArg){
      return fun(firstArg, secondArg);
    }
  }
}

//----Function curry(function, argument) - takes binary function and arg, then returns fucntion thatcan take a secong arg
function curry(binary, first){
  return function(second){
    return binary(first,second);
  }
}

//var inc = addf(1);
//var inc = liftf(add)(1);
var inc = curry(add, 1);


//----Function twice(binary){return function unary()}


function twice(binary){
  return function(first){
    return binary(first, first);
  };
}

var doubl = twice(add);
//doubl(11);
var square = twice(mul);
//square(11);

function reverse(binary){
  return function(first, second){
    return binary(second, first);
  };
}

function composeu(f, g){
  return function(a){
    return g(f(a));
  };
}

function composeb(f, g){
  return function(first, second, third){
    return g(f(first, second), third);
  };
}

function limit(binary, count){
  return function(a, b){
    if(count >=1){
      count -= 1;
      return binary(a,b);
    }
    return undefined;
  };
}

function from(start){
  return function(){
    var next = start;
    start += 1;
    return next;
  };
}

//----------First realization of to()--------------
// function to(unary, count){
//   return function(start){
//     if(count !== 1){
//       count -= 1;
//       return unary(start);
//     }
//     return undefined;
//   };
// }

//----------Second realization of to() by Crockford--------------
function to(gen, end){
  return function(){
    var value = gen();
    if(value < end){
      return value;
    }
    return undefined;
  };
}


//----My realization of function fromTo() - (a little bit ugly)----
// function fromTo(start, end){
//   return function(){
//     if(start < end){
//       var next = start;
//       start += 1;
//       return next;
//     }
//     return undefined;
//   };
// }

//-----Crockford's realization of fromTo() fucntion----
function fromTo(start, end){
    return to(from(start), end);
  }


//---------------My realization of element() function---------------
// function element(array, gen){
//   return function(){
//     if(typeof gen !== 'undefined'){
//       var index = gen();
//       if(index !== undefined){
//       return array[index];
//       }
//     }else{
//       return array.forEach(function(element){
//         log(element);
//       });
//     }
//   };
// }


//------------Fucntion element(array, gen) - modified (now gen is optional argument). Crockford's realization----

function element(array, gen){
  if(gen === undefined){
    gen = fromTo(0, array.length);
  }
  return function(){
    var index = gen();
    if(index !== undefined){
      return array[index];
    }
  };
}

function collect(gen, array){
  return function(){
    var value = gen();
    if(value !== undefined){
        array.push(value);
    }
    return value;
  };
}

function filter(gen, predicate){
  return function(){
    var value;
    do{
      value = gen();
    }while(value !== undefined
      && !predicate(value)
    );
    return value;
  };
}

function concat(gen1, gen2){
  var gen = gen1;
  return function(){
    var value = gen();
    if(value !== undefined){
      return value;
    }
    gen = gen2;
    return gen();
  };
}

//-------------Function challenge 6 lesson 43---------------------

function gensymf(prefix){
  var number = 0;
  return function(){
    number += 1;
    return prefix + number;
  };
}

function fibonaccif(a,b){
  var i = 0;
  return function(){
    var next;
    switch(i){
      case 0:
        i=1;
        return a;
      case 1:
        i=2;
        return b;
      default:
        next = a + b;
        a = b;
        b = next;
        return next;
    }
  };
}


//---------Function challenge 7 lesson 44-----------------

function counter(value){
  return {
    up: function(){
      return value += 1;
    },
    down: function(){
      return value -= 1;
    }
  };
}


//----------My realization of revocable fucntion----------
// function revocable(binary){
//   var count = 1;
//   return {
//     invoke: function(a,b){
//       count -= 1;
//       return binary(a,b);
//     },
//     revoke: function(){
//       if(count < 1){
//         binary = undefined;
//       }
//     }
//   };
// }

//-------Crockford's realization of revocable function-------
function revocable(binary){
  return {
    invoke: function(a,b){
      if(binary !== undefined){
        return binary(a,b);
      }
    },
    revoke: function(){
        binary = undefined;
      }
    };
};


function m(value, source){
  return{
    value: value,
    source: (typeof source === 'string')
        ? source
        : String(value)
  };
}

function addm(m1, m2){
  return m(
    m1.value + m2.value,
    "(" + m1.source + "+" + m2.source + ")"
  );
}

function liftm(binary, str){
  return function(a,b){
    if(typeof a === 'number'){
      a = m(a);
    }
    if(typeof b === 'number'){
      b = m(b);
    }
    return m(
      binary(a.value, b.value),
      "(" + a.source + str + b.source + ")"
    );
  };
}

function exp(value){
  return (Array.isArray(value))
      ? value[0](
        exp(value[1]),
        exp(value[2])
      )
      : value;
}


//-----Retursion: a function returns itself--------------
function addg(first){
  function more(next){
    if(next === undefined){
      return first;
    }
    first += next;
    return more;
  };
  if(first !== undefined){
    return more;
  }
}

//-----liftg(binary) - takes binary function and applies it to many invokations-----
function liftg(binary){
  return function(first){
    if(first === undefined){
      return first;
    }
    return function more(next){
      if(next === undefined){
        return first;
      }
      first = binary(first, next);
      return more;
    };
  };
}

function arrayg(first){
  var array = [];
  function more(next){
    if(next === undefined){
      return array;
    }
    array.push(next);
    return more;
  };
  return more(first);
}


//This function i wrote by myself, and its the same as it was done by Crockford - YAYYY!!!!! ------
function continuize(unary){
  return function(callback, arg){
    return callback(unary(arg));
  };
}


//---------------Checking the result---------------
var sqrtc = continuize(Math.sqrt);
sqrtc(alert, 81);
//alert("This ia alert");
