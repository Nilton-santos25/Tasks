import React from 'react'
import {
    View,
    Text,
    StyleSheet, 
    TouchableWithoutFeedback,
    TouchableOpacity,
    Touchable
} from 'react-native'

import Swipeable from 'react-native-gesture-handler/Swipeable' //import para delete personalizado

import Icon from 'react-native-vector-icons/FontAwesome'


import moment from 'moment'
import 'moment/locale/pt-br' //colocando as datas no formato brasileiro, pois está em inglês

import comomStyles from '../comonStyles'

export default props => {

    const doneOrNotStyle = props.doneAt != null ?
    { textDecorationLine: 'line-through' } : {}

    const date = props.doneAt ? props.doneAt : props.estimateAt

    const formattedDate = moment(date).locale('pt-br')
        .format('ddd, D [de] MMMM')

    //função que deleta ai puxar para a direita    
    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right}
                onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Icon name="trash" size={30} color="#FFF" />
            </TouchableOpacity>
        )
    }

    //função que deleta ao puxar para a esquerda    
    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Icon name="trash" size={30} color="#FFF"
                     style={styles.excludeIcon} />
                <Text style={styles.excludtext}>Excluir</Text>
            </View>
        )
    }
   return (
        <Swipeable
            //funcao que irá deletar ao puxar 
            renderRightActions={getRightContent} 
            renderLeftActions={getLeftContent}
            //apagando as tarefas ao deslizar o botao 
            onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}> 
                <View style={styles.container}>
                    <TouchableWithoutFeedback 
                        onPress={() => props.onToggleTask(props.id)}>
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>
                    </TouchableWithoutFeedback>
                    <View>
                        <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                    
                </View>
        </Swipeable>
        
    )
}

function getCheckView(doneAt) {
    if(doneAt != null ) {
        return(
            <View style={styles.done}>
                {/* colocando um icone para as tarefas prontas */}
               <Icon name='check' size={20} color='#FFF'></Icon>
            </View>
        )
    } else {
        return (
            <View style={styles.pending}></View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', //alinhamento dos textos na linha
        borderColor: '#AAA', //cor da borda do componente 
        borderBottomWidth: 1, // largura da borda
        alignItems: 'center',
        paddingVertical: 10, // espacamento vertical
        backgroundColor: '#FFF'
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',//alinhando a bolinha das atividades pendente na vertical
        justifyContent: 'center' // alinhando a bolinha das atividades na horizontal
    },
    // estilo que gera a bolinha quando a atividade estiver pedente 
    pending: {
        height: 25, 
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    // estilo que gera a bolinha quando a atividade estiver pronta 
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        fontFamily: comomStyles.fontFamily,
        color: comomStyles.colors.mainText,
        fontSize: 15
    }, 
    date: {
        fontFamily: comomStyles.fontFamily,
        color: comomStyles.colors.subText,
        fontSize: 12
    },
    right: {
        backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    excludeIcon: {
        marginLeft: 10
    },
    excludtext: {
        fontFamily: comomStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    }
})