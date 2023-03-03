import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TableContainer from '@mui/material/TableContainer';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface Item {
  estado: string;
  simbol: string;
  origem: string;
}

const createTable = (arr: Item[]) => {
  // Troca a posição das propriedades origem e estado em cada objeto de arr
  const newArr = arr.map(item => ({ origem: item.estado, simbol: item.simbol, estado: item.origem }));

  // Agrupa os estados e símbolos em uma matriz
  const tableData = newArr.reduce((acc: Record<string, any>, curr) => {
    const { origem, simbol, estado } = curr;
    if (!acc[estado]) {
      acc[estado] = {};
    }
    acc[estado][simbol] = acc[estado][simbol] ? [...acc[estado][simbol], origem] : [origem];
    return acc;
  }, {});

  // Obtém todos os símbolos únicos
  const symbols = Array.from(new Set(newArr.map((item) => item.simbol)));

  // Cria a tabela com as células preenchidas com os estados
  return (
    <Table sx={{ display: 'table', marginLeft: '20%', maxWidth: '1024px' }}>
      <TableHead>
        <TableRow>
          <TableCell>Origem/Estado</TableCell>
          {symbols.map((symbol, i) => (
            <TableCell key={i}>{symbol}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(tableData).map((estado, i) => (
          <TableRow key={i}>
            <TableCell>{estado}</TableCell>
            {symbols.map((symbol, j) => (
              <TableCell key={j}>{tableData[estado][symbol]?.join(", ")}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


const convertToDFA = (arr: Item[]) => {
  // Troca a posição das propriedades origem e estado em cada objeto de arr
  const newArr = arr.map(item => ({ origem: item.estado, simbol: item.simbol, estado: item.origem }));

  // Agrupa os estados e símbolos em uma matriz
  const tableData = newArr.reduce((acc: Record<string, any>, curr) => {
    const { origem, simbol, estado } = curr;
    if (!acc[estado]) {
      acc[estado] = {};
    }
    acc[estado][simbol] = acc[estado][simbol] ? [...acc[estado][simbol], origem] : [origem];
    return acc;
  }, {});

  // Encontra o estado inicial do AFD, que é o conjunto dos estados iniciais do AFND.
  const initialState = Array.from(new Set(newArr.filter(item => item.estado === 'S').map(item => item.origem)));

  const dfaTable: DFAItem[] = [{ state: initialState.join(''), transitions: {} }];
  const visitedStates: Record<string, boolean> = { [dfaTable[0].state]: true };
  const symbols = Array.from(new Set(newArr.map(item => item.simbol)));

  // Enquanto houver novos estados a serem visitados
  let index = 0;
  while (index < dfaTable.length) {
    const currentState = dfaTable[index];
    index++;
    for (const symbol of symbols) {
      const nextStates = new Set<string>();
      for (const state of currentState.state.split('')) {
        const transitions = tableData[state]?.[symbol] || [];
        transitions.forEach(t => nextStates.add(t));
      }

      if (nextStates.size === 0) {
        continue;
      }

      const nextState = Array.from(nextStates).sort().join('');
      if (!visitedStates[nextState]) {
        visitedStates[nextState] = true;
        dfaTable.push({ state: nextState, transitions: {} });
      }

      currentState.transitions[symbol] = nextState;
    }
  }

  console.log(dfaTable);

  return (
    <Table sx={{ display: 'table', marginLeft: '20%', maxWidth: '1024px' }}>
      <TableHead>
        <TableRow>
          <TableCell>Estado</TableCell>
          {symbols.map((symbol, i) => (
            <TableCell key={i}>{symbol}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {dfaTable.map((dfaItem, i) => (
          <TableRow key={i}>
            <TableCell>{dfaItem.state}</TableCell>
            {symbols.map((symbol, j) =>
              (<TableCell key={j}>{dfaItem.transitions[symbol]}</TableCell>)
            )}
          </TableRow>
        ))}
      </TableBody>

    </Table>
  );
};

const TableDFA = (props: any) => {
  return <div>{convertToDFA(props.array)}</div>;
};


const TableAFND = (props: any) => {
  return <div>{createTable(props.array)}</div>;
};

export default function Home() {
  const [automato, setAutomato] = useState('');
  const [afnd, setAFND] = useState([]);
  const [det, setDet] = useState(false);

  function onSubmit(e: any) {
    e.preventDefault();

    fetch("/api/determinizar/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ afnd: automato }),
    })
      .then((res) => res.json())
      .then((data) => setAFND(data));
  }

  function onDeterminized(e: any) {
    e.preventDefault();

    setDet(true);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>

        <div className={styles.grid}>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '100ch' }, textAlign: 'center'
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-multiline-flexible"
              name='automato'
              label="Autômato"
              multiline
              maxRows={10}
              value={automato}
              onChange={(e: any) => setAutomato(e.target.value)}
            />
            <Button variant="contained" endIcon={<SendIcon />} sx={{ paddingTop: '15px', paddingBottom: '15px', marginTop: '0.5%' }} onClick={onSubmit}>
              Gerar
            </Button>
          </Box>

        </div>

        <div className={styles.table}>
          <TableContainer sx={{ display: 'block' }}>
            {afnd.defined ?
              <TableAFND array={afnd.defined} />
              : null
            }
          </TableContainer>
          <Button variant="contained" endIcon={<SendIcon />} sx={{ paddingTop: '15px', paddingBottom: '15px', marginTop: '0.5%' }} onClick={onDeterminized}>
            Determinizar
          </Button>
        </div>

        <div className={styles.table}>
          {det ?
            <TableContainer sx={{ display: 'block' }}>
              {afnd.defined ?
                <TableDFA array={afnd.defined} />
                : null
              }
            </TableContainer>
            : null
          }
        </div>

      </ThemeProvider>
    </>
  )
}


