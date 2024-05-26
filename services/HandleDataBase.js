import * as FileSystem from 'expo-file-system';
import * as SQLite from "expo-sqlite";
import * as Sharing from 'expo-sharing'; // Corrigido: importação do módulo expo-sharing
const dbName = "db.db";
const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
const DataBase = SQLite.openDatabase(dbName);
import exerciciosData from "./ExerciciosData.json";
import { useState } from 'react';

const deleteDatabase = async () => {
  const fileInfo = await FileSystem.getInfoAsync(dbPath);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(dbPath);
  }
};

const CreateTables = async () => {
  //await deleteDatabase();
  DataBase.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Exercicios (Id_Exercicio INTEGER PRIMARY KEY AUTOINCREMENT, Musculo TEXT , Descricao TEXT , Nome_Exercicio TEXT , Series TEXT , Repeticoes TEXT , Foco_Muscular TEXT, Creator TEXT )"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Dieta (Id_Utilizador TEXT,Calorias FLOAT, Carboidratos FLOAT, Proteinas FLOAT, Consumo_Agua FLOAT, Gorduras FLOAT,TMB FLOAT)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Utilizadores (Nome TEXT, Idade INTEGER, Peso FLOAT, Altura FLOAT, Sexo TEXT, Objetivo TEXT, Atividade_Fisica TEXT)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Favoritos (Id_Utilizador TEXT, Id_Exercicio INTEGER)"
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

const InsertDataDieta = (Id_Utilizador,Calorias, Carboidratos, Proteinas, Consumo_Agua, Gorduras, TMB) => {
  DataBase.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO Dieta (Id_Utilizador, Calorias, Carboidratos, Proteinas, Consumo_Agua, Gorduras, TMB) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [Id_Utilizador, Calorias, Carboidratos, Proteinas, Consumo_Agua, Gorduras, TMB],
      (_, result) => {
        console.log("Inserido com Sucesso!!");
      },
      (_, error) => {
        console.log("Algo deu errado!!! ", error);
      }
    );
  });
  shareDatabase();
};

const InserirDataUtilizador = (Nome, Idade, Peso, Altura, Sexo, Objetivo, Atividade_Fisica) => {
  DataBase.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO Utilizadores (Nome, Idade, Peso, Altura, Sexo, Objetivo, Atividade_Fisica) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [Nome,Idade, Peso, Altura, Sexo, Objetivo, Atividade_Fisica],
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

const BuscarExercicios = (musculo, navigation) => {
  console.log(musculo);
  return new Promise((resolve, reject) => {
    DataBase.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Exercicios WHERE Musculo = ?',
        [musculo],
        (_, { rows }) => {
          const exerciciosArray = rows._array;
          resolve(exerciciosArray); // Resolve a promessa com os dados
          navigation.navigate("Exercicio", { dados: exerciciosArray, musculo: musculo });
        },
        (_, error) => {
          console.error('Erro ao buscar exercícios:', error);
          reject(error);
        }
      );
    });
  });
};

const Favoritar = (Nome_Exercicio, Id_Utilizador) => {
  return new Promise((resolve, reject) => {
    let Id;
    DataBase.transaction((tx) => {
      tx.executeSql(
        "SELECT Id_Exercicio FROM Exercicios WHERE Nome_Exercicio = ?",
        [Nome_Exercicio],
        (_, result) => {
          if (result.rows.length > 0) {
            Id = result.rows.item(0).Id_Exercicio;
            tx.executeSql(
              "SELECT COUNT(Id_Exercicio) AS count FROM Favoritos WHERE Id_Exercicio = ? AND Id_Utilizador = ?",
              [Id, Id_Utilizador],
              (_, result) => {
                const count = result.rows.item(0).count;
                if (count === 1) {
                  alert("Exercício já adicionado aos favoritos");
                } else {
                  tx.executeSql(
                    "INSERT INTO Favoritos (Id_Utilizador, Id_Exercicio) VALUES (?, ?)",
                    [Id_Utilizador, Id],
                    (_, result) => {
                      alert("Exercício inserido aos favoritos");
                    }
                  );
                }
              }
            );
          } else {
            alert("Exercício não encontrado");
          }
        }
      );
    });
  });
};

const BuscarFavoritos = (Id_Utilizador) => {
  return new Promise((resolve, reject) => {
    let IDs = [];
    let dados = [];
    
    DataBase.transaction((tx) => {
      tx.executeSql(
        "SELECT Id_Exercicio FROM Favoritos WHERE Id_Utilizador = ?",
        [Id_Utilizador],
        (_, { rows }) => {
          IDs = rows._array.map(row => row.Id_Exercicio);
          
          if (IDs.length === 0) {
            resolve([]); // Resolva com um array vazio se não houver favoritos
            return;
          }

          IDs.forEach((id, index) => {
            tx.executeSql(
              "SELECT * FROM Exercicios WHERE id_Exercicio = ?",
              [id],
              (_, { rows }) => {
                dados.push(rows._array[0]);

                if (index === IDs.length - 1) {
                  resolve(dados); // Resolva a Promise quando todos os dados forem coletados
                }
              },
              (_, error) => {
                reject(error); // Rejeita a Promise em caso de erro
              }
            );
          });
        },
        (_, error) => {
          reject(error); // Rejeita a Promise em caso de erro ao buscar IDs
        }
      );
    });
  });
};

const RemoverFavorito = (Id_Utilizador, Id_Exercicio) => {
  return new Promise((resolve, reject) => {
    DataBase.transaction(tx => {
      tx.executeSql(
        "DELETE FROM Favoritos WHERE Id_Utilizador = ? AND Id_Exercicio = ?",
        [Id_Utilizador, Id_Exercicio],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};


export { CreateTables, InsertDataExercicios, shareDatabase, InsertDataDieta, InserirDataUtilizador, BuscarExercicios, Favoritar, BuscarFavoritos, RemoverFavorito};
