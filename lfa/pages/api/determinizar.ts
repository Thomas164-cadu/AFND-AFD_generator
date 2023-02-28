// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  simbols: any,
  estados: any,
  defined: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        const { afnd } = req.body;

        var bnfs: any = [];
        var normalTokens: any = [];
        var separate = afnd.split("\n");

        separate.map((sentence: any)=>{
            if(sentence.includes('<')){
                bnfs.push(sentence);
            }else{
                normalTokens.push(sentence);
            }
        })

        var first = normalTokens.join('\n').split(/\s*\n\s*/);
        var second = bnfs.join('\n').split(/\s*\n\s*/);
        var holdAux: any = [];
        var holdAuxBnf: any = [];
        var contador = 0;
        var tokens = [];
        var simbols: any = [];
        var estados: any = [];
        var simbolsEstados: any = [];

        first.map((token: any, count: number)=>{

            tokens[count] = token;
            var aux: any = [];

            token.split('').map((simbol: any, posi: number)=>{

                simbols.includes(simbol) ? simbols = simbols : simbols.push(simbol);
                if(posi == 0){
                    estados.includes('S') ? estados = estados: estados.push('S');
                    aux[posi] = '<S>::=' + simbol + String.fromCharCode(65+contador);

                    simbolsEstados.push({origem:'S', simbol: simbol, estado: String.fromCharCode(65+contador)});
                }else {
                    if((token.split('').length - 1) != posi){
                        aux[posi] = '<'+String.fromCharCode(64+contador)+'>::='+simbol+String.fromCharCode(65+contador);

                        estados.includes(String.fromCharCode(64+contador)) || estados.includes('*'+String.fromCharCode(64+contador)) ? estados = estados: estados.push(String.fromCharCode(64+contador));
                    
                        simbolsEstados.push({origem: String.fromCharCode(64+contador),simbol: simbol, estado: String.fromCharCode(65+contador)});
                    }else{
                        aux[posi] = '<'+String.fromCharCode(64+contador)+'>::='+simbol+String.fromCharCode(65+contador) 
                        aux[posi+1] ='<'+String.fromCharCode(65+contador)+'>::=&';

                        estados.includes(String.fromCharCode(64+contador)) || estados.includes('*'+String.fromCharCode(64+contador)) ? estados = estados: estados.push(String.fromCharCode(64+contador));
                        estados.includes(String.fromCharCode(65+contador)) || estados.includes('*'+String.fromCharCode(65+contador)) ? estados = estados: estados.push('*'+String.fromCharCode(65+contador));
                    
                        simbolsEstados.push({origem: String.fromCharCode(64+contador), simbol: simbol, estado: String.fromCharCode(65+contador)});
                        simbolsEstados.push({origem: String.fromCharCode(65+contador), simbol: simbol, estado: '*'+String.fromCharCode(65+contador)});
                    }
                }

                contador ++;
                
            })
            
            holdAux[count] = aux;


        });

        second.map((bnf: any, count: number)=>{

            var aux: any = [];

            bnf.match(/[a-z]/g).map((simbol: any, posi: number)=>{

                simbols.includes(simbol) ? simbols = simbols : simbols.push(simbol);
                
                if(bnf.includes('S')){
                    estados.includes('S') ? estados = estados: estados.push('S');
                    aux[posi] = '<S>::=' + simbol + String.fromCharCode(65+contador);

                    simbolsEstados.push({origem:'S', simbol: simbol, estado: String.fromCharCode(65+contador)});
                }else {
                    if((bnf.match(/[a-z]/g).length - 1) != posi){
                        aux[posi] = '<'+String.fromCharCode(65+contador)+'>::='+simbol+String.fromCharCode(65+contador);

                        simbolsEstados.push({origem: String.fromCharCode(65+contador), simbol: simbol, estado: String.fromCharCode(65+contador)});
                    }else{
                        aux[posi] = '<'+String.fromCharCode(65+contador)+'>::='+simbol+String.fromCharCode(65+contador)
                        aux[posi+1] ='<'+String.fromCharCode(65+contador)+'>::=&';

                        estados.includes(String.fromCharCode(65+contador)) || estados.includes('*'+String.fromCharCode(65+contador)) ? estados = estados: estados.push('*'+String.fromCharCode(65+contador));
                    
                        simbolsEstados.push({origem: String.fromCharCode(65+contador), simbol: simbol, estado: '*'+String.fromCharCode(65+contador)});
                    }
                }
            });

            holdAuxBnf[count] = aux;

        });

        const newArray:any = [];

        simbolsEstados.forEach((obj:any) => {
          const existingObj = newArray.find((item: any) => item.simbol === obj.simbol && item.estado === obj.estado);
          if (!existingObj) {
            newArray.push(obj);
          }
        });
        

        res.status(200).json({simbols: simbols, estados: estados, defined: newArray});
      } else {
      }
}
