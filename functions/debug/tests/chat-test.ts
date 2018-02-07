import Initialize from '../initialization'

export default class Test{
    constructor(){
        new Initialize().init();
    }

    public foo(){
        console.log("Test");
    }
}

new Test().foo();


