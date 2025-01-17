import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from './firebaseConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function StudentListScreen({ navigation }) {
  const [students, setStudents] = useState([]);

  // Récupérer les étudiants depuis Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), snapshot => {
      const loadedStudents = snapshot.docs.map(doc => ({
        id: doc.id,

        name: doc.data().name || '',
        course: doc.data().course || '',
      }));
      setStudents(loadedStudents);
    });
    return unsubscribe;
  }, []);

  const deleteStudent = async (id) => {
    try {
      const studentDoc = doc(db, "students", id);
      await deleteDoc(studentDoc);
      showToast("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student: ", error);
      showToast("Error deleting student");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student List</Text>
      <FlatList
        data={students}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.name} - {item.course}</Text>
            <TouchableOpacity onPress={() => deleteStudent(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddStudent')}
      >
        <Text style={styles.addButtonText}>Add Student</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddStudentScreen({ navigation }) {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
   const [grade, setGrade] = useState(''); // Nouvel état pour la note

  const addStudent = async () => {
    if (name.trim() && course.trim() && grade.trim()) {
      try {
        await addDoc(collection(db, "students"), {
          name: name.trim(),
          course: course.trim(),
          grade: grade.trim(), // Ajouter la note
        });
        setName('');
        setCourse('');
         setGrade('');
        showToast("Student added successfully");
        navigation.goBack(); // Retour à la liste après ajout
      } catch (error) {
        console.error("Error adding student: ", error);
        showToast("Error adding student");
      }
    } else {
      showToast("Please provide both name, course and grade.");
    }
  };

  return (
    <View style={styles.editContainer}>
      <TextInput
        style={styles.editInput}
        value={name}
        onChangeText={setName}
        placeholder="Student Name"
      />

      <TextInput
        style={styles.editInput}
        value={course}
        onChangeText={setCourse}
        placeholder="Student Course"
      />
      <TouchableOpacity style={styles.updateButton} onPress={addStudent}>
        <Text style={styles.updateButtonText}>Add Student</Text>
      </TouchableOpacity>
    </View>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StudentList">
        <Stack.Screen name="StudentList" component={StudentListScreen} />
        <Stack.Screen name="AddStudent" component={AddStudentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#173753',
    marginBottom: 20,
    textAlign: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editContainer: {
    flex: 1,
    padding: 20,
  },
  editInput: {
    borderColor: '#FF0000',
    borderWidth: 20,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AppNavigator;