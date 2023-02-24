

module.exports = {
    async afdFunction(req, res) {
        try{
            const afnd = `se
entao
senao
<S> ::= a<A> | e<A> | i<A> | o<A> | u<A>
<A> ::= a<A> | e<A> | i<A> | o<A> | u<A> | ε`

            //console.log(afnd);

            var bnfs = [];
            var normalTokens = [];
            var separate = afnd.split("\n");

            separate.map((sentence)=>{
                if(sentence.includes('<')){
                    bnfs.push(sentence);
                }else{
                    normalTokens.push(sentence);
                }
            })

            console.log(bnfs.join('\n'));
            var first = normalTokens.join('\n').split(/\s*\n\s*/);
            var second = bnfs.join('\n').split(/\s*\n\s*/);
            var holdAux = [];
            var holdAuxBnf = [];
            var contador = 0;
            var tokens = [];
            var finalAnswer = [];

            first.map((token, count)=>{

                tokens[count] = token;
                var aux = [];

                token.split('').map((simbol, posi)=>{
                    
                    if(contador == 0){
                        aux[posi] = '<S>::=' + simbol + 'A';
                    }else {
                        if((token.split('').length - 1) != posi){
                            aux[posi] = '<'+String.fromCharCode(64+contador)+'>::='+simbol+String.fromCharCode(65+contador);
                        }else{
                            aux[posi] = '<'+String.fromCharCode(64+contador)+'>::='+simbol+String.fromCharCode(65+contador) 
                            aux[posi+1] ='<'+String.fromCharCode(65+contador)+'>::=&';
                        }
                    }

                    contador ++;
                    
                })
                
                holdAux[count] = aux;


            });

            second.map((bnf, count)=>{

                var aux = [];

                bnf.match(/[a-z]/g).map((simbol, posi)=>{
                    if(posi == 0){
                        aux[posi] = '<S>::=' + simbol + String.fromCharCode(65+contador);
                    }else {
                        if((bnf.match(/[a-z]/g).length - 1) != posi){
                            aux[posi] = '<'+String.fromCharCode(65+contador)+'>::='+simbol+String.fromCharCode(65+contador);
                        }else{
                            aux[posi] = '<'+String.fromCharCode(65+contador)+'>::='+simbol+String.fromCharCode(65+contador) 
                            aux[posi+1] ='<'+String.fromCharCode(65+contador)+'>::=&';
                        }
                    }
                });

                holdAuxBnf[count] = aux;
            });

            holdAux.map((conj)=>{
                holdAuxBnf.map((agreg)=>{
                    conj.map((gramar)=>{
                        agreg.map((gramatic)=>{
                            var simbol = gramar.match(/[a-z]/g);
                            if(simbol){
                                if(gramar.indexOf(simbol[0]) !== -1 && gramatic.indexOf(simbol[0]) !== -1){
                                    console.log(gramar);
                                    console.log(gramatic);
                                }
                            }
                        })
                    })
                })
            })

/*
            holdAux.map((answer, pos)=>{
                holdAuxBnf.map((asw)=>{
                    finalAnswer[pos+1] = asw[asw.length-1] + ' => variavel' ;
                })
                var getAsw = answer[answer.length-1] + ' => ' + tokens[pos];

                finalAnswer[pos] = getAsw;

            })
*/



            res.json({finalAnswer, holdAux, holdAuxBnf});
        }catch(error){
            console.log(error);
        }
    }
}