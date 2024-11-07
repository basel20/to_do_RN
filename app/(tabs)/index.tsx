import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from '@expo/vector-icons/AntDesign';
import Checkbox from 'expo-checkbox';

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export default function HomeScreen() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isChecked, setChecked] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const addTask = () => {
    if (title.trim() && description.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const editTask = (id: number) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setEditingTaskId(id);
    }
  };

  const saveTask = () => {
    if (editingTaskId !== null) {
      setTasks(tasks.map(task =>
        task.id === editingTaskId ? { ...task, title, description } : task
      ));
      setTitle('');
      setDescription('');
      setEditingTaskId(null);
    } else {
      addTask();
    }
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const closeTaskDetails = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>To-Do App</Text>
  
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Description ..."
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.descriptionInput]}
          multiline
        />
        <TouchableOpacity  onPress={saveTask}  style={styles.button}>
          <Text style={{color:'#fff', fontSize: 20, fontWeight: 'bold',}}>
            {editingTaskId ? "Save" : "Add"}
          </Text>
          </TouchableOpacity>

          <Text style={styles.note}>* Click on the task to see the details</Text>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
              <View style={{flex: 1, flexDirection:'row', gap:15, alignItems:'center' }}>
              <Checkbox value={isChecked} onValueChange={() => toggleTask(item.id)} style={{backgroundColor:item.completed? "#337a83":'#fff'}} />
              <TouchableOpacity onPress={() => openTaskDetails(item)} style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
                {item.title}
              </Text>
              <Text style={[styles.taskDescription, item.completed && styles.completedTask]} numberOfLines={2} ellipsizeMode="tail">
                {item.description}
              </Text>
              </TouchableOpacity>
              </View>
              
            <View style={styles.iconsView}>
              <TouchableOpacity onPress={() => editTask(item.id)}>
                <Icon name='edit' color={"#337a83"} size={25} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Icon name='delete' color={"red"} size={25} />
              </TouchableOpacity>
              </View>
          </View>
        )}
      />

  <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeTaskDetails}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <Text style={styles.modalTitle}>{selectedTask.title}</Text>
                <Text style={styles.modalDescription}>{selectedTask.description}</Text>
                <TouchableOpacity onPress={closeTaskDetails} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#005964',
    padding: 5,
    marginBottom: 10,
    height: 50,
    paddingLeft: 8,
    fontSize: 18
    // paddingRight: 5
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
    fontSize: 16
  },
  taskContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
    display:'flex',
    flexDirection:'row',
    alignItems:'center'
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 16,
    color: '#555',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  button:{
    backgroundColor:"#337a83",
    borderRadius: 20,
    height: 50,
    alignItems:'center',
    justifyContent: 'center'
  },
  iconsView:{
    display:'flex',
    flexDirection:'row',
    gap: 20
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign:'left'
  },
  closeButton: {
    backgroundColor: "#337a83",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  note:{
    fontSize: 10, 
    marginLeft: 8,
    marginTop: 10
  }
});