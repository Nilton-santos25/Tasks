import React, { Component } from 'react'
import { 
    Platform,
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput
} from 'react-native'

import moment from 'moment'

import DateTimePicker from '@react-native-community/datetimepicker'

import comonStyles from '../comonStyles'

const initialState = { desc: ' ', date: new Date(), showDatePicker: false }
export default class AddTask extends Component {

    state = {
        ...initialState
    }

    //criando uma nova tesk para ser salva, e adicionando a função save ao botao salvar da aplicação
    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        }

        this.props.onSave && this.props.onSave(newTask)
        this.setState({ ...initialState })
    }

    //funcao para pegar a data da tarefa, através do calendário que irá aparecer
    //devido a importação do <DateTimePicker>
    getDatePicker = () => {
        let datePicker = <DateTimePicker value={this.state.date}
            onChange={(_, date) => this.setState({ date, showDatePicker: false })}
            mode='date' />
        
        const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')    
    
    //alterações no dateTimePicker para dispositivos Android    
        if(Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                        <Text style={styles.date}> 
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker}
                </View>
            )

        }    
        return datePicker    
    }

    render() {
        return (
            <Modal transparent={true} visible={this.props.isVisible}
                onRequestClose={this.props.onCancel}
                animationType='slide'>
                <TouchableWithoutFeedback
                     onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>

                <View style={styles.container}>
                    <Text style={styles.header}>Nova Tarefa</Text>
                    <TextInput style={styles.input}
                        placeholder="Informe a Descrição..."
                        onChangeText={desc => this.setState({ desc })}
                        value={this.state.desc} />
                    {this.getDatePicker()}
                    <View style={styles.butttons}> 
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.buttton}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.buttton}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableWithoutFeedback
                     onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback> 
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0 , 0, 0.6)'
    },
    container: {
        backgroundColor: '#FFF'
    },
    header: {
        fontFamily: comonStyles.fontFamily,
        backgroundColor: comonStyles.colors.today,
        color: comonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18,
    },
    input: {
        fontFamily: comonStyles.fontFamily,
        width: '90%',
        height: 40,
       margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 3,
    },
    butttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttton: {
        margin: 20,
        marginRight: 30,
        color: comonStyles.colors.today
    }, 
    date: {
        fontFamily: comonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15,
    }
})