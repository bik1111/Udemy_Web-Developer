module.exports = func => { 
    return (req, res ,next) => {
        func(req,res,next).catch(next);
    }
}

//func는 전달.
// return : 실행되는 func를 가진 새로운 함수(func(req,res,next).catch(next)를 반환.

