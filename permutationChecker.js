const string = "ABCD"

function permut(string) {
    if (string.length < 2) return string; // This is our break condition
  
    var permutations = []; // This array will hold our permutations
    for (let i = 0; i < string.length; i++) {
      var char = string[i];

      // Cause we don't want any duplicates:
      if (string.indexOf(char) != i) continue;  // if it has been used already, skip it
  
      let remainingString = string.slice(0, i) + string.slice(i + 1, string.length);

      for (let subPermutation of permut(remainingString))
        permutations.push(char + subPermutation)
    }
    return permutations;
  }

const permutationArray = permut(string)

for(i in permutationArray){
  console.log(permutationArray[i])
}