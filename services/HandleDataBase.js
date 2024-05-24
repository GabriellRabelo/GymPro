import * as FileSystem from 'expo-file-system';
import * as SQLite from "expo-sqlite";
import * as Sharing from 'expo-sharing'; // Corrigido: importação do módulo expo-sharing
const dbName = "db.db";
const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
const DataBase = SQLite.openDatabase(dbName);
import exerciciosData from "./ExerciciosData.json";

const deleteDatabase = async () => {
  const fileInfo = await FileSystem.getInfoAsync(dbPath);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(dbPath);
  }
};

const CreateTables = async () => {
  await deleteDatabase(); // Delete the old database if it exists
  DataBase.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Exercicios (id_Exercicio INTEGER PRIMARY KEY AUTOINCREMENT, Musculo TEXT , Descricao TEXT , Nome_Exercicio TEXT , Series TEXT , Repeticoes TEXT , Foco_Muscular TEXT, Creator TEXT )"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Dieta (id_Dieta INTEGER PRIMARY KEY AUTOINCREMENT, Calorias INTEGER, Carboidratos INTEGER, Proteinas INTEGER, Consumo_Agua INTEGER, Gorduras INTEGER)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Utilizadores (id_Utilizador INTEGER PRIMARY KEY AUTOINCREMENT, Nome TEXT, Idade INTEGER, Peso REAL, Altura REAL, Sexo TEXT, Objetivo TEXT, Atividade_Fisica TEXT)"
    );
  });
};

const InsertDataExercicios = () => {
  return new Promise((resolve, reject) => {
    DataBase.transaction((tx) => {
      tx.executeSql("SELECT * FROM Exercicios", [], (tx, results) => {
        const contRow = results.rows.length;
        if (contRow === 0) {
          exerciciosData.forEach((exercicio) => {
            tx.executeSql(
              "INSERT INTO Exercicios (Musculo, Descricao, Nome_Exercicio, Series, Repeticoes, Foco_Muscular, Creator) VALUES (?,?,?,?,?,?,?)",
              [
                exercicio.Musculo,
                exercicio.Descricao,
                exercicio.Nome_Exercicio,
                exercicio.Series,
                exercicio.Repeticoes,
                exercicio.Foco_Muscular,
                exercicio.creator,
              ],
              (tx, result) => {
                console.log("Exercicio inserido com sucesso!");
              },
              (tx, error) => {
                console.log("Erro ao inserir exercicio: ", error);
              }
            );
          });
        }
      });
    });
  });
};

const InsertDataDieta = (Calorias, Carboidratos, Proteinas, Consumo_Agua, Gorduras) => {
  DataBase.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO Dieta (Calorias, Carboidratos, Proteinas, Consumo_Agua, Gorduras) VALUES (?, ?, ?, ?, ?)",
      [Calorias, Carboidratos, Proteinas, Consumo_Agua, Gorduras],
      (_, result) => {
        console.log("Inserido com Sucesso!!");
      },
      (_, error) => {
        console.log("Algo deu errado!!! ", error);
      }
    );
  });
};

const InserirDataUtilizador = (Idade, Peso, Altura, Sexo, Objetivo, Atividade_Fisica) => {
  DataBase.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO Utilizadores (Nome, Idade, Peso, Altura, Sexo, Objetivo, Atividade_Fisica) VALUES (?, ?, ?, ?, ?, ?)",
      [Idade, Peso, Altura, Sexo, Objetivo, Atividade_Fisica],
      (_, result) => {
        console.log("Inserido com Sucesso!!");
      },
      (_, error) => {
        console.log("Algo deu errado!!! ", error);
      }
    );
  });
};

const shareDatabase = async () => {
  const fileInfo = await FileSystem.getInfoAsync(dbPath);
  if (fileInfo.exists) {
    await Sharing.shareAsync(
      dbPath, 
      { dialogTitle: 'Compartilhar ou copiar seu banco de dados via' }
    ).catch(error => {
      console.log(error);
    });
  } else {
    console.log('O arquivo de banco de dados não foi encontrado.');
  }
};

export { CreateTables, InsertDataExercicios, shareDatabase };
