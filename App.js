import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList,Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import {Ionicons} from "react-native-vector-icons"

export default function App() {
  const [nomeProduto, setNomeProduto] = useState("")
  const [precoProduto, setPrecoProduto] = useState("")
  const [listaProdutos, setListaProdutos] = useState([])
  const [produtoEditado,setProdutoEditado]=useState(null)

  //O useEffect é utilizado para buscar os dados quando montado
  useEffect(() => {
    BuscarDados()
  }, [])

  async function Salvar() {
    //Ocultando teclado
    Keyboard.dismiss()

    let produtos = []

    //Condição para verificar se há alguma coisa no banco, havendo, ele carrega no
    //array produto
    if (await AsyncStorage.getItem("PRODUTOS") != null) {
      produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS"))
    }
    //Verifica se o produto está sendo editado ou se é um cadastro novo
    if(produtoEditado){
      produtos[produtoEditado.index] = {nome:nomeProduto,preco:precoProduto}
    }else{
      produtos.push({ nome: nomeProduto, preco: precoProduto })
    }

    

    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(produtos))

    alert(produtoEditado?"PRODUTO ATUALIZADO":"PRODUTO CADASTRADO")

    //Limpando formulário
    setNomeProduto('')
    setPrecoProduto()

    BuscarDados()
  }

  async function BuscarDados() {
    const p = await AsyncStorage.getItem("PRODUTOS")
    setListaProdutos(JSON.parse(p))
  }

  async function DeletarProduto(index) {
    const tempDados = listaProdutos
    const dados = tempDados.filter((item, ind) => {
      return ind !== index
    });

    setListaProdutos(dados)
    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(dados))
  }
  function EditarProduto(index){
    const produto = listaProdutos[index]
    setNomeProduto(produto.nome)
    setPrecoProduto(produto.preco)
    setProdutoEditado({index})
  }


  return (
    <View style={styles.container}>
      <Text>CADASTRO</Text>
      <TextInput
        placeholder='Digite o nome do produto'
        style={styles.input}
        value={nomeProduto}
        onChangeText={(value) => setNomeProduto(value)}
      />
      <TextInputMask
        type='money'
        placeholder='Digite o preço do produto'
        keyboardType='numeric'
        style={styles.input}
        value={precoProduto}
        onChangeText={(value) => setPrecoProduto(value)}
      />
      <TouchableOpacity style={styles.btn} onPress={Salvar}>
        <Text style={{ color: "white" }}>{produtoEditado?"ATUALIZAR":"CADASTRAR"}</Text>
      </TouchableOpacity>


      <FlatList
        data={listaProdutos}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.listarFlat}>
              <View>
                <Text>NOME: {item.nome} - PRECO:{item.preco}</Text>                
              </View>
              <View style={{flexDirection:'row'}}>
                  <TouchableOpacity style={styles.btnExcluir} onPress={() => DeletarProduto(index)}>
                    <Text>Excluir</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.btnEditar} onPress={() => EditarProduto(index)}>
                    <Text>Editar</Text>
                  </TouchableOpacity>
                </View>
            </View>
          )
        }}
      />


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 30
  },
  input: {
    borderWidth: 1,
    height: 50,
    width: 300,
    borderRadius: 15,
    marginTop: 10
  },
  btn: {
    backgroundColor: "blue",
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 10
  },
  listarFlat: {
    borderWidth: 1,
    width: 300,
    height: 70,
    borderRadius: 15,
    marginVertical: 3,
    alignItems: "center",
    justifyContent: "center"
  },
  btnExcluir: {
    backgroundColor: 'red',
    flexDirection: 'column',
    justifyContent: "space-around",
    width: 70,
    height: 25,
    borderRadius: 15,
    alignSelf: "flex-end",
    alignItems: 'center'
  },
  btnEditar: {
    backgroundColor: 'orange',
    flexDirection: 'column',
    justifyContent: "space-around",
    width: 70,
    height: 25,
    borderRadius: 15,
    alignSelf: "flex-end",
    alignItems: 'center',
    marginLeft:10,
    marginTop:10
  }
});
