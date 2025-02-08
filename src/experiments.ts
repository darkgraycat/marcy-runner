console.log("EXPERIMENTS START");


// function Something<T>(config: T) {
//     return class Something {
//         static readonly config = config;
// 
//     }
// }
// 
// const someConfig = {
//     keyLeft: "A",
//     keyRight: "D"
// }
// class Some extends Something(someConfig) {
//     constructor() {
//         super()
//         // here some logic for keys
//     }
// }
// 
// const some = new Some();
// console.log(some.keyLeft);
// console.log(some.keyRight);


type ConfigToInstance<T> = {
  [K in keyof T]: T[K];
};

function Something<T extends object>(config: T) {
  return class Something {
    static readonly config = config;

    constructor() {
      Object.assign(this, config);
    }
  } as { new(): ConfigToInstance<T> } & { config: T };
}

class Some extends Something({
  keyLeft: "A",
  keyRight: "D"
}) {
  constructor() {
    super();
    // Now TypeScript knows about keyLeft and keyRight
    console.log(this.keyLeft);    // TypeScript knows this is "A"
    console.log(this.keyRight);   // TypeScript knows this is "D"
  }

  // You can also add methods that use the config
  moveLeft() {
    console.log(`Moving left using ${this.keyLeft}`);
  }
}


// Usage
const some = new Some();
console.log(some.keyLeft);     // TypeScript knows this is "A"
console.log(some.keyRight);    // TypeScript knows this is "D"

// Static config is also properly typed
console.log(Some.config.keyLeft);    // TypeScript knows this is "A"
console.log(Some.config.keyRight);   // TypeScript knows this is "D"


console.log("EXPERIMENTS END");
