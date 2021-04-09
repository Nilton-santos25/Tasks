import React, { Component } from 'react'
import {
        Text,
        View,
        ImageBackground,
        StyleSheet,
        FlatList,
        TouchableOpacity,
        Platform,
        Alert
} from 'react-native'

import AsyncStorage from "@react-native-community/async-storage"
import moment from 'moment' //importando a data atual
import 'moment/locale/pt-br'
import Icon from 'react-native-vector-icons/FontAwesome'  //importando os icones para serem usados 

import comomStyles from '../comonStyles' //importando estilos padroes para a aplicação
import todayImage from '../../assets/imgs/today.jpg' //importando a imgem que está na pasta assets
import Task from '../components/Task'
import AddTask from './AddTasks'


const initialState = {
    showDoneTasks: true, //mostra lista de tarefas concluidas
        showAddTask: false,
        visibleTasks: [], //array para mostrar as tarefas concluidas 
        tasks: []
}

export default class TaskList extends Component {  //componente baseado em classe

    state = {
        ...initialState //operador spread        
    }

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('tasksState')
        const state = JSON.parse(stateString) || initialState
        this.setState(state, this.filterTasks)
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }
    
    filterTasks = () => {
        let visibleTasks = null 
        if(this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending) //pega apenas as taks pendentes e não as concluidas
        }

        this.setState({ visibleTasks })
        AsyncStorage.setItem('tasksState', JSON.stringify(this.state))
    }

    //Adicioando uma nova Task no Array
    addTask = newTask => {
        if(!newTask.desc || !newTask.desc.trim()) { //trim tira todos os espacoes vazios que sao digitados no campo
            Alert.alert('Dados Inválidos', 'Descrição nao informada!')
            return
        }

        const tasks = [...this.state.tasks] //operador spread[...] para gerar um clone da aplicação
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })

        this.setState({ tasks, showAddTask: false }, this.filterTasks)
    }

    /*funcao que chama o componente filho tasks que e recebida através de props
    para alterar o estado do componente  que altera as tarefas pelo usuário
    que está no componente TaskList 
    <TouchableWithoutFeedback 
                onPress={() => props.toggleTask(props.id)}>
    */            
    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
       tasks.forEach(task => {
           if(task.id === taskId) {
               task.doneAt = task.doneAt ? null : new Date()
           }
       })

       this.setState({ tasks })
    }

    //função para deletar as Taks cadastradas
    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({ tasks }, this.filterTasks)

    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM') //armazenando a data em uma constante
        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                   onCancel={() => this.setState({ showAddTask: false })} 
                   onSave={this.addTask} />
                <ImageBackground source={todayImage}
                    style={styles.background}>
                        <View style={styles.iconBar}>
                            <TouchableOpacity onPress={this.toggleFilter}>
                                < Icon name={this.state.showDoneTasks ? "eye" : "eye-slash"}
                                    size={20} color={comomStyles.colors.secondary}/>
                            </TouchableOpacity>
                        </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subTitle}>{today}</Text> 
                    </View>    
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks} //lista de objetos do javascript com chave e valor 
                        keyExtractor={item => `${item.id}`} // pegando o id de cada objeto do array state
                        renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask}/>} /> 
                </View>
                <TouchableOpacity style={styles.addButton}
                    activeOpacity={0.7}
                    onPress={() => this.setState({ showAddTask: true})}>
                    <Icon name="plus" size={20}
                    color={comomStyles.colors.secondary}/>    
                </TouchableOpacity>    
            </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1 //cresce a tela inteira no sentido vertical
    },

    /*significa que estamos dividindo a tela em 2
    a imagem que é o backgound ocupa 30%
    a tela que é o taskList ocupa 70%
    */
    background: {
        flex: 3
    },
    taskList: {
        flex: 7
    }, 
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end' // eixo principal, posiciona o texto embaixo
    },
    title: {
        fontFamily: comomStyles.fontFamily, //pega os estilos de comonStyles.js
        color: comomStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subTitle: {
        fontFamily: comomStyles.fontFamily,
        color: comomStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20, 
        marginBottom: 20

    }, 
    iconBar: {
        flexDirection: 'row', //define o eixo principal como linha
        marginHorizontal: 20,
        justifyContent: 'flex-end', //alinha o componente para o fim da linha
        marginTop: Platform.OS === 'ios' ? 40 : 10 //configuração baseada no sistema operacional
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: comomStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }

})